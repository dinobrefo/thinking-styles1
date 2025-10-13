import express, { Request, Response } from 'express';
import { Report, User, Reflection } from '../models';
import { authenticateToken } from '../middleware/auth';
import { Op } from 'sequelize';

const router = express.Router();

// Get all reports for a user
router.get('/', authenticateToken, async (req: Request, res) => {
  try {
    const userId = (req as any).user.userId;
    const reports = await Report.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']]
    });

    res.json({ reports });
  } catch (error) {
    console.error('Get reports error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get my reports (alias for the above route)
router.get('/my-reports', authenticateToken, async (req: Request, res) => {
  try {
    const userId = (req as any).user.userId;
    const userRole = (req as any).user.role;
    
    let userIds = [userId];
    
    // If user is a parent, include their linked students' reports
    if (userRole === 'parent') {
      const user = await User.findByPk(userId);
      if (user && user.linkedStudents && user.linkedStudents.length > 0) {
        userIds = [...userIds, ...user.linkedStudents];
      }
    }
    
    const reports = await Report.findAll({
      where: { 
        userId: {
          [Op.in]: userIds
        }
      },
      order: [['createdAt', 'DESC']]
    });

    res.json({ reports });
  } catch (error) {
    console.error('Get my reports error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get specific report
router.get('/:id', authenticateToken, async (req: Request, res) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.userId;

    const report = await Report.findOne({
      where: { id, userId }
    });

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    res.json({ report });
  } catch (error) {
    console.error('Get report error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Create new report
router.post('/', authenticateToken, async (req: Request, res) => {
  try {
    const userId = (req as any).user.userId;
    const { assessments, overallProfile, educationMapping, insights } = req.body;

    const report = await Report.create({
      userId,
      assessments,
      overallProfile,
      educationMapping,
      insights,
      generatedAt: new Date()
    });

    res.status(201).json({ report });
  } catch (error) {
    console.error('Create report error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Submit reflection for a report
router.post('/:id/reflection', authenticateToken, async (req: Request, res) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.userId;
    const { content, rating } = req.body;

    if (!content || !rating) {
      return res.status(400).json({ message: 'Content and rating are required' });
    }

    const report = await Report.findOne({
      where: { id, userId }
    });

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    // Create reflection record
    await Reflection.create({
      userId,
      reportId: parseInt(id),
      content,
      rating
    });

    res.json({ message: 'Reflection submitted successfully' });
  } catch (error) {
    console.error('Submit reflection error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;