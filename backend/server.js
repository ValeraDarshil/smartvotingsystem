// /**
//  * ╔══════════════════════════════════════════╗
//  * ║       SMART VOTING SYSTEM - Backend      ║
//  * ║  Developer : Darshil                     ║
//  * ║  Enrollment: 25BT04221                   ║
//  * ╚══════════════════════════════════════════╝
//  */
// import express from 'express';
// import cors from 'cors';
// import dotenv from 'dotenv';
// import connectDB from './config/db.js';
// import authRoutes from './routes/auth.js';
// import pollRoutes from './routes/polls.js';
// import adminRoutes from './routes/admin.js';

// dotenv.config();

// const app = express();

// // Connect to MongoDB
// connectDB();

// // CORS - allow Vercel frontend + localhost dev
// const allowedOrigins = [
//   'http://localhost:3000',
//   'http://localhost:5173',
//   process.env.FRONTEND_URL, // Set this in Render env vars after Vercel deploy
// ].filter(Boolean);

// app.use(cors({
//   origin: function (origin, callback) {
//     // Allow requests with no origin (mobile apps, curl, Postman)
//     if (!origin) return callback(null, true);
//     if (
//       allowedOrigins.includes(origin) ||
//       origin.endsWith('.vercel.app')
//     ) {
//       return callback(null, true);
//     }
//     return callback(new Error('Not allowed by CORS'));
//   },
//   credentials: true
// }));

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/polls', pollRoutes);
// app.use('/api/admin', adminRoutes);

// // Health check
// app.get('/api/health', (req, res) => {
//   res.json({ status: 'OK', message: 'Server is running' });
// });

// // Error handling middleware
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({ message: 'Something went wrong!' });
// });

// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//   console.log(`🚀 Server running on port ${PORT}`);
// });


// Corrected File is Below ...



/**
 * ╔══════════════════════════════════════════╗
 * ║       SMART VOTING SYSTEM - Backend      ║
 * ║  Developer : Darshil                     ║
 * ║  Enrollment: 25BT04221                   ║
 * ╚══════════════════════════════════════════╝
 */
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import pollRoutes from './routes/polls.js';
import adminRoutes from './routes/admin.js';

dotenv.config();

const app = express();

connectDB();

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'https://smartvotingsystem.vercel.app',
  process.env.FRONTEND_URL,
].filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {
    // Block requests with NO origin (Postman, curl) — except OPTIONS preflight
    if (!origin) {
      return callback(new Error('Direct API access not allowed'));
    }
    if (allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// Apply CORS to all routes
app.use(cors(corsOptions));

// Handle OPTIONS preflight properly — this fixes the "preflight 500" error
app.options('*', cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/polls', pollRoutes);
app.use('/api/admin', adminRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});