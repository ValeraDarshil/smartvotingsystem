import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import TeamCard from './TeamCard';
import Timer from '../Common/Timer';
import { FaPoll, FaCheckCircle } from 'react-icons/fa';

const PollList = ({ onViewLeaderboard }) => {
  const [polls, setPolls] = useState([]);
  const [selectedPoll, setSelectedPoll] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPolls();
  }, []);

  const fetchPolls = async () => {
    try {
      const { data } = await axios.get('/api/polls');
      setPolls(data);
      if (data.length > 0 && !selectedPoll) {
        setSelectedPoll(data[0]);
      }
    } catch (error) {
      console.error('Error fetching polls:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVoteSuccess = () => {
    fetchPolls();
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner large"></div>
      </div>
    );
  }

  if (polls.length === 0) {
    return (
      <motion.div 
        className="empty-state"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <FaPoll size={64} />
        <h2>No Active Polls</h2>
        <p>There are no polls available at the moment.</p>
      </motion.div>
    );
  }

  return (
    <div className="poll-list-container">
      {polls.length > 1 && (
        <div className="poll-selector">
          {polls.map(poll => (
            <motion.button
              key={poll._id}
              className={`poll-tab ${selectedPoll?._id === poll._id ? 'active' : ''}`}
              onClick={() => setSelectedPoll(poll)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {poll.title}
              {poll.hasVoted && <FaCheckCircle className="voted-icon" />}
            </motion.button>
          ))}
        </div>
      )}

      <AnimatePresence mode="wait">
        {selectedPoll && (
          <motion.div
            key={selectedPoll._id}
            className="poll-content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="poll-header">
              <h2>{selectedPoll.title}</h2>
              {selectedPoll.description && (
                <p className="poll-description">{selectedPoll.description}</p>
              )}
              
              <Timer 
                endTime={selectedPoll.endTime} 
                onExpire={fetchPolls}
              />

              <motion.button
                className="btn-secondary"
                onClick={() => onViewLeaderboard(selectedPoll._id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                View Leaderboard
              </motion.button>
            </div>

            {selectedPoll.hasVoted && (
              <motion.div 
                className="info-banner"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <FaCheckCircle />
                <span>You have already voted in this poll</span>
              </motion.div>
            )}

            <div className="teams-grid">
              {selectedPoll.teams.map((team, index) => (
                <TeamCard
                  key={team._id}
                  team={team}
                  pollId={selectedPoll._id}
                  criteria={selectedPoll.criteria}
                  hasVoted={selectedPoll.hasVoted}
                  onVoteSuccess={handleVoteSuccess}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PollList;