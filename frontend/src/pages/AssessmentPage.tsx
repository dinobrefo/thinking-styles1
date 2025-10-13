import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

interface Question {
  id: string;
  text: string;
  category: string;
}

interface AssessmentResponse {
  questionId: string;
  score: number;
}

const AssessmentPage: React.FC = () => {
  const { type } = useParams<{ type: string }>();
  const navigate = useNavigate();
  
  const [questions, setQuestions] = useState<Question[]>([]);
  const [responses, setResponses] = useState<{ [key: string]: number }>({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const assessmentTypes = {
    kolb: {
      title: "Kolb's Experiential Learning Cycle",
      description: "Discover your learning preferences and how you process information",
      icon: "🧠"
    },
    sternberg: {
      title: "Sternberg's Triarchic Theory of Intelligence",
      description: "Identify your analytical, creative, and practical strengths",
      icon: "🎯"
    },
    dual_process: {
      title: "Dual Process Theory",
      description: "Understand your decision-making style and cognitive processes",
      icon: "⚖️"
    }
  };

  const fetchQuestions = useCallback(async () => {
    try {
      const response = await axios.get(`/assessments/questions/${type}`);
      setQuestions(response.data.questions);
      
      // Initialize responses with default value of 3 (neutral)
      const initialResponses: { [key: string]: number } = {};
      response.data.questions.forEach((q: Question) => {
        initialResponses[q.id] = 3;
      });
      setResponses(initialResponses);
    } catch (error) {
      console.error('Error fetching questions:', error);
      setError('Failed to load assessment questions');
    } finally {
      setLoading(false);
    }
  }, [type]);

  const currentType = assessmentTypes[type as keyof typeof assessmentTypes];

  useEffect(() => {
    if (!type || !Object.keys(assessmentTypes).includes(type)) {
      navigate('/dashboard');
      return;
    }

    fetchQuestions();
  }, [type, navigate, fetchQuestions]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleScoreChange = (questionId: string, score: number) => {
    setResponses({
      ...responses,
      [questionId]: score
    });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError('');

    try {
      const assessmentResponses: AssessmentResponse[] = Object.entries(responses).map(
        ([questionId, score]) => ({ questionId, score })
      );

      await axios.post('/assessments/submit', {
        type,
        responses: assessmentResponses
      });

      navigate('/dashboard');
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to submit assessment');
    } finally {
      setSubmitting(false);
    }
  };

  const getScoreLabel = (score: number) => {
    const labels = {
      1: 'Strongly Disagree',
      2: 'Disagree',
      3: 'Neutral',
      4: 'Agree',
      5: 'Strongly Agree'
    };
    return labels[score as keyof typeof labels];
  };

  if (loading) {
    return (
      <div className="assessment-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading assessment...</p>
        </div>
      </div>
    );
  }

  if (!currentType) {
    return (
      <div className="assessment-page">
        <div className="error-container">
          <h2>Assessment Not Found</h2>
          <p>The requested assessment type is not available.</p>
          <button onClick={() => navigate('/dashboard')} className="btn btn-primary">
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="assessment-page">
      <div className="assessment-container">
        <div className="assessment-header">
          <div className="assessment-info">
            <h1>
              <span className="assessment-icon">{currentType.icon}</span>
              {currentType.title}
            </h1>
            <p>{currentType.description}</p>
          </div>
          
          <div className="assessment-progress">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <span className="progress-text">
              Question {currentQuestion + 1} of {questions.length}
            </span>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="question-container">
          <div className="question-card">
            <h2 className="question-text">{currentQ?.text}</h2>
            
            <div className="score-selector">
              <div className="score-options">
                {[1, 2, 3, 4, 5].map((score) => (
                  <label key={score} className="score-option">
                    <input
                      type="radio"
                      name={`question-${currentQ?.id}`}
                      value={score}
                      checked={responses[currentQ?.id] === score}
                      onChange={() => handleScoreChange(currentQ?.id, score)}
                    />
                    <div className="score-button">
                      <span className="score-number">{score}</span>
                      <span className="score-label">{getScoreLabel(score)}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="assessment-navigation">
          <button
            className="btn btn-secondary"
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
          >
            Previous
          </button>

          <div className="question-indicators">
            {questions.map((_, index) => (
              <button
                key={index}
                className={`indicator ${index === currentQuestion ? 'active' : ''} ${
                  responses[questions[index].id] !== 3 ? 'answered' : ''
                }`}
                onClick={() => setCurrentQuestion(index)}
              >
                {index + 1}
              </button>
            ))}
          </div>

          {currentQuestion === questions.length - 1 ? (
            <button
              className="btn btn-primary"
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? 'Submitting...' : 'Submit Assessment'}
            </button>
          ) : (
            <button
              className="btn btn-primary"
              onClick={handleNext}
            >
              Next
            </button>
          )}
        </div>

        <div className="assessment-help">
          <h3>How to Answer</h3>
          <ul>
            <li><strong>Strongly Disagree (1):</strong> This statement doesn't describe me at all</li>
            <li><strong>Disagree (2):</strong> This statement rarely describes me</li>
            <li><strong>Neutral (3):</strong> This statement sometimes describes me</li>
            <li><strong>Agree (4):</strong> This statement often describes me</li>
            <li><strong>Strongly Agree (5):</strong> This statement always describes me</li>
          </ul>
          <p>
            <strong>Tip:</strong> Answer based on your natural preferences and tendencies, 
            not what you think you should be like.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AssessmentPage;
