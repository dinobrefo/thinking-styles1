// Ghana Education System Mapping
// Based on thinking styles assessment results

export interface GhanaEducationMapping {
  shsTracks: string[];
  tertiaryPrograms: string[];
  careerSuggestions: string[];
  learningRecommendations: string[];
}

export interface ThinkingStyleProfile {
  primaryStyle: string;
  secondaryStyle: string;
  strengths: string[];
  weaknesses: string[];
}

// Ghana SHS Tracks (Senior High School)
export const GHANA_SHS_TRACKS = {
  // Science Track
  SCIENCE: [
    'General Science',
    'Agricultural Science', 
    'Technical Science',
    'Home Economics'
  ],
  
  // Business Track  
  BUSINESS: [
    'Business (Accounting)',
    'Business (Management)',
    'Business (Secretarial)',
    'Business (Marketing)'
  ],
  
  // Arts Track
  ARTS: [
    'General Arts',
    'Visual Arts',
    'Music',
    'Drama'
  ],
  
  // Technical Track
  TECHNICAL: [
    'Technical (Engineering)',
    'Technical (Construction)',
    'Technical (Electronics)',
    'Technical (Automotive)'
  ],
  
  // Vocational Track
  VOCATIONAL: [
    'Agricultural Science',
    'Home Economics',
    'Technical Skills',
    'Business Skills'
  ]
};

// Ghana Tertiary Institutions and Programs
export const GHANA_TERTIARY_PROGRAMS = {
  // Universities
  UNIVERSITIES: {
    'University of Ghana': [
      'Medicine and Surgery',
      'Law',
      'Engineering',
      'Business Administration',
      'Computer Science',
      'Psychology',
      'Education',
      'Agriculture'
    ],
    'Kwame Nkrumah University of Science and Technology': [
      'Engineering (Civil, Mechanical, Electrical)',
      'Architecture',
      'Pharmacy',
      'Medicine',
      'Computer Science',
      'Agriculture',
      'Business Administration'
    ],
    'University of Cape Coast': [
      'Education',
      'Psychology',
      'Business Administration',
      'Computer Science',
      'Agriculture',
      'Nursing'
    ],
    'University for Development Studies': [
      'Medicine',
      'Agriculture',
      'Development Studies',
      'Business Administration',
      'Computer Science'
    ]
  },
  
  // Technical Universities
  TECHNICAL_UNIVERSITIES: {
    'Accra Technical University': [
      'Engineering Technology',
      'Business Administration',
      'Computer Science',
      'Fashion Design',
      'Hospitality Management'
    ],
    'Kumasi Technical University': [
      'Engineering Technology',
      'Business Administration',
      'Computer Science',
      'Agriculture Technology'
    ],
    'Cape Coast Technical University': [
      'Engineering Technology',
      'Business Administration',
      'Computer Science',
      'Agriculture Technology'
    ]
  },
  
  // Colleges
  COLLEGES: {
    'Ghana Institute of Management and Public Administration': [
      'Public Administration',
      'Business Administration',
      'Computer Science',
      'Development Studies'
    ],
    'Ghana Technology University College': [
      'Computer Science',
      'Engineering',
      'Business Administration',
      'Information Technology'
    ]
  }
};

// Career Suggestions based on thinking styles
export const CAREER_SUGGESTIONS = {
  // Analytical Thinkers (High in Sternberg's Analytical)
  ANALYTICAL: [
    'Research Scientist',
    'Data Analyst',
    'Financial Analyst',
    'Software Engineer',
    'Medical Doctor',
    'Lawyer',
    'Engineer',
    'Accountant',
    'Statistician',
    'Pharmacist'
  ],
  
  // Creative Thinkers (High in Sternberg's Creative)
  CREATIVE: [
    'Graphic Designer',
    'Architect',
    'Artist',
    'Writer',
    'Marketing Manager',
    'Entrepreneur',
    'Fashion Designer',
    'Musician',
    'Advertising Executive',
    'Product Designer'
  ],
  
  // Practical Thinkers (High in Sternberg's Practical)
  PRACTICAL: [
    'Project Manager',
    'Business Manager',
    'Teacher',
    'Nurse',
    'Social Worker',
    'Police Officer',
    'Military Officer',
    'Sales Manager',
    'Human Resources Manager',
    'Operations Manager'
  ],
  
  // Convergent Learners (Kolb)
  CONVERGENT: [
    'Engineer',
    'Computer Programmer',
    'Financial Analyst',
    'Research Scientist',
    'Mathematician',
    'Physicist',
    'Chemist',
    'Statistician'
  ],
  
  // Divergent Learners (Kolb)
  DIVERGENT: [
    'Counselor',
    'Social Worker',
    'Teacher',
    'Artist',
    'Writer',
    'Marketing Manager',
    'Human Resources Manager',
    'Psychologist'
  ],
  
  // Assimilative Learners (Kolb)
  ASSIMILATIVE: [
    'Researcher',
    'Theoretical Physicist',
    'Mathematician',
    'Philosopher',
    'Academic',
    'Scientist',
    'Librarian',
    'Information Specialist'
  ],
  
  // Accommodative Learners (Kolb)
  ACCOMMODATIVE: [
    'Entrepreneur',
    'Sales Manager',
    'Project Manager',
    'Event Planner',
    'Business Manager',
    'Marketing Manager',
    'Operations Manager',
    'Consultant'
  ]
};

// Learning Recommendations
export const LEARNING_RECOMMENDATIONS = {
  // Based on Kolb's Learning Styles
  KOLB: {
    CONVERGENT: [
      'Focus on practical applications of concepts',
      'Use hands-on learning activities',
      'Work on problem-solving exercises',
      'Engage in laboratory work and experiments',
      'Apply theories to real-world situations'
    ],
    DIVERGENT: [
      'Use brainstorming and creative thinking exercises',
      'Engage in group discussions and collaborative learning',
      'Explore multiple perspectives on topics',
      'Use case studies and real-world examples',
      'Participate in role-playing activities'
    ],
    ASSIMILATIVE: [
      'Focus on theoretical understanding and concepts',
      'Use lectures and reading materials',
      'Create concept maps and diagrams',
      'Engage in research and analysis',
      'Work on theoretical problems and case studies'
    ],
    ACCOMMODATIVE: [
      'Learn through trial and error',
      'Engage in experiential learning activities',
      'Use simulations and practical exercises',
      'Work on projects and real-world applications',
      'Learn from mistakes and feedback'
    ]
  },
  
  // Based on Sternberg's Intelligence Types
  STERNBERG: {
    ANALYTICAL: [
      'Focus on logical reasoning and analysis',
      'Use structured learning materials',
      'Engage in critical thinking exercises',
      'Work on problem-solving tasks',
      'Use systematic study methods'
    ],
    CREATIVE: [
      'Use creative and innovative learning methods',
      'Engage in brainstorming and idea generation',
      'Work on open-ended projects',
      'Use visual and artistic learning tools',
      'Explore multiple solutions to problems'
    ],
    PRACTICAL: [
      'Focus on real-world applications',
      'Use hands-on learning experiences',
      'Engage in practical problem-solving',
      'Work on projects with real outcomes',
      'Learn through experience and practice'
    ]
  }
};

// Main function to generate Ghana-specific recommendations
export function generateGhanaEducationMapping(profile: ThinkingStyleProfile): GhanaEducationMapping {
  const { primaryStyle, secondaryStyle } = profile;
  
  // Determine SHS tracks based on thinking styles
  const shsTracks = getRecommendedSHSTracks(primaryStyle, secondaryStyle);
  
  // Determine tertiary programs
  const tertiaryPrograms = getRecommendedTertiaryPrograms(primaryStyle, secondaryStyle);
  
  // Get career suggestions
  const careerSuggestions = getCareerSuggestions(primaryStyle, secondaryStyle);
  
  // Get learning recommendations
  const learningRecommendations = getLearningRecommendations(primaryStyle, secondaryStyle);
  
  return {
    shsTracks,
    tertiaryPrograms,
    careerSuggestions,
    learningRecommendations
  };
}

function getRecommendedSHSTracks(primary: string, secondary: string): string[] {
  const tracks: string[] = [];
  
  // Map thinking styles to SHS tracks
  if (primary.includes('analytical') || primary.includes('convergent')) {
    tracks.push(...GHANA_SHS_TRACKS.SCIENCE);
    tracks.push(...GHANA_SHS_TRACKS.TECHNICAL);
  }
  
  if (primary.includes('creative') || primary.includes('divergent')) {
    tracks.push(...GHANA_SHS_TRACKS.ARTS);
    tracks.push(...GHANA_SHS_TRACKS.BUSINESS);
  }
  
  if (primary.includes('practical') || primary.includes('accommodative')) {
    tracks.push(...GHANA_SHS_TRACKS.BUSINESS);
    tracks.push(...GHANA_SHS_TRACKS.VOCATIONAL);
    tracks.push(...GHANA_SHS_TRACKS.TECHNICAL);
  }
  
  // Remove duplicates and return top 4
  return [...new Set(tracks)].slice(0, 4);
}

function getRecommendedTertiaryPrograms(primary: string, secondary: string): string[] {
  const programs: string[] = [];
  
  // Map thinking styles to tertiary programs
  if (primary.includes('analytical') || primary.includes('convergent')) {
    programs.push('Medicine and Surgery', 'Engineering', 'Computer Science', 'Law', 'Pharmacy');
  }
  
  if (primary.includes('creative') || primary.includes('divergent')) {
    programs.push('Architecture', 'Business Administration', 'Education', 'Psychology', 'Arts');
  }
  
  if (primary.includes('practical') || primary.includes('accommodative')) {
    programs.push('Business Administration', 'Nursing', 'Agriculture', 'Education', 'Engineering Technology');
  }
  
  // Remove duplicates and return top 5
  return [...new Set(programs)].slice(0, 5);
}

function getCareerSuggestions(primary: string, secondary: string): string[] {
  const careers: string[] = [];
  
  // Map thinking styles to careers
  if (primary.includes('analytical')) {
    careers.push(...CAREER_SUGGESTIONS.ANALYTICAL);
  }
  
  if (primary.includes('creative')) {
    careers.push(...CAREER_SUGGESTIONS.CREATIVE);
  }
  
  if (primary.includes('practical')) {
    careers.push(...CAREER_SUGGESTIONS.PRACTICAL);
  }
  
  if (primary.includes('convergent')) {
    careers.push(...CAREER_SUGGESTIONS.CONVERGENT);
  }
  
  if (primary.includes('divergent')) {
    careers.push(...CAREER_SUGGESTIONS.DIVERGENT);
  }
  
  // Remove duplicates and return top 8
  return [...new Set(careers)].slice(0, 8);
}

function getLearningRecommendations(primary: string, secondary: string): string[] {
  const recommendations: string[] = [];
  
  // Get Kolb-based recommendations
  if (primary.includes('convergent')) {
    recommendations.push(...LEARNING_RECOMMENDATIONS.KOLB.CONVERGENT);
  } else if (primary.includes('divergent')) {
    recommendations.push(...LEARNING_RECOMMENDATIONS.KOLB.DIVERGENT);
  } else if (primary.includes('assimilative')) {
    recommendations.push(...LEARNING_RECOMMENDATIONS.KOLB.ASSIMILATIVE);
  } else if (primary.includes('accommodative')) {
    recommendations.push(...LEARNING_RECOMMENDATIONS.KOLB.ACCOMMODATIVE);
  }
  
  // Get Sternberg-based recommendations
  if (primary.includes('analytical')) {
    recommendations.push(...LEARNING_RECOMMENDATIONS.STERNBERG.ANALYTICAL);
  } else if (primary.includes('creative')) {
    recommendations.push(...LEARNING_RECOMMENDATIONS.STERNBERG.CREATIVE);
  } else if (primary.includes('practical')) {
    recommendations.push(...LEARNING_RECOMMENDATIONS.STERNBERG.PRACTICAL);
  }
  
  // Remove duplicates and return top 5
  return [...new Set(recommendations)].slice(0, 5);
}

// Ghana-specific study tips and cultural considerations
export const GHANA_STUDY_TIPS = {
  CULTURAL_CONTEXT: [
    'Consider Ghana\'s educational system structure (JHS → SHS → Tertiary)',
    'Understand the importance of WASSCE (West African Senior School Certificate Examination)',
    'Consider local job market demands and opportunities',
    'Factor in family expectations and cultural values',
    'Consider the role of community and extended family in career decisions'
  ],
  
  PRACTICAL_TIPS: [
    'Focus on subjects that align with your chosen SHS track',
    'Develop both theoretical knowledge and practical skills',
    'Consider apprenticeship and vocational training options',
    'Network with professionals in your field of interest',
    'Stay updated with Ghana\'s economic and industrial developments'
  ],
  
  RESOURCE_RECOMMENDATIONS: [
    'Utilize Ghana Education Service resources',
    'Connect with career guidance counselors',
    'Attend career fairs and educational exhibitions',
    'Join professional associations in your field',
    'Consider mentorship programs with industry professionals'
  ]
};
