import express from 'express';
import Poll from '../models/Poll.js';
import Vote from '../models/Vote.js';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';
import { validateVoteData } from '../utils/validators.js';

const router = express.Router();

// Get all active polls
router.get('/', protect, async (req, res) => {
  try {
    const polls = await Poll.find({ isActive: true }).sort({ createdAt: -1 });
    
    const pollsWithVoteStatus = await Promise.all(polls.map(async (poll) => {
      const hasVoted = await Vote.exists({ 
        pollId: poll._id, 
        userId: req.user._id 
      });
      
      return {
        ...poll.toObject(),
        hasVoted: !!hasVoted
      };
    }));

    res.json(pollsWithVoteStatus);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching polls' });
  }
});

// Get single poll
router.get('/:id', protect, async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id);
    
    if (!poll) {
      return res.status(404).json({ message: 'Poll not found' });
    }

    const hasVoted = await Vote.exists({ 
      pollId: poll._id, 
      userId: req.user._id 
    });

    res.json({
      ...poll.toObject(),
      hasVoted: !!hasVoted
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching poll' });
  }
});

// Submit vote
router.post('/:id/vote', protect, async (req, res) => {
  try {
    const { teamId, ratings, overallRating } = req.body;
    const pollId = req.params.id;

    const poll = await Poll.findById(pollId);

    if (!poll) {
      return res.status(404).json({ message: 'Poll not found' });
    }

    // Check if poll is active
    const now = new Date();
    if (now < poll.startTime || now > poll.endTime) {
      return res.status(400).json({ message: 'Poll is not active' });
    }

    // Check if user already voted
    const existingVote = await Vote.findOne({ 
      pollId, 
      userId: req.user._id 
    });

    if (existingVote) {
      return res.status(400).json({ message: 'You have already voted in this poll' });
    }

    // Validate team exists
    const teamExists = poll.teams.some(team => team._id.toString() === teamId);
    if (!teamExists) {
      return res.status(400).json({ message: 'Invalid team' });
    }

    // Validate ratings
    if (!validateVoteData(ratings, poll.criteria)) {
      return res.status(400).json({ message: 'Invalid rating data' });
    }

    // Create vote
    const vote = await Vote.create({
      pollId,
      userId: req.user._id,
      teamId,
      ratings,
      overallRating
    });

    // Update user's voted polls
    await User.findByIdAndUpdate(req.user._id, {
      $push: { votedPolls: { pollId } }
    });

    res.status(201).json({
      message: 'Vote submitted successfully',
      vote
    });
  } catch (error) {
    console.error(error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'You have already voted in this poll' });
    }
    res.status(500).json({ message: 'Error submitting vote' });
  }
});

// Get leaderboard for a poll
router.get('/:id/leaderboard', protect, async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id);

    if (!poll) {
      return res.status(404).json({ message: 'Poll not found' });
    }

    const votes = await Vote.find({ pollId: poll._id });

    const leaderboard = poll.teams.map(team => {
      const teamVotes = votes.filter(v => v.teamId.toString() === team._id.toString());
      
      const totalVotes = teamVotes.length;
      const totalRating = teamVotes.reduce((sum, vote) => sum + vote.overallRating, 0);
      const averageRating = totalVotes > 0 ? totalRating / totalVotes : 0;

      const criteriaScores = poll.criteria.map(criterion => {
        const criterionRatings = teamVotes.flatMap(vote => 
          vote.ratings.filter(r => r.criteriaName === criterion.name)
        );
        const criterionTotal = criterionRatings.reduce((sum, r) => sum + r.rating, 0);
        const criterionAvg = criterionRatings.length > 0 ? criterionTotal / criterionRatings.length : 0;
        
        return {
          name: criterion.name,
          average: criterionAvg
        };
      });

      return {
        teamId: team._id,
        teamName: team.name,
        teamDescription: team.description,
        totalVotes,
        averageRating: Math.round(averageRating * 100) / 100,
        criteriaScores
      };
    });

    leaderboard.sort((a, b) => b.averageRating - a.averageRating);

    res.json({
      pollTitle: poll.title,
      totalVotes: votes.length,
      leaderboard
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching leaderboard' });
  }
});

export default router;