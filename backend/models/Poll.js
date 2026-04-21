import mongoose from 'mongoose';

const pollSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  teams: [{
    name: {
      type: String,
      required: true
    },
    description: String
  }],
  criteria: [{
    name: {
      type: String,
      required: true
    },
    weight: {
      type: Number,
      default: 1
    }
  }],
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

const Poll = mongoose.model('Poll', pollSchema);

export default Poll;