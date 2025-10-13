import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from '../components/AuthModal';
import Footer from '../components/Footer';

const HomePage: React.FC = () => {
  const { user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('register');

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">
              Discover Your <span className="gradient-text">ThinkAlign</span>
            </h1>
            <p className="hero-description">
              A comprehensive assessment tool designed to help you understand your cognitive preferences, 
              learning styles, and decision-making patterns. Perfect for students, educators, and professionals 
              seeking to optimize their academic and career paths.
            </p>
            <div className="hero-tagline">Think. Know. Grow.</div>
            
            <div className="hero-actions">
              {user ? (
                <Link to="/dashboard" className="btn-primary">
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <button 
                    className="btn-primary"
                    onClick={() => {
                      setAuthMode('register');
                      setShowAuthModal(true);
                    }}
                  >
                    Start Assessment
                  </button>
                  <button 
                    className="btn-secondary"
                    onClick={() => {
                      setAuthMode('login');
                      setShowAuthModal(true);
                    }}
                  >
                    Sign In
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2 className="section-title">Why Choose Our Assessment?</h2>
          <div className="features-grid">
            <div className="glass-card">
              <div className="feature-icon">🧠</div>
              <h3>Comprehensive Analysis</h3>
              <p>Based on established psychological frameworks including Kolb's Learning Styles, Sternberg's Triarchic Theory, and Dual Process Theory.</p>
            </div>
            <div className="glass-card">
              <div className="feature-icon">🎯</div>
              <h3>Personalized Insights</h3>
              <p>Receive detailed reports with actionable recommendations tailored to your unique cognitive profile and learning preferences.</p>
            </div>
            <div className="glass-card">
              <div className="feature-icon">📊</div>
              <h3>Progress Tracking</h3>
              <p>Monitor your development over time and see how your cognitive alignment evolves with experience and learning.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="benefits-section">
        <div className="container">
          <h2 className="section-title">Benefits for Different Users</h2>
          <div className="benefits-grid">
            <div className="glass-card">
              <h3>🎓 Students</h3>
              <ul>
                <li>Identify cognitive strengths and learning preferences</li>
                <li>Get evidence-based guidance for SHS track selection</li>
                <li>Align tertiary programs with your cognitive alignment</li>
                <li>Reduce academic misalignment and improve outcomes</li>
              </ul>
            </div>
            <div className="glass-card">
              <h3>👨‍🏫 Teachers & Counselors</h3>
              <ul>
                <li>Understand student learning patterns and preferences</li>
                <li>Provide personalized guidance and support</li>
                <li>Improve teaching strategies and classroom management</li>
                <li>Enhance student engagement and academic performance</li>
              </ul>
            </div>
            <div className="glass-card">
              <h3>👨‍👩‍👧‍👦 Parents</h3>
              <ul>
                <li>Gain insights into your child's cognitive profile</li>
                <li>Support informed educational and career decisions</li>
                <li>Understand learning preferences and communication styles</li>
                <li>Foster better parent-child relationships</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="glass-card-strong">
            <h2>Ready to Discover Your ThinkAlign?</h2>
            <p className="cta-tagline">Think. Know. Grow.</p>
            <p>Join thousands of students, educators, and professionals who have already discovered their cognitive strengths and unlocked their potential.</p>
            <div className="cta-actions">
              {user ? (
                <Link to="/dashboard" className="btn-primary">
                  Go to Dashboard
                </Link>
              ) : (
                <button 
                  className="btn-primary"
                  onClick={() => {
                    setAuthMode('register');
                    setShowAuthModal(true);
                  }}
                >
                  Start Your Assessment
                </button>
              )}
            </div>
          </div>
        </div>
      </section>


      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode={authMode}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default HomePage;
