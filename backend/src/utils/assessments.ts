import { AssessmentType, IAssessmentQuestion } from '../models';
import { generateGhanaEducationMapping, ThinkingStyleProfile } from './ghana-education-mapping';

// Kolb's Experiential Learning Cycle Questions
export const KOLB_QUESTIONS: IAssessmentQuestion[] = [
  {
    id: 'kolb_1',
    text: 'I learn best when I can try things out and experiment with new ideas.',
    category: 'concrete_experience'
  },
  {
    id: 'kolb_2',
    text: 'I prefer to observe and reflect before taking action.',
    category: 'reflective_observation'
  },
  {
    id: 'kolb_3',
    text: 'I like to analyze information and create theories to understand concepts.',
    category: 'abstract_conceptualization'
  },
  {
    id: 'kolb_4',
    text: 'I learn most effectively when I can apply knowledge to solve real problems.',
    category: 'active_experimentation'
  },
  {
    id: 'kolb_5',
    text: 'I enjoy hands-on activities and learning through direct experience.',
    category: 'concrete_experience'
  },
  {
    id: 'kolb_6',
    text: 'I need time to think about what I have learned before moving forward.',
    category: 'reflective_observation'
  },
  {
    id: 'kolb_7',
    text: 'I prefer structured learning with clear theories and frameworks.',
    category: 'abstract_conceptualization'
  },
  {
    id: 'kolb_8',
    text: 'I like to test ideas and see immediate results from my actions.',
    category: 'active_experimentation'
  },
  {
    id: 'kolb_9',
    text: 'I learn better when I can connect new information to my personal experiences.',
    category: 'concrete_experience'
  },
  {
    id: 'kolb_10',
    text: 'I prefer to watch others and learn from their experiences.',
    category: 'reflective_observation'
  },
  {
    id: 'kolb_11',
    text: 'I enjoy reading and studying theoretical concepts.',
    category: 'abstract_conceptualization'
  },
  {
    id: 'kolb_12',
    text: 'I learn best by doing and making things happen.',
    category: 'active_experimentation'
  }
];

// Sternberg's Triarchic Theory Questions
export const STERNBERG_QUESTIONS: IAssessmentQuestion[] = [
  {
    id: 'sternberg_1',
    text: 'I excel at analyzing problems and finding logical solutions.',
    category: 'analytical'
  },
  {
    id: 'sternberg_2',
    text: 'I enjoy coming up with creative and original ideas.',
    category: 'creative'
  },
  {
    id: 'sternberg_3',
    text: 'I am good at applying knowledge to practical situations.',
    category: 'practical'
  },
  {
    id: 'sternberg_4',
    text: 'I prefer structured problems with clear right and wrong answers.',
    category: 'analytical'
  },
  {
    id: 'sternberg_5',
    text: 'I like to think outside the box and explore new possibilities.',
    category: 'creative'
  },
  {
    id: 'sternberg_6',
    text: 'I can adapt well to different environments and situations.',
    category: 'practical'
  },
  {
    id: 'sternberg_7',
    text: 'I enjoy breaking down complex problems into smaller parts.',
    category: 'analytical'
  },
  {
    id: 'sternberg_8',
    text: 'I am comfortable with ambiguity and uncertainty.',
    category: 'creative'
  },
  {
    id: 'sternberg_9',
    text: 'I can easily relate theoretical concepts to real-world applications.',
    category: 'practical'
  },
  {
    id: 'sternberg_10',
    text: 'I prefer to work with facts, data, and evidence.',
    category: 'analytical'
  },
  {
    id: 'sternberg_11',
    text: 'I enjoy brainstorming and generating multiple solutions.',
    category: 'creative'
  },
  {
    id: 'sternberg_12',
    text: 'I am good at reading people and understanding social dynamics.',
    category: 'practical'
  }
];

// Dual Process Theory Questions
export const DUAL_PROCESS_QUESTIONS: IAssessmentQuestion[] = [
  {
    id: 'dual_1',
    text: 'I make decisions quickly based on my first impression.',
    category: 'system_1'
  },
  {
    id: 'dual_2',
    text: 'I carefully analyze all available information before making decisions.',
    category: 'system_2'
  },
  {
    id: 'dual_3',
    text: 'I trust my gut feelings when making important choices.',
    category: 'system_1'
  },
  {
    id: 'dual_4',
    text: 'I prefer to take time to think through problems systematically.',
    category: 'system_2'
  },
  {
    id: 'dual_5',
    text: 'I often rely on patterns and past experiences to make decisions.',
    category: 'system_1'
  },
  {
    id: 'dual_6',
    text: 'I like to gather detailed information and consider all options.',
    category: 'system_2'
  },
  {
    id: 'dual_7',
    text: 'I make decisions based on what feels right in the moment.',
    category: 'system_1'
  },
  {
    id: 'dual_8',
    text: 'I prefer to use logical reasoning and evidence in decision-making.',
    category: 'system_2'
  },
  {
    id: 'dual_9',
    text: 'I can make quick judgments about people and situations.',
    category: 'system_1'
  },
  {
    id: 'dual_10',
    text: 'I like to weigh pros and cons before making important decisions.',
    category: 'system_2'
  },
  {
    id: 'dual_11',
    text: 'I often go with my initial reaction to problems.',
    category: 'system_1'
  },
  {
    id: 'dual_12',
    text: 'I prefer to research and analyze before taking action.',
    category: 'system_2'
  }
];

// Assessment Questions Map
export const ASSESSMENT_QUESTIONS = {
  [AssessmentType.KOLB]: KOLB_QUESTIONS,
  [AssessmentType.STERNBERG]: STERNBERG_QUESTIONS,
  [AssessmentType.DUAL_PROCESS]: DUAL_PROCESS_QUESTIONS
};

// Scoring Functions
export interface AssessmentScores {
  [key: string]: number;
}

export function calculateKolbScores(responses: { questionId: string; score: number }[]): AssessmentScores {
  const scores: AssessmentScores = {
    concrete_experience: 0,
    reflective_observation: 0,
    abstract_conceptualization: 0,
    active_experimentation: 0
  };

  const categoryCounts: { [key: string]: number } = {
    concrete_experience: 0,
    reflective_observation: 0,
    abstract_conceptualization: 0,
    active_experimentation: 0
  };

  responses.forEach(response => {
    const question = KOLB_QUESTIONS.find(q => q.id === response.questionId);
    if (question) {
      scores[question.category] += response.score;
      categoryCounts[question.category]++;
    }
  });

  // Calculate averages
  Object.keys(scores).forEach(category => {
    if (categoryCounts[category] > 0) {
      scores[category] = scores[category] / categoryCounts[category];
    }
  });

  return scores;
}

export function calculateSternbergScores(responses: { questionId: string; score: number }[]): AssessmentScores {
  const scores: AssessmentScores = {
    analytical: 0,
    creative: 0,
    practical: 0
  };

  const categoryCounts: { [key: string]: number } = {
    analytical: 0,
    creative: 0,
    practical: 0
  };

  responses.forEach(response => {
    const question = STERNBERG_QUESTIONS.find(q => q.id === response.questionId);
    if (question) {
      scores[question.category] += response.score;
      categoryCounts[question.category]++;
    }
  });

  // Calculate averages
  Object.keys(scores).forEach(category => {
    if (categoryCounts[category] > 0) {
      scores[category] = scores[category] / categoryCounts[category];
    }
  });

  return scores;
}

export function calculateDualProcessScores(responses: { questionId: string; score: number }[]): AssessmentScores {
  const scores: AssessmentScores = {
    system_1: 0,
    system_2: 0
  };

  const categoryCounts: { [key: string]: number } = {
    system_1: 0,
    system_2: 0
  };

  responses.forEach(response => {
    const question = DUAL_PROCESS_QUESTIONS.find(q => q.id === response.questionId);
    if (question) {
      scores[question.category] += response.score;
      categoryCounts[question.category]++;
    }
  });

  // Calculate averages
  Object.keys(scores).forEach(category => {
    if (categoryCounts[category] > 0) {
      scores[category] = scores[category] / categoryCounts[category];
    }
  });

  return scores;
}

// Ghana Education Mapping
export interface EducationMapping {
  recommendedSHS: string[];
  recommendedTertiary: string[];
  careerSuggestions: string[];
}

export function generateEducationMapping(
  kolbScores: AssessmentScores,
  sternbergScores: AssessmentScores,
  dualProcessScores: AssessmentScores
): EducationMapping {
  // Determine dominant styles
  const kolbStyles = Object.entries(kolbScores).sort((a, b) => b[1] - a[1]);
  const sternbergStyles = Object.entries(sternbergScores).sort((a, b) => b[1] - a[1]);
  
  const primaryStyle = `${sternbergStyles[0][0]}_${kolbStyles[0][0]}`;
  const secondaryStyle = `${sternbergStyles[1][0]}_${kolbStyles[1][0]}`;
  
  // Create thinking style profile
  const profile: ThinkingStyleProfile = {
    primaryStyle,
    secondaryStyle,
    strengths: getStrengths(kolbScores, sternbergScores, dualProcessScores),
    weaknesses: getWeaknesses(kolbScores, sternbergScores, dualProcessScores)
  };
  
  // Generate Ghana-specific recommendations
  const ghanaMapping = generateGhanaEducationMapping(profile);
  
  return {
    recommendedSHS: ghanaMapping.shsTracks,
    recommendedTertiary: ghanaMapping.tertiaryPrograms,
    careerSuggestions: ghanaMapping.careerSuggestions
  };
}

function getStrengths(kolbScores: AssessmentScores, sternbergScores: AssessmentScores, dualProcessScores: AssessmentScores): string[] {
  const strengths: string[] = [];
  
  // Add top scoring areas as strengths
  const topKolb = Object.entries(kolbScores).sort((a, b) => b[1] - a[1])[0];
  const topSternberg = Object.entries(sternbergScores).sort((a, b) => b[1] - a[1])[0];
  
  if (topKolb[1] > 3.5) {
    strengths.push(`${topKolb[0].replace('_', ' ')} learning style`);
  }
  
  if (topSternberg[1] > 3.5) {
    strengths.push(`${topSternberg[0]} intelligence`);
  }
  
  return strengths;
}

function getWeaknesses(kolbScores: AssessmentScores, sternbergScores: AssessmentScores, dualProcessScores: AssessmentScores): string[] {
  const weaknesses: string[] = [];
  
  // Add lowest scoring areas as areas for improvement
  const bottomKolb = Object.entries(kolbScores).sort((a, b) => a[1] - b[1])[0];
  const bottomSternberg = Object.entries(sternbergScores).sort((a, b) => a[1] - b[1])[0];
  
  if (bottomKolb[1] < 2.5) {
    weaknesses.push(`Developing ${bottomKolb[0].replace('_', ' ')} learning skills`);
  }
  
  if (bottomSternberg[1] < 2.5) {
    weaknesses.push(`Strengthening ${bottomSternberg[0]} intelligence`);
  }
  
  return weaknesses;
}
