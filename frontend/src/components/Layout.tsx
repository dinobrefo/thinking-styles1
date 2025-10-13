import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HomeIcon, 
  UserIcon, 
  DocumentTextIcon, 
  CogIcon,
  SunIcon,
  MoonIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { cn } from '../utils/cn';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const getNavItems = () => {
    if (!user) return [];

    const baseItems = [
      { path: '/dashboard', label: 'Dashboard', icon: HomeIcon },
      { path: '/profile', label: 'Profile', icon: UserIcon }
    ];

    if (user.role === 'student') {
      baseItems.splice(1, 0, { path: '/assessment/kolb', label: 'Take Assessment', icon: DocumentTextIcon });
    }

    if (user.role === 'admin') {
      baseItems.push({ path: '/admin', label: 'Admin', icon: CogIcon });
    }

    return baseItems;
  };

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="glass-nav"
        style={{ position: 'sticky', top: 0, zIndex: 50 }}
      >
        <div className="nav-container">
          <div className="flex justify-between items-center" style={{ height: '4rem' }}>
            {/* Logo */}
            <Link to="/" className="nav-brand">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                style={{
                  width: '2.5rem',
                  height: '2.5rem',
                  background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                  borderRadius: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '0.75rem'
                }}
              >
                <span style={{ color: 'white', fontSize: '1.25rem', fontWeight: '700' }}>🧠</span>
              </motion.div>
              <span className="gradient-text" style={{ 
                fontSize: '1.25rem', 
                fontWeight: '700'
              }}>
                Thinking Styles Assessment
              </span>
            </Link>

                   {/* Desktop Navigation */}
                   {user && (
                     <div className="nav-menu">
                       <div className="nav-links">
                         {getNavItems().map((item, index) => {
                           const IconComponent = item.icon;
                           return (
                             <motion.div
                               key={item.path}
                               initial={{ opacity: 0, y: -20 }}
                               animate={{ opacity: 1, y: 0 }}
                               transition={{ delay: index * 0.1 }}
                             >
                               <Link
                                 to={item.path}
                                 className={isActive(item.path) ? "nav-link active" : "nav-link"}
                               >
                                 <IconComponent className="nav-icon" />
                                 <span>{item.label}</span>
                               </Link>
                             </motion.div>
                           );
                         })}
                       </div>

                       <div className="nav-user-section">
                         {/* Theme Toggle */}
                         <motion.button
                           whileHover={{ scale: 1.1 }}
                           whileTap={{ scale: 0.9 }}
                           onClick={toggleTheme}
                           className="theme-toggle-btn"
                           aria-label="Toggle theme"
                         >
                           {theme === 'light' ? (
                             <MoonIcon className="theme-icon" />
                           ) : (
                             <SunIcon className="theme-icon" />
                           )}
                         </motion.button>

                         {/* User Menu */}
                         <div className="user-menu">
                           <div className="user-info">
                             <div className="user-name">
                               {user.firstName} {user.lastName}
                             </div>
                             <div className="user-role">
                               {user.role}
                             </div>
                           </div>
                           <motion.button
                             whileHover={{ scale: 1.05 }}
                             whileTap={{ scale: 0.95 }}
                             onClick={handleLogout}
                             className="btn btn-outline btn-small"
                           >
                             Logout
                           </motion.button>
                         </div>
                       </div>
                     </div>
                   )}

                   {/* Mobile Menu Button */}
                   {user && (
                     <motion.button
                       whileTap={{ scale: 0.95 }}
                       onClick={() => setIsMenuOpen(!isMenuOpen)}
                       className="mobile-menu-btn"
                     >
                       {isMenuOpen ? (
                         <XMarkIcon className="mobile-menu-icon" />
                       ) : (
                         <Bars3Icon className="mobile-menu-icon" />
                       )}
                     </motion.button>
                   )}
          </div>
        </div>

               {/* Mobile Menu */}
               <AnimatePresence>
                 {user && isMenuOpen && (
                   <motion.div
                     initial={{ opacity: 0, height: 0 }}
                     animate={{ opacity: 1, height: 'auto' }}
                     exit={{ opacity: 0, height: 0 }}
                     className="mobile-menu"
                   >
                     <div className="mobile-menu-content">
                       {getNavItems().map((item) => {
                         const IconComponent = item.icon;
                         return (
                           <Link
                             key={item.path}
                             to={item.path}
                             className={cn(
                               "mobile-nav-link",
                               isActive(item.path) ? "mobile-nav-link-active" : ""
                             )}
                             onClick={() => setIsMenuOpen(false)}
                           >
                             <IconComponent className="mobile-nav-icon" />
                             <span>{item.label}</span>
                           </Link>
                         );
                       })}
                       
                       <div className="mobile-menu-footer">
                         <button
                           onClick={toggleTheme}
                           className="mobile-theme-btn"
                         >
                           {theme === 'light' ? (
                             <MoonIcon className="mobile-nav-icon" />
                           ) : (
                             <SunIcon className="mobile-nav-icon" />
                           )}
                           <span>Toggle Theme</span>
                         </button>
                         <button
                           onClick={handleLogout}
                           className="btn btn-outline btn-small mobile-logout-btn"
                         >
                           Logout
                         </button>
                       </div>
                     </div>
                   </motion.div>
                 )}
               </AnimatePresence>
      </motion.nav>

      {/* Main Content */}
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex-1"
      >
        {children}
      </motion.main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Layout;