import express, { Request, Response } from 'express';
import { Assessment, User, Report } from '../models';
import { authenticateToken } from '../middleware/auth';
import { Op } from 'sequelize';
import { ASSESSMENT_QUESTIONS } from '../utils/assessments';
import { generateGhanaEducationMapping, ThinkingStyleProfile } from '../utils/ghana-education-mapping';

const router = express.Router();

// Get assessment questions
router.get('/questions/:type', authenticateToken, async (req: Request, res) => {
  try {
    const { type } = req.params;
    const questions = ASSESSMENT_QUESTIONS[type as keyof typeof ASSESSMENT_QUESTIONS];
    
    if (!questions) {
      return res.status(404).json({ message: 'Assessment type not found' });
    }
    
    res.json({ questions });
  } catch (error) {
    console.error('Get questions error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get all assessments for a user
router.get('/', authenticateToken, async (req: Request, res) => {
  try {
    const userId = (req as any).user.userId;
    const assessments = await Assessment.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']]
    });

    res.json({ assessments });
  } catch (error) {
    console.error('Get assessments error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Submit assessment
router.post('/submit', authenticateToken, async (req: Request, res) => {
  try {
    const userId = (req as any).user.userId;
    const { type, responses } = req.body;

    if (!type || !responses || !Array.isArray(responses)) {
      return res.status(400).json({ message: 'Invalid assessment data' });
    }

    // Validate assessment type
    const validTypes = Object.keys(ASSESSMENT_QUESTIONS);
    if (!validTypes.includes(type)) {
      return res.status(400).json({ message: 'Invalid assessment type' });
    }

    // Check if user already has an assessment of this type
    const existingAssessment = await Assessment.findOne({
      where: { userId, type }
    });

    if (existingAssessment) {
      return res.status(400).json({ message: 'Assessment of this type already completed' });
    }

    // Calculate scores by category
    const scores: { [key: string]: number } = {};
    const questionCounts: { [key: string]: number } = {};

    responses.forEach((response: { questionId: string; score: number }) => {
      const question = ASSESSMENT_QUESTIONS[type as keyof typeof ASSESSMENT_QUESTIONS]
        .find(q => q.id === response.questionId);
      
      if (question) {
        const category = question.category;
        if (!scores[category]) {
          scores[category] = 0;
          questionCounts[category] = 0;
        }
        scores[category] += response.score;
        questionCounts[category]++;
      }
    });

    // Calculate average scores
    Object.keys(scores).forEach(category => {
      scores[category] = scores[category] / questionCounts[category];
    });

    // Create assessment record
    const assessment = await Assessment.create({
      userId,
      type,
      responses,
      scores,
      completedAt: new Date()
    });

    res.status(201).json({ 
      message: 'Assessment submitted successfully',
      assessment 
    });
  } catch (error) {
    console.error('Submit assessment error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Generate report from assessments
router.post('/generate-report', authenticateToken, async (req: Request, res) => {
  try {
    const userId = (req as any).user.userId;
    
    // Get all assessments for the user
    const assessments = await Assessment.findAll({
      where: { userId },
      order: [['createdAt', 'ASC']]
    });

    if (assessments.length === 0) {
      return res.status(400).json({ message: 'No assessments found to generate report' });
    }

    // Calculate overall thinking style profile
    const overallProfile = calculateOverallProfile(assessments);
    
    // Generate education mapping
    const educationMapping = generateGhanaEducationMapping(overallProfile);
    
    // Generate insights
    const insights = generateInsights(assessments, overallProfile);

    // Create report
    const report = await Report.create({
      userId,
      assessments: assessments.map(a => a.id),
      overallProfile,
      educationMapping: {
        recommendedSHS: educationMapping.shsTracks || [],
        recommendedTertiary: educationMapping.tertiaryPrograms || [],
        careerSuggestions: educationMapping.careerSuggestions || []
      },
      insights,
      generatedAt: new Date()
    });

    res.status(201).json({ 
      message: 'Report generated successfully',
      report 
    });
  } catch (error) {
    console.error('Generate report error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get my assessments (alias for the above route)
router.get('/my-assessments', authenticateToken, async (req: Request, res) => {
  try {
    const userId = (req as any).user.userId;
    const userRole = (req as any).user.role;
    
    let userIds = [userId];
    
    // If user is a parent, include their linked students' assessments
    if (userRole === 'parent') {
      const user = await User.findByPk(userId);
      if (user && user.linkedStudents && user.linkedStudents.length > 0) {
        userIds = [...userIds, ...user.linkedStudents];
      }
    }
    
    const assessments = await Assessment.findAll({
      where: { 
        userId: {
          [Op.in]: userIds
        }
      },
      order: [['createdAt', 'DESC']]
    });

    res.json({ assessments });
  } catch (error) {
    console.error('Get my assessments error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get specific assessment
router.get('/:id', authenticateToken, async (req: Request, res) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.userId;

    const assessment = await Assessment.findOne({
      where: { id, userId }
    });

    if (!assessment) {
      return res.status(404).json({ message: 'Assessment not found' });
    }

    res.json({ assessment });
  } catch (error) {
    console.error('Get assessment error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Create new assessment
router.post('/', authenticateToken, async (req: Request, res) => {
  try {
    const userId = (req as any).user.userId;
    const { type, responses, scores } = req.body;

    const assessment = await Assessment.create({
      userId,
      type,
      responses,
      scores,
      completedAt: new Date()
    });

    res.status(201).json({ assessment });
  } catch (error) {
    console.error('Create assessment error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Helper function to calculate overall thinking style profile
function calculateOverallProfile(assessments: any[]): any {
  const profile = {
    primaryStyle: '',
    secondaryStyle: '',
    strengths: [] as string[],
    recommendations: [] as string[]
  };

  // Calculate average scores across all assessments
  const allScores: { [key: string]: number[] } = {};
  
  assessments.forEach(assessment => {
    Object.entries(assessment.scores).forEach(([category, score]) => {
      if (!allScores[category]) {
        allScores[category] = [];
      }
      allScores[category].push(score as number);
    });
  });

  // Calculate average scores
  const averageScores: { [key: string]: number } = {};
  Object.entries(allScores).forEach(([category, scores]) => {
    averageScores[category] = scores.reduce((sum, score) => sum + score, 0) / scores.length;
  });

  // Find primary and secondary styles
  const sortedStyles = Object.entries(averageScores)
    .sort(([, a], [, b]) => b - a);

  if (sortedStyles.length > 0) {
    profile.primaryStyle = sortedStyles[0][0];
    profile.secondaryStyle = sortedStyles.length > 1 ? sortedStyles[1][0] : sortedStyles[0][0];
  }

  // Generate strengths and recommendations based on scores
  if (averageScores.concrete_experience > 3.5) {
    profile.strengths.push('Hands-on learning', 'Practical application');
    profile.recommendations.push('Focus on experiential learning activities');
  }
  if (averageScores.reflective_observation > 3.5) {
    profile.strengths.push('Critical thinking', 'Reflective analysis');
    profile.recommendations.push('Engage in reflective journaling');
  }
  if (averageScores.abstract_conceptualization > 3.5) {
    profile.strengths.push('Theoretical understanding', 'Conceptual thinking');
    profile.recommendations.push('Study theoretical frameworks');
  }
  if (averageScores.active_experimentation > 3.5) {
    profile.strengths.push('Problem-solving', 'Innovation');
    profile.recommendations.push('Participate in project-based learning');
  }

  return profile;
}

// Helper function to generate insights
function generateInsights(assessments: any[], profile: any): any {
  return {
    learningPreferences: [
      'Visual learning through charts and diagrams',
      'Hands-on practice and experimentation',
      'Group discussions and collaborative learning'
    ],
    decisionMakingStyle: 'Analytical and systematic approach to problem-solving',
    communicationStyle: 'Direct and factual communication with emphasis on evidence'
  };
}

export default router;