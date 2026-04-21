import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { FaSignOutAlt, FaUserCircle, FaCode } from 'react-icons/fa';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <motion.nav 
        className="navbar"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 100 }}
      >
        <div className="navbar-container">
          <div className="navbar-brand">
            <span className="brand-icon">🎓</span>
            <span className="brand-text">Smart Voting</span>
          </div>

          <div className="navbar-menu">
            <motion.div
              className="dev-badge"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, type: 'spring' }}
              whileHover={{ scale: 1.05 }}
              title="Developer: Darshil | 25BT04221"
            >
              <FaCode className="dev-badge-icon" />
              <div className="dev-badge-info">
                <span className="dev-badge-name">Darshil</span>
                <span className="dev-badge-id">25BT04221</span>
              </div>
            </motion.div>

            <div className="user-info">
              <FaUserCircle />
              <span>{user?.enrollmentNumber}</span>
            </div>
            
            <motion.button
              className="btn-logout"
              onClick={handleLogout}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaSignOutAlt />
              Logout
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Developer Watermark - floating bottom right */}
      <motion.div
        className="dev-watermark"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.6 }}
      >
        <span className="dev-watermark-line1">⚡ Built by <strong>Darshil</strong></span>
        <span className="dev-watermark-line2">Enrollment: 25BT04221</span>
      </motion.div>
    </>
  );
};

export default Navbar;