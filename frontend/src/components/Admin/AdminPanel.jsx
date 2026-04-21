import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../Common/Navbar';
import CreatePoll from './CreatePoll';
import { Toast, ConfirmDialog } from '../Common/Toast';
import { FaPoll, FaVoteYea, FaChartBar, FaTrash } from 'react-icons/fa';

const AdminPanel = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [polls, setPolls] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [activeTab, setActiveTab] = useState('create');
  const [toast, setToast] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState(null); // { pollId }

  const showToast = (message, type = 'success') => setToast({ message, type });

  useEffect(() => {
    if (!loading && (!user || !user.isAdmin)) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user?.isAdmin) {
      fetchPolls();
      fetchAnalytics();
    }
  }, [user]);

  const fetchPolls = async () => {
    try {
      const { data } = await axios.get('/api/admin/polls');
      setPolls(data);
    } catch (error) {
      console.error('Error fetching polls:', error);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const { data } = await axios.get('/api/admin/analytics');
      setAnalytics(data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  const handleDeletePoll = (pollId) => {
    setConfirmDialog({ pollId });
  };

  const confirmDelete = async () => {
    const pollId = confirmDialog.pollId;
    setConfirmDialog(null);
    try {
      await axios.delete(`/api/admin/polls/${pollId}`);
      fetchPolls();
      fetchAnalytics();
      showToast('Poll deleted successfully', 'success');
    } catch (error) {
      showToast(error.response?.data?.message || 'Error deleting poll', 'error');
    }
  };

  const handlePollCreated = () => {
    fetchPolls();
    fetchAnalytics();
    setActiveTab('manage');
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner large"></div>
      </div>
    );
  }

  return (
    <div className="admin-panel">
      <AnimatePresence>
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
        {confirmDialog && (
          <ConfirmDialog
            message="Are you sure you want to delete this poll? This action cannot be undone."
            onConfirm={confirmDelete}
            onCancel={() => setConfirmDialog(null)}
          />
        )}
      </AnimatePresence>

      <Navbar />
      
      <div className="dashboard-background">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
      </div>

      <motion.div 
        className="admin-content"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="admin-header">
          <h1>Admin Dashboard</h1>
          
          {analytics && (
            <div className="analytics-cards">
              <div className="analytics-card">
                <FaPoll />
                <div>
                  <h3>{analytics.totalPolls}</h3>
                  <p>Total Polls</p>
                </div>
              </div>

              <div className="analytics-card">
                <FaVoteYea />
                <div>
                  <h3>{analytics.totalVotes}</h3>
                  <p>Total Votes</p>
                </div>
              </div>

              <div className="analytics-card">
                <FaChartBar />
                <div>
                  <h3>{analytics.activePolls}</h3>
                  <p>Active Polls</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="admin-tabs">
          <button
            className={`tab ${activeTab === 'create' ? 'active' : ''}`}
            onClick={() => setActiveTab('create')}
          >
            Create Poll
          </button>
          <button
            className={`tab ${activeTab === 'manage' ? 'active' : ''}`}
            onClick={() => setActiveTab('manage')}
          >
            Manage Polls
          </button>
        </div>

        {activeTab === 'create' ? (
          <CreatePoll onPollCreated={handlePollCreated} />
        ) : (
          <div className="polls-management">
            <h2>All Polls</h2>
            
            {polls.length === 0 ? (
              <div className="empty-state">
                <p>No polls created yet</p>
              </div>
            ) : (
              <div className="polls-list">
                {polls.map(poll => (
                  <motion.div
                    key={poll._id}
                    className="poll-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="poll-info">
                      <h3>{poll.title}</h3>
                      <p>{poll.description}</p>
                      
                      <div className="poll-meta">
                        <span className="badge">
                          {poll.teams.length} Teams
                        </span>
                        <span className="badge">
                          {poll.criteria.length} Criteria
                        </span>
                        <span className={`badge ${poll.isActive ? 'active' : 'inactive'}`}>
                          {poll.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>

                      <div className="poll-dates">
                        <span>Start: {new Date(poll.startTime).toLocaleString()}</span>
                        <span>End: {new Date(poll.endTime).toLocaleString()}</span>
                      </div>
                    </div>

                    <motion.button
                      className="btn-delete"
                      onClick={() => handleDeletePoll(poll._id)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <FaTrash />
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default AdminPanel;