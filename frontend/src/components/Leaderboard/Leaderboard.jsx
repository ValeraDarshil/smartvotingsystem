import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { FaTrophy, FaMedal, FaStar, FaArrowLeft } from 'react-icons/fa';
import confetti from 'canvas-confetti';

const Leaderboard = ({ pollId, onBack }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, [pollId]);

  const fetchLeaderboard = async () => {
    try {
      const { data } = await axios.get(`/api/polls/${pollId}/leaderboard`);
      setData(data);
      
      // Trigger confetti for top 3
      if (data.leaderboard.length > 0) {
        setTimeout(() => {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          });
        }, 500);
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMedalIcon = (index) => {
    switch(index) {
      case 0:
        return <span className="medal gold">🥇</span>;
      case 1:
        return <span className="medal silver">🥈</span>;
      case 2:
        return <span className="medal bronze">🥉</span>;
      default:
        return <span className="rank">#{index + 1}</span>;
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner large"></div>
      </div>
    );
  }

  if (!data) {
    return <div>Error loading leaderboard</div>;
  }

  return (
    <motion.div 
      className="leaderboard-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="leaderboard-header">
        <motion.button
          className="btn-back"
          onClick={onBack}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaArrowLeft />
          Back
        </motion.button>

        <div className="leaderboard-title">
          <FaTrophy size={32} />
          <h2>{data.pollTitle}</h2>
        </div>

        <div className="leaderboard-stats">
          <div className="stat-item">
            <span className="stat-value">{data.totalVotes}</span>
            <span className="stat-label">Total Votes</span>
          </div>
        </div>
      </div>

      <div className="leaderboard-list">
        {data.leaderboard.map((team, index) => (
          <motion.div
            key={team.teamId}
            className={`leaderboard-item ${index < 3 ? 'top-three' : ''}`}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="rank-badge">
              {getMedalIcon(index)}
            </div>

            <div className="team-info">
              <h3>{team.teamName}</h3>
              <div className="team-stats">
                <span className="votes-count">{team.totalVotes} votes</span>
              </div>
            </div>

            <div className="rating-display">
              <div className="rating-value">
                <FaStar className="star-icon" />
                <span>{team.averageRating.toFixed(2)}</span>
              </div>
              
              <div className="rating-bar">
                <motion.div 
                  className="rating-fill"
                  initial={{ width: 0 }}
                  animate={{ width: `${(team.averageRating / 5) * 100}%` }}
                  transition={{ delay: index * 0.1 + 0.3, duration: 0.8 }}
                />
              </div>
            </div>

            {team.criteriaScores.length > 0 && (
              <div className="criteria-breakdown">
                {team.criteriaScores.map((score, idx) => (
                  <div key={idx} className="criterion-score">
                    <span className="criterion-name">{score.name}</span>
                    <div className="criterion-stars">
                      {[...Array(5)].map((_, i) => (
                        <FaStar 
                          key={i}
                          className={i < Math.round(score.average) ? 'filled' : 'empty'}
                        />
                      ))}
                    </div>
                    <span className="criterion-value">{score.average.toFixed(1)}</span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Leaderboard;