import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaClock } from 'react-icons/fa';

const Timer = ({ endTime, onExpire }) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft() {
    const difference = new Date(endTime) - new Date();
    
    if (difference <= 0) {
      return { expired: true };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
      expired: false
    };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);

      if (newTimeLeft.expired && onExpire) {
        onExpire();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [endTime, onExpire]);

  if (timeLeft.expired) {
    return (
      <motion.div 
        className="timer expired"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
      >
        <FaClock />
        <span>Voting Closed</span>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="timer"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <FaClock />
      <div className="time-blocks">
        {timeLeft.days > 0 && (
          <div className="time-block">
            <span className="time-value">{timeLeft.days}</span>
            <span className="time-label">days</span>
          </div>
        )}
        <div className="time-block">
          <span className="time-value">{String(timeLeft.hours).padStart(2, '0')}</span>
          <span className="time-label">hrs</span>
        </div>
        <div className="time-block">
          <span className="time-value">{String(timeLeft.minutes).padStart(2, '0')}</span>
          <span className="time-label">min</span>
        </div>
        <div className="time-block">
          <span className="time-value">{String(timeLeft.seconds).padStart(2, '0')}</span>
          <span className="time-label">sec</span>
        </div>
      </div>
    </motion.div>
  );
};

export default Timer;