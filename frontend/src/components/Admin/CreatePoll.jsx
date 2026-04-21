import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaTrash } from 'react-icons/fa';
import axios from 'axios';
import { Toast } from '../Common/Toast';

const CreatePoll = ({ onPollCreated }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    teams: [{ name: '', description: '' }],
    criteria: [{ name: 'UI/UX', weight: 1 }]
  });

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => setToast({ message, type });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleTeamChange = (index, field, value) => {
    const newTeams = [...formData.teams];
    newTeams[index][field] = value;
    setFormData({ ...formData, teams: newTeams });
  };

  const handleCriteriaChange = (index, field, value) => {
    const newCriteria = [...formData.criteria];
    newCriteria[index][field] = value;
    setFormData({ ...formData, criteria: newCriteria });
  };

  const addTeam = () => {
    setFormData({
      ...formData,
      teams: [...formData.teams, { name: '', description: '' }]
    });
  };

  const removeTeam = (index) => {
    const newTeams = formData.teams.filter((_, i) => i !== index);
    setFormData({ ...formData, teams: newTeams });
  };

  const addCriteria = () => {
    setFormData({
      ...formData,
      criteria: [...formData.criteria, { name: '', weight: 1 }]
    });
  };

  const removeCriteria = (index) => {
    const newCriteria = formData.criteria.filter((_, i) => i !== index);
    setFormData({ ...formData, criteria: newCriteria });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post('/api/admin/polls', formData);
      showToast('Poll created successfully!', 'success');
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        startTime: '',
        endTime: '',
        teams: [{ name: '', description: '' }],
        criteria: [{ name: 'UI/UX', weight: 1 }]
      });

      if (onPollCreated) onPollCreated();
    } catch (error) {
      showToast(error.response?.data?.message || 'Error creating poll', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </AnimatePresence>

      <motion.div 
        className="create-poll-form"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
      <h2>Create New Poll</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-section">
          <h3>Basic Information</h3>
          
          <div className="input-group">
            <label>Poll Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Best UI Design"
              required
            />
          </div>

          <div className="input-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Brief description of the poll"
              rows="3"
            />
          </div>

          <div className="input-row">
            <div className="input-group">
              <label>Start Time *</label>
              <input
                type="datetime-local"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <label>End Time *</label>
              <input
                type="datetime-local"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <div className="section-header">
            <h3>Teams</h3>
            <motion.button
              type="button"
              className="btn-add"
              onClick={addTeam}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaPlus /> Add Team
            </motion.button>
          </div>

          {formData.teams.map((team, index) => (
            <div key={index} className="dynamic-item">
              <div className="input-row">
                <div className="input-group flex-grow">
                  <label>Team Name *</label>
                  <input
                    type="text"
                    value={team.name}
                    onChange={(e) => handleTeamChange(index, 'name', e.target.value)}
                    placeholder="Team name"
                    required
                  />
                </div>

                {formData.teams.length > 1 && (
                  <motion.button
                    type="button"
                    className="btn-remove"
                    onClick={() => removeTeam(index)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <FaTrash />
                  </motion.button>
                )}
              </div>

              <div className="input-group">
                <label>Description</label>
                <input
                  type="text"
                  value={team.description}
                  onChange={(e) => handleTeamChange(index, 'description', e.target.value)}
                  placeholder="Team description"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="form-section">
          <div className="section-header">
            <h3>Rating Criteria</h3>
            <motion.button
              type="button"
              className="btn-add"
              onClick={addCriteria}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaPlus /> Add Criteria
            </motion.button>
          </div>

          {formData.criteria.map((criterion, index) => (
            <div key={index} className="dynamic-item">
              <div className="input-row">
                <div className="input-group flex-grow">
                  <label>Criteria Name *</label>
                  <input
                    type="text"
                    value={criterion.name}
                    onChange={(e) => handleCriteriaChange(index, 'name', e.target.value)}
                    placeholder="e.g., Innovation"
                    required
                  />
                </div>

                {formData.criteria.length > 1 && (
                  <motion.button
                    type="button"
                    className="btn-remove"
                    onClick={() => removeCriteria(index)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <FaTrash />
                  </motion.button>
                )}
              </div>
            </div>
          ))}
        </div>

        <motion.button
          type="submit"
          className="btn-primary submit-btn"
          disabled={loading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {loading ? (
            <span className="loading-spinner"></span>
          ) : (
            'Create Poll'
          )}
        </motion.button>
      </form>
    </motion.div>
    </>
  );
};

export default CreatePoll;