import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaLock, FaTimes, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

const VoteBlockedPopup = ({ isOpen, onClose, type = 'already_voted', teamName = '' }) => {
  // Close on Escape key
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  // Auto-close after 4s for already_voted popup
  useEffect(() => {
    if (isOpen && type === 'already_voted') {
      const timer = setTimeout(onClose, 4000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, type, onClose]);

  const config = {
    already_voted: {
      icon: <FaLock size={36} />,
      iconBg: 'rgba(99,102,241,0.15)',
      iconColor: '#6366f1',
      glowColor: 'rgba(99,102,241,0.3)',
      title: 'Vote Already Cast!',
      subtitle: 'Ek poll mein sirf ek vote allowed hai',
      message: 'Aapne is poll mein pehle se vote kar diya hai. Fair voting ensure karne ke liye ek student sirf ek team ko rate kar sakta hai.',
      badge: '🔒 Vote Locked',
      badgeBg: 'rgba(99,102,241,0.1)',
      badgeColor: '#818cf8',
      btnText: 'Samajh Gaya!',
      btnGradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    },
    rate_all: {
      icon: <FaExclamationTriangle size={36} />,
      iconBg: 'rgba(245,158,11,0.15)',
      iconColor: '#f59e0b',
      glowColor: 'rgba(245,158,11,0.3)',
      title: 'Ratings Incomplete!',
      subtitle: 'Sabhi criteria rate karna zaroori hai',
      message: 'Vote submit karne se pehle please saare criteria ko rate karein. Har star rating team ki performance ka ek important hissa hai.',
      badge: '⭐ Rate All Criteria',
      badgeBg: 'rgba(245,158,11,0.1)',
      badgeColor: '#fbbf24',
      btnText: 'Theek Hai, Karunga!',
      btnGradient: 'linear-gradient(135deg, #f59e0b, #ef4444)',
    }
  };

  const c = config[type] || config.already_voted;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.65)',
              backdropFilter: 'blur(6px)',
              zIndex: 9998,
            }}
          />

          {/* Popup — centering wrapper (no transform clash with framer) */}
          <div
            key="popup-wrapper"
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px',
              pointerEvents: 'none',
            }}
          >
          <motion.div
            key="popup"
            initial={{ opacity: 0, scale: 0.75, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            style={{
              width: '100%',
              maxWidth: '420px',
              pointerEvents: 'all',
            }}
          >
            <div style={{
              background: 'linear-gradient(145deg, #1e293b, #0f172a)',
              border: `1px solid ${c.glowColor}`,
              borderRadius: '24px',
              padding: '36px 32px',
              boxShadow: `0 25px 60px rgba(0,0,0,0.5), 0 0 40px ${c.glowColor}`,
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
            }}>

              {/* Background glow blob */}
              <div style={{
                position: 'absolute',
                top: '-40px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '200px',
                height: '200px',
                background: c.glowColor,
                borderRadius: '50%',
                filter: 'blur(60px)',
                opacity: 0.4,
                pointerEvents: 'none',
              }} />

              {/* Close button */}
              <button
                onClick={onClose}
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#94a3b8',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
              >
                <FaTimes size={12} />
              </button>

              {/* Icon */}
              <motion.div
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.1, type: 'spring', stiffness: 300 }}
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: c.iconBg,
                  border: `2px solid ${c.glowColor}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px',
                  color: c.iconColor,
                }}
              >
                {c.icon}
              </motion.div>

              {/* Title */}
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                style={{
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  color: '#f1f5f9',
                  marginBottom: '6px',
                  letterSpacing: '-0.02em',
                }}
              >
                {c.title}
              </motion.h2>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                style={{
                  fontSize: '0.85rem',
                  color: c.iconColor,
                  fontWeight: 500,
                  marginBottom: '16px',
                }}
              >
                {c.subtitle}
              </motion.p>

              {/* Message */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.25 }}
                style={{
                  fontSize: '0.9rem',
                  color: '#94a3b8',
                  lineHeight: 1.6,
                  marginBottom: '24px',
                }}
              >
                {c.message}
              </motion.p>

              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                style={{
                  display: 'inline-block',
                  background: c.badgeBg,
                  border: `1px solid ${c.glowColor}`,
                  borderRadius: '20px',
                  padding: '6px 16px',
                  fontSize: '0.8rem',
                  color: c.badgeColor,
                  fontWeight: 600,
                  marginBottom: '24px',
                }}
              >
                {c.badge}
              </motion.div>

              {/* Auto-close progress bar for already_voted */}
              {type === 'already_voted' && (
                <motion.div
                  style={{
                    height: '3px',
                    background: 'rgba(255,255,255,0.05)',
                    borderRadius: '2px',
                    marginBottom: '20px',
                    overflow: 'hidden',
                  }}
                >
                  <motion.div
                    initial={{ width: '100%' }}
                    animate={{ width: '0%' }}
                    transition={{ duration: 4, ease: 'linear' }}
                    style={{
                      height: '100%',
                      background: `linear-gradient(90deg, #6366f1, #8b5cf6)`,
                      borderRadius: '2px',
                    }}
                  />
                </motion.div>
              )}

              {/* Button */}
              <motion.button
                onClick={onClose}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                style={{
                  width: '100%',
                  padding: '13px',
                  background: c.btnGradient,
                  border: 'none',
                  borderRadius: '12px',
                  color: 'white',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  boxShadow: `0 4px 20px ${c.glowColor}`,
                  letterSpacing: '0.02em',
                }}
              >
                {c.btnText}
              </motion.button>
            </div>
          </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default VoteBlockedPopup;