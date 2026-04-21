import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaStar, FaCheckCircle, FaLock } from 'react-icons/fa';
import axios from 'axios';
import VoteBlockedPopup from '../Common/VoteBlockedPopup';

const TeamCard = ({ team, pollId, criteria, hasVoted, onVoteSuccess }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [ratings, setRatings] = useState(
    criteria.reduce((acc, c) => ({ ...acc, [c.name]: 0 }), {})
  );
  const [hoveredStar, setHoveredStar] = useState({});
  const [loading, setLoading] = useState(false);
  const [voted, setVoted] = useState(false);

  // Popup state
  const [popup, setPopup] = useState({ open: false, type: 'already_voted' });

  const showPopup = (type) => setPopup({ open: true, type });
  const closePopup = () => setPopup({ open: false, type: popup.type });

  const handleRating = (criteriaName, rating) => {
    if (!voted && !hasVoted) {
      setRatings(prev => ({ ...prev, [criteriaName]: rating }));
    }
  };

  const calculateOverallRating = () => {
    const values = Object.values(ratings);
    const sum = values.reduce((a, b) => a + b, 0);
    return values.length > 0 ? sum / values.length : 0;
  };

  const handleSubmit = async () => {
    const allRated = criteria.every(c => ratings[c.name] > 0);

    if (!allRated) {
      showPopup('rate_all');
      return;
    }

    setLoading(true);

    try {
      const ratingData = criteria.map(c => ({
        criteriaName: c.name,
        rating: ratings[c.name]
      }));

      await axios.post(`/api/polls/${pollId}/vote`, {
        teamId: team._id,
        ratings: ratingData,
        overallRating: calculateOverallRating()
      });

      setVoted(true);
      setTimeout(() => {
        setIsFlipped(false);
        if (onVoteSuccess) onVoteSuccess();
      }, 2000);
    } catch (error) {
      const msg = error.response?.data?.message || '';
      if (
        error.response?.status === 400 &&
        (msg.toLowerCase().includes('already voted') || msg.toLowerCase().includes('already vote'))
      ) {
        showPopup('already_voted');
        setIsFlipped(false);
        if (onVoteSuccess) onVoteSuccess();
      } else {
        showPopup('already_voted');
      }
    } finally {
      setLoading(false);
    }
  };

  const cardVariants = {
    front: { rotateY: 0 },
    back: { rotateY: 180 }
  };

  const isLocked = voted || hasVoted;

  return (
    <>
      <VoteBlockedPopup
        isOpen={popup.open}
        onClose={closePopup}
        type={popup.type}
        teamName={team.name}
      />

      <motion.div
        className={`team-card-wrapper ${isLocked ? 'locked' : ''}`}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          className="team-card"
          animate={isFlipped ? 'back' : 'front'}
          variants={cardVariants}
          transition={{ duration: 0.6, type: 'spring' }}
          onClick={() => !isLocked && !isFlipped && setIsFlipped(true)}
        >
          {/* Front Side */}
          <div className="card-face card-front">
            {isLocked && (
              <div className="lock-badge">
                <FaLock />
              </div>
            )}

            <div className="team-emoji">
              {String.fromCodePoint(0x1F4A1 + Math.floor(Math.random() * 20))}
            </div>

            <h3>{team.name}</h3>

            {team.description && (
              <p className="team-description">{team.description}</p>
            )}

            {!isLocked && (
              <motion.div
                className="tap-hint"
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                Tap to rate →
              </motion.div>
            )}

            {isLocked && (
              <div className="voted-badge">
                <FaCheckCircle />
                <span>Voted</span>
              </div>
            )}
          </div>

          {/* Back Side */}
          <div className="card-face card-back">
            <div className="rating-container">
              <h4>Rate {team.name}</h4>

              <div className="criteria-list">
                {criteria.map((criterion) => (
                  <div key={criterion.name} className="criterion-item">
                    <label>{criterion.name}</label>
                    <div className="stars">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <motion.button
                          key={star}
                          type="button"
                          className={`star ${star <= (hoveredStar[criterion.name] || ratings[criterion.name]) ? 'active' : ''}`}
                          onMouseEnter={() => setHoveredStar(prev => ({ ...prev, [criterion.name]: star }))}
                          onMouseLeave={() => setHoveredStar(prev => ({ ...prev, [criterion.name]: 0 }))}
                          onClick={() => handleRating(criterion.name, star)}
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                          disabled={voted}
                        >
                          <FaStar />
                        </motion.button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="card-actions">
                {!voted ? (
                  <>
                    <motion.button
                      className="btn-secondary"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsFlipped(false);
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Cancel
                    </motion.button>

                    <motion.button
                      className="btn-primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSubmit();
                      }}
                      disabled={loading}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {loading ? (
                        <span className="loading-spinner"></span>
                      ) : (
                        <>
                          <FaCheckCircle />
                          Save Vote
                        </>
                      )}
                    </motion.button>
                  </>
                ) : (
                  <motion.div
                    className="success-message"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                  >
                    <FaCheckCircle />
                    <span>Vote Submitted!</span>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
};

export default TeamCard;