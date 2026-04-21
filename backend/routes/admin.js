import express from 'express';
import Poll from '../models/Poll.js';
import Vote from '../models/Vote.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// Create poll (admin only)
router.post('/polls', protect, admin, async (req, res) => {
  try {
    const { title, description, teams, criteria, startTime, endTime } = req.body;

    if (!title || !teams || !criteria || !startTime || !endTime) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    if (teams.length < 2) {
      return res.status(400).json({ message: 'At least 2 teams are required' });
    }

    const poll = await Poll.create({
      title,
      description,
      teams,
      criteria,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      createdBy: req.user._id
    });

    res.status(201).json(poll);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating poll' });
  }
});

// Get all polls (admin only)
router.get('/polls', protect, admin, async (req, res) => {
  try {
    const polls = await Poll.find().sort({ createdAt: -1 });
    res.json(polls);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching polls' });
  }
});

// Delete poll (admin only)
router.delete('/polls/:id', protect, admin, async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id);

    if (!poll) {
      return res.status(404).json({ message: 'Poll not found' });
    }

    await Vote.deleteMany({ pollId: poll._id });
    await poll.deleteOne();

    res.json({ message: 'Poll deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting poll' });
  }
});

// Analytics
router.get('/analytics', protect, admin, async (req, res) => {
  try {
    const totalPolls = await Poll.countDocuments();
    const totalVotes = await Vote.countDocuments();
    const activePolls = await Poll.countDocuments({ 
      isActive: true,
      endTime: { $gt: new Date() }
    });

    res.json({
      totalPolls,
      totalVotes,
      activePolls
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching analytics' });
  }
});

export default router;