import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { isValidEnrollment } from '../utils/validators.js';

const router = express.Router();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });
};

// Register
router.post('/register', async (req, res) => {
  try {
    const { enrollmentNumber, password } = req.body;

    if (!enrollmentNumber || !password) {
      return res.status(400).json({ message: 'Please provide all fields' });
    }

    const normalizedEnrollment = enrollmentNumber.toLowerCase().trim();

    if (!isValidEnrollment(normalizedEnrollment)) {
      return res.status(403).json({ 
        message: 'This enrollment number is not authorized to register' 
      });
    }

    const userExists = await User.findOne({ enrollmentNumber: normalizedEnrollment });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const user = await User.create({
      enrollmentNumber: normalizedEnrollment,
      password
    });

    res.status(201).json({
      _id: user._id,
      enrollmentNumber: user.enrollmentNumber,
      isAdmin: user.isAdmin,
      token: generateToken(user._id)
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { enrollmentNumber, password } = req.body;

    if (!enrollmentNumber || !password) {
      return res.status(400).json({ message: 'Please provide all fields' });
    }

    const normalizedEnrollment = enrollmentNumber.toLowerCase().trim();

    const user = await User.findOne({ enrollmentNumber: normalizedEnrollment });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.json({
      _id: user._id,
      enrollmentNumber: user.enrollmentNumber,
      isAdmin: user.isAdmin,
      token: generateToken(user._id)
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

export default router;