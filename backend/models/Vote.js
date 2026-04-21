import mongoose from 'mongoose';

const voteSchema = new mongoose.Schema({
  pollId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Poll',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  teamId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  ratings: [{
    criteriaName: {
      type: String,
      required: true
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    }
  }],
  overallRating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  }
}, {
  timestamps: true
});

// Ensure one vote per user per poll
voteSchema.index({ pollId: 1, userId: 1 }, { unique: true });

const Vote = mongoose.model('Vote', voteSchema);

export default Vote;