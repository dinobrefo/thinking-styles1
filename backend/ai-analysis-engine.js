// AI-Powered Assessment Analysis Engine
// This module provides intelligent analysis of assessment results

class AIAnalysisEngine {
  constructor() {
    this.basePrompts = {
      kolb_analysis: `
        Analyze the following Kolb's Learning Cycle scores and provide insights:
        - Concrete Experience: {concrete_experience}/5
        - Reflective Observation: {reflective_observation}/5  
        - Abstract Conceptualization: {abstract_conceptualization}/5
        - Active Experimentation: {active_experimentation}/5
        
        Context: Ghana education system, student profile
        Provide: Learning style description, study preferences, classroom recommendations
      `,
      
      sternberg_analysis: `
        Analyze Sternberg's Triarchic Intelligence scores:
        - Analytical: {analytical}/5
        - Creative: {creative}/5
        - Practical: {practical}/5
        
        Context: Career guidance for Ghana students
        Provide: Intelligence profile, academic strengths, career alignment
      `,
      
      dual_process_analysis: `
        Analyze Dual Process Theory decision-making style:
        - System 1 (Intuitive): {system_1}/5
        - System 2 (Analytical): {system_2}/5
        
        Context: Learning and decision-making preferences
        Provide: Decision style, problem-solving approach, communication preferences
      `,
      
      integrated_analysis: `
        Comprehensive analysis combining all three theories:
        Kolb: {kolb_scores}
        Sternberg: {sternberg_scores}  
        Dual Process: {dual_process_scores}
        
        User Profile: {user_profile}
        
        Generate:
        1. Overall thinking style profile
        2. Personalized learning recommendations
        3. Ghana education system alignment
        4. Career pathway suggestions
        5. Development opportunities
        6. Communication and collaboration style
      `
    };
  }

  async generateInsights(assessmentData, userProfile) {
    const analysis = {
      kolb_insights: await this.analyzeKolb(assessmentData.kolb),
      sternberg_insights: await this.analyzeSternberg(assessmentData.sternberg),
      dual_process_insights: await this.analyzeDualProcess(assessmentData.dual_process),
      integrated_profile: await this.generateIntegratedProfile(assessmentData, userProfile),
      education_recommendations: await this.generateEducationRecommendations(assessmentData, userProfile),
      career_pathways: await this.generateCareerPathways(assessmentData, userProfile),
      learning_strategies: await this.generateLearningStrategies(assessmentData, userProfile)
    };

    return analysis;
  }

  async analyzeKolb(scores) {
    const prompt = this.basePrompts.kolb_analysis
      .replace('{concrete_experience}', scores.concrete_experience)
      .replace('{reflective_observation}', scores.reflective_observation)
      .replace('{abstract_conceptualization}', scores.abstract_conceptualization)
      .replace('{active_experimentation}', scores.active_experimentation);

    return await this.callAI(prompt);
  }

  async analyzeSternberg(scores) {
    const prompt = this.basePrompts.sternberg_analysis
      .replace('{analytical}', scores.analytical)
      .replace('{creative}', scores.creative)
      .replace('{practical}', scores.practical);

    return await this.callAI(prompt);
  }

  async analyzeDualProcess(scores) {
    const prompt = this.basePrompts.dual_process_analysis
      .replace('{system_1}', scores.system_1)
      .replace('{system_2}', scores.system_2);

    return await this.callAI(prompt);
  }

  async generateIntegratedProfile(assessmentData, userProfile) {
    const prompt = this.basePrompts.integrated_analysis
      .replace('{kolb_scores}', JSON.stringify(assessmentData.kolb))
      .replace('{sternberg_scores}', JSON.stringify(assessmentData.sternberg))
      .replace('{dual_process_scores}', JSON.stringify(assessmentData.dual_process))
      .replace('{user_profile}', JSON.stringify(userProfile));

    return await this.callAI(prompt);
  }

  async generateEducationRecommendations(assessmentData, userProfile) {
    const prompt = `
      Based on the assessment results, provide personalized education recommendations for Ghana's education system:
      
      Assessment Results: ${JSON.stringify(assessmentData)}
      Student Profile: ${JSON.stringify(userProfile)}
      
      Provide recommendations for:
      1. SHS Track selection (General Science, General Arts, Business, Technical/Vocational, Visual Arts)
      2. Tertiary program alignment (Universities, Polytechnics, Technical Institutes)
      3. Subject preferences and strengths
      4. Learning environment recommendations
      5. Study strategies and approaches
    `;

    return await this.callAI(prompt);
  }

  async generateCareerPathways(assessmentData, userProfile) {
    const prompt = `
      Generate career pathway recommendations based on thinking style analysis:
      
      Assessment Results: ${JSON.stringify(assessmentData)}
      Student Profile: ${JSON.stringify(userProfile)}
      
      Provide:
      1. Primary career clusters (3-5 options)
      2. Specific job roles within each cluster
      3. Required education and training paths
      4. Skills development recommendations
      5. Industry insights and growth prospects
      6. Entrepreneurship opportunities
    `;

    return await this.callAI(prompt);
  }

  async generateLearningStrategies(assessmentData, userProfile) {
    const prompt = `
      Create personalized learning strategies based on cognitive profile:
      
      Assessment Results: ${JSON.stringify(assessmentData)}
      Student Profile: ${JSON.stringify(userProfile)}
      
      Provide:
      1. Optimal study methods and techniques
      2. Learning environment preferences
      3. Time management strategies
      4. Memory and retention techniques
      5. Problem-solving approaches
      6. Group vs individual learning preferences
    `;

    return await this.callAI(prompt);
  }

  // AI Integration - This would connect to your preferred AI service
  async callAI(prompt) {
    // Option 1: OpenAI GPT Integration
    if (process.env.OPENAI_API_KEY) {
      return await this.callOpenAI(prompt);
    }
    
    // Option 2: Anthropic Claude Integration  
    if (process.env.ANTHROPIC_API_KEY) {
      return await this.callAnthropic(prompt);
    }
    
    // Option 3: Local AI Model (Ollama, etc.)
    if (process.env.LOCAL_AI_URL) {
      return await this.callLocalAI(prompt);
    }
    
    // Fallback: Enhanced rule-based analysis
    return await this.generateFallbackInsights(prompt);
  }

  async callOpenAI(prompt) {
    const OpenAI = require('openai');
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system", 
          content: "You are an expert educational psychologist specializing in Ghana's education system. Provide detailed, actionable insights based on psychological assessment results."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 1000,
      temperature: 0.7
    });

    return completion.choices[0].message.content;
  }

  async callAnthropic(prompt) {
    const Anthropic = require('@anthropic-ai/sdk');
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    const message = await anthropic.messages.create({
      model: "claude-3-sonnet-20240229",
      max_tokens: 1000,
      messages: [
        {
          role: "user",
          content: `You are an expert educational psychologist specializing in Ghana's education system. ${prompt}`
        }
      ]
    });

    return message.content[0].text;
  }

  async callLocalAI(prompt) {
    const axios = require('axios');
    
    const response = await axios.post(process.env.LOCAL_AI_URL, {
      model: "llama2",
      prompt: `You are an expert educational psychologist specializing in Ghana's education system. ${prompt}`,
      max_tokens: 1000,
      temperature: 0.7
    });

    return response.data.response;
  }

  async generateFallbackInsights(prompt) {
    // Enhanced rule-based fallback when AI is not available
    return {
      insights: "Using advanced rule-based analysis - comprehensive insights available without AI costs.",
      recommendations: this.generateRuleBasedRecommendations(prompt),
      timestamp: new Date().toISOString()
    };
  }

  generateRuleBasedRecommendations(prompt) {
    // Extract assessment data from prompt for analysis
    const assessmentData = this.extractAssessmentData(prompt);
    
    return {
      learning_style: this.analyzeLearningStyle(assessmentData),
      study_strategies: this.generateStudyStrategies(assessmentData),
      career_alignment: this.analyzeCareerAlignment(assessmentData),
      development_areas: this.identifyDevelopmentAreas(assessmentData),
      ghana_education_mapping: this.generateGhanaEducationMapping(assessmentData),
      communication_style: this.analyzeCommunicationStyle(assessmentData)
    };
  }

  extractAssessmentData(prompt) {
    // Parse the prompt to extract assessment scores
    const kolbMatch = prompt.match(/kolbScores.*?\{([^}]+)\}/);
    const sternbergMatch = prompt.match(/sternbergScores.*?\{([^}]+)\}/);
    const dualProcessMatch = prompt.match(/dualProcessScores.*?\{([^}]+)\}/);
    
    return {
      kolb: kolbMatch ? this.parseScores(kolbMatch[1]) : null,
      sternberg: sternbergMatch ? this.parseScores(sternbergMatch[1]) : null,
      dual_process: dualProcessMatch ? this.parseScores(dualProcessMatch[1]) : null
    };
  }

  parseScores(scoreString) {
    const scores = {};
    const pairs = scoreString.split(',');
    pairs.forEach(pair => {
      const [key, value] = pair.split(':');
      if (key && value) {
        scores[key.trim().replace(/"/g, '')] = parseFloat(value.trim());
      }
    });
    return scores;
  }

  analyzeLearningStyle(data) {
    if (!data.kolb) return "Mixed learning preferences";
    
    const { concrete_experience, reflective_observation, abstract_conceptualization, active_experimentation } = data.kolb;
    const scores = { concrete_experience, reflective_observation, abstract_conceptualization, active_experimentation };
    
    const dominant = Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b);
    const secondary = Object.keys(scores).sort((a, b) => scores[b] - scores[a])[1];
    
    const styleMap = {
      concrete_experience: "Hands-on Learner - You learn best through direct experience and practical activities",
      reflective_observation: "Reflective Observer - You prefer to watch, listen, and think before acting",
      abstract_conceptualization: "Theoretical Thinker - You excel at analyzing concepts and creating theories",
      active_experimentation: "Active Experimenter - You learn by doing and testing ideas in practice"
    };
    
    return `${styleMap[dominant]} with secondary preference for ${styleMap[secondary].split(' - ')[0].toLowerCase()}`;
  }

  generateStudyStrategies(data) {
    const strategies = [];
    
    if (data.kolb?.concrete_experience > 4) {
      strategies.push("Use hands-on activities and real-world examples");
      strategies.push("Practice with physical materials and experiments");
    }
    
    if (data.kolb?.reflective_observation > 4) {
      strategies.push("Take time to reflect on what you've learned");
      strategies.push("Discuss concepts with others before applying them");
    }
    
    if (data.kolb?.abstract_conceptualization > 4) {
      strategies.push("Focus on understanding underlying principles");
      strategies.push("Create mind maps and conceptual frameworks");
    }
    
    if (data.kolb?.active_experimentation > 4) {
      strategies.push("Apply knowledge immediately to solve problems");
      strategies.push("Engage in project-based learning");
    }
    
    if (data.sternberg?.analytical > 4) {
      strategies.push("Break complex topics into smaller components");
      strategies.push("Use logical reasoning and evidence-based study");
    }
    
    if (data.sternberg?.creative > 4) {
      strategies.push("Use creative visualization and imagination");
      strategies.push("Explore multiple perspectives and solutions");
    }
    
    if (data.sternberg?.practical > 4) {
      strategies.push("Connect learning to real-world applications");
      strategies.push("Focus on practical skills and problem-solving");
    }
    
    return strategies.length > 0 ? strategies : ["Use a balanced approach combining different study methods"];
  }

  analyzeCareerAlignment(data) {
    const alignments = [];
    
    if (data.sternberg?.analytical > 4) {
      alignments.push("Research and Analysis roles");
      alignments.push("STEM fields (Science, Technology, Engineering, Mathematics)");
    }
    
    if (data.sternberg?.creative > 4) {
      alignments.push("Creative and Design fields");
      alignments.push("Innovation and Entrepreneurship");
    }
    
    if (data.sternberg?.practical > 4) {
      alignments.push("Applied Sciences and Technology");
      alignments.push("Business and Management");
    }
    
    if (data.dual_process?.system_1 > 4) {
      alignments.push("Fast-paced decision-making roles");
      alignments.push("Emergency services and crisis management");
    }
    
    if (data.dual_process?.system_2 > 4) {
      alignments.push("Strategic planning and analysis");
      alignments.push("Research and development");
    }
    
    return alignments.length > 0 ? alignments.join(", ") : "Diverse career opportunities across multiple fields";
  }

  identifyDevelopmentAreas(data) {
    const areas = [];
    
    // Identify areas with lower scores for development
    if (data.kolb?.concrete_experience < 3) {
      areas.push("Hands-on learning and practical application");
    }
    
    if (data.kolb?.reflective_observation < 3) {
      areas.push("Reflective thinking and observation skills");
    }
    
    if (data.kolb?.abstract_conceptualization < 3) {
      areas.push("Theoretical understanding and conceptual thinking");
    }
    
    if (data.kolb?.active_experimentation < 3) {
      areas.push("Active experimentation and practical testing");
    }
    
    if (data.sternberg?.analytical < 3) {
      areas.push("Analytical thinking and logical reasoning");
    }
    
    if (data.sternberg?.creative < 3) {
      areas.push("Creative thinking and innovation");
    }
    
    if (data.sternberg?.practical < 3) {
      areas.push("Practical application and real-world skills");
    }
    
    return areas.length > 0 ? areas : ["Continue developing your existing strengths"];
  }

  generateGhanaEducationMapping(data) {
    const recommendations = {
      shs_tracks: [],
      tertiary_programs: [],
      career_paths: []
    };
    
    // SHS Track Recommendations
    if (data.sternberg?.analytical > 4 && data.kolb?.abstract_conceptualization > 4) {
      recommendations.shs_tracks.push("General Science");
      recommendations.tertiary_programs.push("Engineering", "Medicine", "Computer Science");
    }
    
    if (data.sternberg?.creative > 4) {
      recommendations.shs_tracks.push("General Arts", "Visual Arts");
      recommendations.tertiary_programs.push("Fine Arts", "Design", "Communication Studies");
    }
    
    if (data.sternberg?.practical > 4) {
      recommendations.shs_tracks.push("Business", "Technical/Vocational");
      recommendations.tertiary_programs.push("Business Administration", "Applied Sciences", "Technical Education");
    }
    
    // Career Paths
    if (data.sternberg?.analytical > 4) {
      recommendations.career_paths.push("Research Scientist", "Data Analyst", "Software Engineer");
    }
    
    if (data.sternberg?.creative > 4) {
      recommendations.career_paths.push("Graphic Designer", "Writer", "Entrepreneur");
    }
    
    if (data.sternberg?.practical > 4) {
      recommendations.career_paths.push("Project Manager", "Teacher", "Healthcare Professional");
    }
    
    return recommendations;
  }

  analyzeCommunicationStyle(data) {
    if (data.dual_process?.system_1 > 4) {
      return "Direct and decisive communication style - you prefer quick, clear exchanges";
    } else if (data.dual_process?.system_2 > 4) {
      return "Thoughtful and analytical communication style - you prefer detailed, well-reasoned discussions";
    } else {
      return "Adaptive communication style - you adjust your approach based on the situation";
    }
  }
}

module.exports = AIAnalysisEngine;
