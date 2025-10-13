import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { generateReportPDF, ReportData } from '../utils/pdfGenerator';
import { useAuth } from '../contexts/AuthContext';

interface Report {
  _id: string;
  overallProfile: {
    primaryStyle: string;
    secondaryStyle: string;
    strengths: string[];
    recommendations: string[];
  };
  educationMapping: {
    recommendedSHS: string[];
    recommendedTertiary: string[];
    careerSuggestions: string[];
  };
  insights: {
    learningPreferences: string[];
    decisionMakingStyle: string;
    communicationStyle: string;
  };
  generatedAt: string;
}

const ReportPage: React.FC = () => {
  const { reportId } = useParams<{ reportId: string }>();
  const { user } = useAuth();
  const [report, setReport] = useState<Report | null>(null);
  const [assessments, setAssessments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reflection, setReflection] = useState('');
  const [rating, setRating] = useState(5);
  const [submittingReflection, setSubmittingReflection] = useState(false);
  const [generatingPDF, setGeneratingPDF] = useState(false);

  const fetchReport = useCallback(async () => {
    try {
      const [reportResponse, assessmentsResponse] = await Promise.all([
        axios.get(`/reports/${reportId}`),
        axios.get('/assessments/my-assessments')
      ]);
      
      setReport(reportResponse.data.report);
      setAssessments(assessmentsResponse.data.assessments || []);
    } catch (error) {
      console.error('Error fetching report:', error);
      setError('Failed to load report');
    } finally {
      setLoading(false);
    }
  }, [reportId]);

  useEffect(() => {
    if (reportId) {
      fetchReport();
    }
  }, [reportId, fetchReport]);

  const handleReflectionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reflection.trim()) return;

    setSubmittingReflection(true);
    try {
      await axios.post(`/reports/${reportId}/reflection`, {
        content: reflection,
        rating
      });
      setReflection('');
      setRating(5);
      alert('Reflection added successfully!');
    } catch (error) {
      console.error('Error submitting reflection:', error);
      alert('Failed to submit reflection');
    } finally {
      setSubmittingReflection(false);
    }
  };

  const exportToPDF = async () => {
    if (!report || !user) return;

    setGeneratingPDF(true);
    try {
      const reportData: ReportData = {
        user: {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          school: user.school,
          grade: user.grade
        },
        report: {
          overallProfile: report.overallProfile,
          educationMapping: report.educationMapping,
          insights: report.insights,
          generatedAt: report.generatedAt
        },
        assessments: assessments
      };

      await generateReportPDF(reportData);
    } catch (error) {
      console.error('Error generating PDF:', error);
      setError('Failed to generate PDF report');
    } finally {
      setGeneratingPDF(false);
    }
  };

  if (loading) {
    return (
      <div className="report-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading report...</p>
        </div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="report-page">
        <div className="error-container">
          <h2>Report Not Found</h2>
          <p>{error || 'The requested report could not be found.'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="report-page">
      <div className="report-container">
        <div className="report-header">
          <h1>Your Thinking Style Report</h1>
          <div className="report-actions">
            <button 
              onClick={exportToPDF} 
              className="btn btn-secondary"
              disabled={generatingPDF}
            >
              {generatingPDF ? '🔄 Generating PDF...' : '📄 Export PDF'}
            </button>
          </div>
        </div>

        <div className="report-content">
          {/* Overall Profile */}
          <section className="report-section">
            <h2>Overall Profile</h2>
            <div className="profile-summary">
              <div className="profile-item">
                <h3>Primary Style</h3>
                <p className="style-name">{report.overallProfile.primaryStyle.replace('_', ' ').toUpperCase()}</p>
              </div>
              <div className="profile-item">
                <h3>Secondary Style</h3>
                <p className="style-name">{report.overallProfile.secondaryStyle.replace('_', ' ').toUpperCase()}</p>
              </div>
            </div>

            <div className="strengths-section">
              <h3>Your Key Strengths</h3>
              <ul className="strengths-list">
                {report.overallProfile.strengths.map((strength, index) => (
                  <li key={index} className="strength-item">
                    <span className="strength-icon">✨</span>
                    {strength}
                  </li>
                ))}
              </ul>
            </div>

            <div className="recommendations-section">
              <h3>Recommendations</h3>
              <ul className="recommendations-list">
                {report.overallProfile.recommendations.map((recommendation, index) => (
                  <li key={index} className="recommendation-item">
                    <span className="recommendation-icon">💡</span>
                    {recommendation}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Education Mapping */}
          <section className="report-section">
            <h2>Education & Career Guidance</h2>
            
            {report.educationMapping.recommendedSHS.length > 0 && (
              <div className="mapping-section">
                <h3>Recommended SHS Tracks</h3>
                <div className="tags-container">
                  {report.educationMapping.recommendedSHS.map((track, index) => (
                    <span key={index} className="tag tag-primary">{track}</span>
                  ))}
                </div>
                <p className="mapping-description">
                  These SHS tracks align with your learning preferences and cognitive strengths.
                </p>
              </div>
            )}

            {report.educationMapping.recommendedTertiary.length > 0 && (
              <div className="mapping-section">
                <h3>Recommended Tertiary Programs</h3>
                <div className="tags-container">
                  {report.educationMapping.recommendedTertiary.map((program, index) => (
                    <span key={index} className="tag tag-secondary">{program}</span>
                  ))}
                </div>
                <p className="mapping-description">
                  These programs match your thinking style and career interests.
                </p>
              </div>
            )}

            {report.educationMapping.careerSuggestions.length > 0 && (
              <div className="mapping-section">
                <h3>Career Suggestions</h3>
                <div className="tags-container">
                  {report.educationMapping.careerSuggestions.map((career, index) => (
                    <span key={index} className="tag tag-accent">{career}</span>
                  ))}
                </div>
                <p className="mapping-description">
                  These careers align with your strengths and preferences.
                </p>
              </div>
            )}
          </section>

          {/* Insights */}
          <section className="report-section">
            <h2>Personal Insights</h2>
            
            <div className="insights-grid">
              <div className="insight-card">
                <h3>Learning Preferences</h3>
                <ul>
                  {report.insights.learningPreferences.map((preference, index) => (
                    <li key={index}>{preference}</li>
                  ))}
                </ul>
              </div>

              <div className="insight-card">
                <h3>Decision-Making Style</h3>
                <p className="insight-value">{report.insights.decisionMakingStyle}</p>
                <p className="insight-description">
                  This describes how you typically approach decisions and problem-solving.
                </p>
              </div>

              <div className="insight-card">
                <h3>Communication Style</h3>
                <p className="insight-value">{report.insights.communicationStyle}</p>
                <p className="insight-description">
                  This reflects how you prefer to communicate and share information.
                </p>
              </div>
            </div>
          </section>

          {/* Reflection Section */}
          <section className="report-section">
            <h2>Your Reflection</h2>
            <p>Share your thoughts about this report and how it relates to your experiences.</p>
            
            <form onSubmit={handleReflectionSubmit} className="reflection-form">
              <div className="form-group">
                <label htmlFor="reflection">Your Thoughts</label>
                <textarea
                  id="reflection"
                  value={reflection}
                  onChange={(e) => setReflection(e.target.value)}
                  placeholder="How does this report reflect your experiences? What insights did you gain?"
                  rows={4}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="rating">How helpful was this report? (1-5)</label>
                <div className="rating-selector">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <label key={value} className="rating-option">
                      <input
                        type="radio"
                        name="rating"
                        value={value}
                        checked={rating === value}
                        onChange={(e) => setRating(Number(e.target.value))}
                      />
                      <span className="rating-button">{value}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={submittingReflection || !reflection.trim()}
              >
                {submittingReflection ? 'Submitting...' : 'Add Reflection'}
              </button>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ReportPage;
