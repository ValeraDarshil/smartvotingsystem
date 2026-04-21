import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheckCircle, FaTimesCircle, FaExclamationTriangle, FaTimes } from 'react-icons/fa';

/* ─────────────────────────────────────────────
   TOAST NOTIFICATION  (top-right corner)
   Usage: <Toast message="..." type="success|error" onClose={fn} />
───────────────────────────────────────────── */
export const Toast = ({ message, type = 'success', onClose, duration = 3500 }) => {
  useEffect(() => {
    const t = setTimeout(onClose, duration);
    return () => clearTimeout(t);
  }, [onClose, duration]);

  const config = {
    success: {
      icon: <FaCheckCircle />,
      accent: '#22c55e',
      bg: 'linear-gradient(135deg, #0f2a1a 0%, #0a1f14 100%)',
      border: 'rgba(34,197,94,0.35)',
      glow: 'rgba(34,197,94,0.15)',
    },
    error: {
      icon: <FaTimesCircle />,
      accent: '#ef4444',
      bg: 'linear-gradient(135deg, #2a0f0f 0%, #1f0a0a 100%)',
      border: 'rgba(239,68,68,0.35)',
      glow: 'rgba(239,68,68,0.15)',
    },
  };

  const c = config[type] || config.success;

  return (
    <motion.div
      initial={{ opacity: 0, x: 80, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 80, scale: 0.85 }}
      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
      style={{
        position: 'fixed',
        top: '24px',
        right: '24px',
        zIndex: 99999,
        minWidth: '280px',
        maxWidth: '380px',
        background: c.bg,
        border: `1px solid ${c.border}`,
        borderRadius: '14px',
        padding: '14px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        boxShadow: `0 8px 32px rgba(0,0,0,0.45), 0 0 0 1px ${c.border}, inset 0 1px 0 rgba(255,255,255,0.06)`,
        backdropFilter: 'blur(12px)',
        cursor: 'default',
      }}
    >
      {/* left accent bar */}
      <div style={{
        position: 'absolute', left: 0, top: '12px', bottom: '12px',
        width: '3px', borderRadius: '0 3px 3px 0', background: c.accent,
        boxShadow: `0 0 8px ${c.accent}`,
      }} />

      {/* icon */}
      <span style={{ color: c.accent, fontSize: '20px', flexShrink: 0, filter: `drop-shadow(0 0 6px ${c.accent})` }}>
        {c.icon}
      </span>

      {/* message */}
      <p style={{
        flex: 1, margin: 0, fontSize: '14px', fontWeight: 500,
        color: '#e2e8f0', lineHeight: 1.45, letterSpacing: '0.01em',
      }}>
        {message}
      </p>

      {/* close btn */}
      <button
        onClick={onClose}
        style={{
          background: 'none', border: 'none', color: 'rgba(255,255,255,0.35)',
          cursor: 'pointer', padding: '2px', display: 'flex', alignItems: 'center',
          flexShrink: 0, transition: 'color 0.2s',
        }}
        onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.8)'}
        onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.35)'}
      >
        <FaTimes size={12} />
      </button>

      {/* progress bar */}
      <motion.div
        initial={{ scaleX: 1 }}
        animate={{ scaleX: 0 }}
        transition={{ duration: duration / 1000, ease: 'linear' }}
        style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '2px',
          background: c.accent, borderRadius: '0 0 14px 14px',
          transformOrigin: 'left', opacity: 0.6,
        }}
      />
    </motion.div>
  );
};


/* ─────────────────────────────────────────────
   CONFIRM DIALOG  (center modal)
   Usage: <ConfirmDialog message="..." onConfirm={fn} onCancel={fn} />
───────────────────────────────────────────── */
export const ConfirmDialog = ({ message, onConfirm, onCancel }) => {
  return (
    <AnimatePresence>
      {/* backdrop */}
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onCancel}
        style={{
          position: 'fixed', inset: 0, zIndex: 99998,
          background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)',
        }}
      />

      {/* centering wrapper */}
      <div
        key="dialog-wrapper"
        style={{
          position: 'fixed', inset: 0, zIndex: 99999,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          pointerEvents: 'none',
        }}
      >
      {/* dialog */}
      <motion.div
        key="dialog"
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.85 }}
        transition={{ type: 'spring', stiffness: 400, damping: 28 }}
        style={{
          pointerEvents: 'all',
          width: 'min(400px, 90vw)',
          background: 'linear-gradient(145deg, #1a1f2e 0%, #111520 100%)',
          border: '1px solid rgba(239,68,68,0.25)',
          borderRadius: '18px',
          padding: '28px 24px 22px',
          boxShadow: '0 24px 64px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.07)',
          textAlign: 'center',
        }}
      >
        {/* warning icon */}
        <div style={{
          width: '52px', height: '52px', borderRadius: '50%',
          background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 16px', fontSize: '22px', color: '#ef4444',
          boxShadow: '0 0 20px rgba(239,68,68,0.15)',
        }}>
          <FaExclamationTriangle />
        </div>

        <h3 style={{
          margin: '0 0 8px', fontSize: '16px', fontWeight: 700,
          color: '#f1f5f9', letterSpacing: '0.01em',
        }}>
          Confirm Action
        </h3>

        <p style={{
          margin: '0 0 24px', fontSize: '14px', color: 'rgba(255,255,255,0.55)',
          lineHeight: 1.55,
        }}>
          {message}
        </p>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={onCancel}
            style={{
              flex: 1, padding: '11px', borderRadius: '10px',
              background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
              color: 'rgba(255,255,255,0.7)', fontSize: '14px', fontWeight: 600,
              cursor: 'pointer', transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; }}
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            style={{
              flex: 1, padding: '11px', borderRadius: '10px',
              background: 'linear-gradient(135deg, #ef4444, #dc2626)',
              border: '1px solid rgba(239,68,68,0.4)',
              color: '#fff', fontSize: '14px', fontWeight: 700,
              cursor: 'pointer', transition: 'all 0.2s',
              boxShadow: '0 4px 16px rgba(239,68,68,0.25)',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(239,68,68,0.4)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(239,68,68,0.25)'; }}
          >
            Delete
          </button>
        </div>
      </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default Toast;