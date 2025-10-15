import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import AssessmentCharts from '../components/AssessmentCharts';

interface Assessment {
  id: number;
  type: string;
  scores: { [key: string]: number };
  completedAt: string;
}

interface Report {
  id: number;
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
  generatedAt: string;
}

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [assessmentsRes, reportsRes] = await Promise.all([
        axios.get('/assessments/my-assessments'),
        axios.get('/reports/my-reports')
      ]);

      // Ensure we have valid data before setting state
      setAssessments(assessmentsRes.data?.assessments || []);
      setReports(reportsRes.data?.reports || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data');
      // Explicitly set empty arrays on error to prevent showing false completions
      setAssessments([]);
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  const getAssessmentTypeInfo = (type: string) => {
    const types = {
      kolb: { 
        name: "Kolb's Learning Cycle", 
        icon: "🧠", 
        color: "blue",
        gradient: "from-blue-500 to-cyan-500",
        description: "Discover your learning preferences and how you process information"
      },
      sternberg: { 
        name: "Sternberg's Intelligence", 
        icon: "🎯", 
        color: "green",
        gradient: "from-emerald-500 to-teal-500",
        description: "Identify your analytical, creative, and practical strengths"
      },
      dual_process: { 
        name: "Dual Process Theory", 
        icon: "⚖️", 
        color: "purple",
        gradient: "from-purple-500 to-pink-500",
        description: "Understand your decision-making style and cognitive processes"
      }
    };
    return types[type as keyof typeof types] || { 
      name: type, 
      icon: "📊", 
      color: "gray",
      gradient: "from-gray-500 to-gray-600",
      description: "Assessment tool"
    };
  };

  const getCompletedAssessments = () => {
    return assessments.filter(a => 
      a && 
      a.scores && 
      typeof a.scores === 'object' && 
      Object.keys(a.scores).length > 0 &&
      a.completedAt // Ensure it has a completion date
    );
  };


  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="loading-spinner" style={{ margin: '0 auto 1rem' }}></div>
          <p style={{ color: 'var(--text-secondary)' }}>Loading dashboard...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ padding: '2rem 0' }}>
      <div className="dashboard-container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="dashboard-header"
        >
          <h1 className="dashboard-title">
            Welcome back, <span className="gradient-text">{user?.firstName}</span>!
          </h1>
          <p className="dashboard-subtitle">
            Here's your thinking style assessment overview and personalized insights
          </p>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card"
            style={{ 
              marginBottom: '2rem', 
              padding: '1rem', 
              backgroundColor: '#fef2f2', 
              border: '1px solid #fecaca',
              color: '#dc2626'
            }}
          >
            <p>{error}</p>
          </motion.div>
        )}

        {/* Assessment Status */}
        <div style={{ marginBottom: '3rem' }}>
          <h2 style={{ 
            fontSize: '2rem', 
            fontWeight: '700', 
            color: 'var(--text-primary)', 
            marginBottom: '1.5rem', 
            textAlign: 'center' 
          }}>Assessment Progress</h2>
          <div className="assessment-grid">
            {['kolb', 'sternberg', 'dual_process'].map((type) => {
              const typeInfo = getAssessmentTypeInfo(type);
              const assessment = assessments.find(a => a.type === type);
              const isCompleted = assessment && 
                assessment.scores && 
                typeof assessment.scores === 'object' && 
                Object.keys(assessment.scores).length > 0 &&
                assessment.completedAt;

              return (
                <div key={type} className="assessment-card">
                  <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>{typeInfo.icon}</div>
                  <h3 className="assessment-card-title">{typeInfo.name}</h3>
                  <p className="assessment-card-description">{typeInfo.description}</p>
                  
                  {isCompleted ? (
                    <div className="assessment-card-status status-completed">
                      <span>✅</span>
                      <span>Completed</span>
                      <small style={{ display: 'block', marginTop: '0.25rem' }}>{formatDate(assessment.completedAt)}</small>
                    </div>
                  ) : (
                    <div className="assessment-card-status status-pending">
                      <Link to={`/assessment/${type}`} className="btn btn-primary btn-small">
                        Take Assessment
                      </Link>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Reports */}
        {reports.length > 0 && (
          <div className="reports-section">
            <h2 className="reports-title">Your Reports</h2>
            <div className="reports-grid">
              {reports.map((report) => (
                <div key={report.id} className="report-card">
                  <div className="report-card-title">Thinking Style Profile</div>
                  <div className="report-card-meta">
                    <span>{formatDate(report.generatedAt)}</span>
                  </div>
                  
                  <div className="report-card-content">
                    <div style={{ marginBottom: '1rem' }}>
                      <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Primary Style</h4>
                      <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{report.overallProfile.primaryStyle.replace('_', ' ').toUpperCase()}</p>
                    </div>
                    
                    <div style={{ marginBottom: '1rem' }}>
                      <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Key Strengths</h4>
                      <ul style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', paddingLeft: '1rem' }}>
                        {report.overallProfile.strengths.slice(0, 3).map((strength, index) => (
                          <li key={index}>{strength}</li>
                        ))}
                      </ul>
                    </div>

                    {report.educationMapping.recommendedSHS.length > 0 && (
                      <div style={{ marginBottom: '1rem' }}>
                        <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Recommended SHS Tracks</h4>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                          {report.educationMapping.recommendedSHS.map((track, index) => (
                            <span key={index} style={{ 
                              backgroundColor: 'var(--bg-tertiary)', 
                              color: 'var(--text-primary)', 
                              padding: '0.25rem 0.5rem', 
                              borderRadius: '0.25rem', 
                              fontSize: '0.75rem' 
                            }}>{track}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <Link to={`/report/${report.id}`} className="btn btn-primary btn-full">
                    View Full Report
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Generate Report Button */}
        {getCompletedAssessments().length === 3 && reports.length === 0 && (
          <div className="dashboard-section">
            <div className="generate-report-card">
              <h2>🎉 Congratulations!</h2>
              <p>You've completed all three assessments. Generate your comprehensive thinking style report to get personalized recommendations for your education and career path.</p>
              <button 
                className="btn btn-primary btn-large"
                onClick={async () => {
                  try {
                    const response = await axios.post('/assessments/generate-report');
                    const newReport = response.data.report;
                    setReports([newReport, ...reports]);
                  } catch (error) {
                    console.error('Error generating report:', error);
                    setError('Failed to generate report');
                  }
                }}
              >
                Generate My Report
              </button>
            </div>
          </div>
        )}

        {/* Assessment Visualizations */}
        {getCompletedAssessments().length > 0 && (
          <div className="dashboard-section">
            <h2>Your Assessment Visualizations</h2>
            <AssessmentCharts assessments={assessments} />
          </div>
        )}

        {/* Quick Actions */}
        <div className="dashboard-section">
          <h2>Quick Actions</h2>
          <div className="quick-actions">
            {user?.role === 'student' && (
              <>
                <Link to="/assessment/kolb" className="action-card">
                  <span className="action-icon">📝</span>
                  <h3>Take Assessment</h3>
                  <p>Start or continue your thinking style assessment</p>
                </Link>
                
                <Link to="/profile" className="action-card">
                  <span className="action-icon">👤</span>
                  <h3>Update Profile</h3>
                  <p>Keep your information current</p>
                </Link>
              </>
            )}
            
            {user?.role === 'teacher' && (
              <>
                <Link to="/users/students" className="action-card">
                  <span className="action-icon">👥</span>
                  <h3>View Students</h3>
                  <p>Access your students' profiles and reports</p>
                </Link>
              </>
            )}
            
            {user?.role === 'parent' && (
              <>
                <Link to="/users/students" className="action-card">
                  <span className="action-icon">👨‍👩‍👧‍👦</span>
                  <h3>View Child's Profile</h3>
                  <p>Access your child's assessment results</p>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
