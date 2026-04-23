// import jwt from 'jsonwebtoken';
// import User from '../models/User.js';

// export const protect = async (req, res, next) => {
//   let token;

//   if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
//     try {
//       token = req.headers.authorization.split(' ')[1];
//       const decoded = jwt.verify(token, process.env.JWT_SECRET);
//       req.user = await User.findById(decoded.id).select('-password');
      
//       if (!req.user) {
//         return res.status(401).json({ message: 'Not authorized, user not found' });
//       }
      
//       next();
//     } catch (error) {
//       console.error(error);
//       return res.status(401).json({ message: 'Not authorized, token failed' });
//     }
//   }

//   if (!token) {
//     return res.status(401).json({ message: 'Not authorized, no token' });
//   }
// };

// export const admin = (req, res, next) => {
//   if (req.user && req.user.isAdmin) {
//     next();
//   } else {
//     res.status(403).json({ message: 'Not authorized as admin' });
//   }
// };


// solving bug system upar wala correct hai niche wala testing ...

import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Vote from '../models/Vote.js';
import { isValidEnrollment } from '../utils/validators.js';

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      // ✅ AUTO-CLEANUP: Agar user allowed list mein nahi hai toh turant delete karo
      if (!isValidEnrollment(req.user.enrollmentNumber)) {
        console.log(`Unauthorized user detected & deleted: ${req.user.enrollmentNumber}`);

        // Uske saare votes bhi delete karo
        await Vote.deleteMany({ userId: req.user._id });

        // User ko bhi delete karo
        await User.findByIdAndDelete(req.user._id);

        return res.status(403).json({ 
          message: 'Your account has been removed. You are not authorized.' 
        });
      }

      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

export const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as admin' });
  }
};