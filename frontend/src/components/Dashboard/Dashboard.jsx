import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../Common/Navbar';
import PollList from '../Voting/PollList';
import Leaderboard from '../Leaderboard/Leaderboard';

const Dashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [view, setView] = useState('polls'); // 'polls' or 'leaderboard'
  const [selectedPollId, setSelectedPollId] = useState(null);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  const handleViewLeaderboard = (pollId) => {
    setSelectedPollId(pollId);
    setView('leaderboard');
  };

  const handleBackToPolls = () => {
    setView('polls');
    setSelectedPollId(null);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner large"></div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <Navbar />
      
      <div className="dashboard-background">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
      </div>

      <motion.main 
        className="dashboard-content"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {view === 'polls' ? (
          <PollList onViewLeaderboard={handleViewLeaderboard} />
        ) : (
          <Leaderboard pollId={selectedPollId} onBack={handleBackToPolls} />
        )}
      </motion.main>
    </div>
  );
};

export default Dashboard;