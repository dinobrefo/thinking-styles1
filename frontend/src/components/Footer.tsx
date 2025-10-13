import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-main">
          <div className="footer-brand">
            <div className="footer-brand-info">
        <h3 className="footer-title">Thinking Styles Assessment</h3>
              <p className="footer-description">
                A validated digital tool for measuring individual thinking styles, 
                contextualized for Ghana and West Africa's education system.
              </p>
            </div>
          </div>

          <div className="footer-links">
            <div className="footer-section">
              <h4 className="footer-section-title">Platform</h4>
              <ul className="footer-list">
                <li><Link to="/assessment" className="footer-link">Take Assessment</Link></li>
                <li><Link to="/dashboard" className="footer-link">Dashboard</Link></li>
                <li><Link to="/reports" className="footer-link">Reports</Link></li>
                <li><Link to="/admin" className="footer-link">Admin Panel</Link></li>
              </ul>
            </div>

            <div className="footer-section">
              <h4 className="footer-section-title">Resources</h4>
              <ul className="footer-list">
                <li><button className="footer-link" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>About Us</button></li>
                <li><button className="footer-link" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Research</button></li>
                <li><button className="footer-link" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Methodology</button></li>
                <li><button className="footer-link" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>FAQ</button></li>
              </ul>
            </div>

            <div className="footer-section">
              <h4 className="footer-section-title">Support</h4>
              <ul className="footer-list">
                <li><a href="mailto:support@thinkingstyles.gh" className="footer-link">Contact Support</a></li>
                <li><a href="#help" className="footer-link">Help Center</a></li>
                <li><a href="#privacy" className="footer-link">Privacy Policy</a></li>
                <li><a href="#terms" className="footer-link">Terms of Service</a></li>
              </ul>
            </div>

            <div className="footer-section">
              <h4 className="footer-section-title">Connect</h4>
              <ul className="footer-list">
                <li><a href="mailto:info@thinkalign.gh" className="footer-link">info@thinkalign.gh</a></li>
                <li><a href="tel:+233123456789" className="footer-link">+233 123 456 789</a></li>
                <li>
                  <div className="footer-social">
                    <button className="social-link" aria-label="Facebook">📘</button>
                    <button className="social-link" aria-label="Twitter">🐦</button>
                    <button className="social-link" aria-label="LinkedIn">💼</button>
                    <button className="social-link" aria-label="Instagram">📷</button>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <div className="footer-copyright">
              <p>&copy; 2024 Thinking Styles Assessment. All rights reserved.</p>
              <p className="footer-location">Designed for Ghana & West Africa</p>
            </div>
            
            <div className="footer-credentials">
              <div className="credential-item">
                <span className="credential-label">Powered by:</span>
                <span className="credential-value">Kolb's Learning Cycle • Sternberg's Triarchic Theory • Dual Process Theory</span>
              </div>
              <div className="credential-item">
                <span className="credential-label">Validated by:</span>
                <span className="credential-value">Ghana Education Service • University of Ghana • KNUST</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
