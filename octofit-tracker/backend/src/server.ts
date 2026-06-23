import express, { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import { ActivityModel } from './models/Activity';
import { LeaderboardModel } from './models/Leaderboard';
import { TeamModel } from './models/Team';
import { UserModel } from './models/User';
import { WorkoutModel } from './models/Workout';

const app = express();
const port = Number(process.env.PORT) || 8000;
const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/octofit_db';

// Middleware
app.use(express.json());

// CORS headers for Codespaces compatibility
app.use((_req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

// API Base URL helper - Codespaces-aware
function getApiBaseUrl(): string {
  if (process.env.CODESPACE_NAME) {
    return `https://${process.env.CODESPACE_NAME}-8000.app.github.dev`;
  }
  return `http://localhost:${port}`;
}

app.get('/api/config', (_req: Request, res: Response) => {
  res.json({
    apiBaseUrl: getApiBaseUrl(),
    port,
  });
});

function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>
) {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
}

// ============================================
// Users Routes
// ============================================
app.get(
  '/api/users/',
  asyncHandler(async (_req: Request, res: Response) => {
    const users = await UserModel.find().populate('team', 'name').sort({ points: -1, name: 1 });
    res.json({ message: 'Get all users', count: users.length, data: users });
  })
);

app.post(
  '/api/users/',
  asyncHandler(async (req: Request, res: Response) => {
    const user = await UserModel.create(req.body);
    res.status(201).json({ message: 'Create new user', data: user });
  })
);

app.get(
  '/api/users/:id',
  asyncHandler(async (req: Request, res: Response) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
      res.status(400).json({ error: 'Invalid user ID format' });
      return;
    }
    const user = await UserModel.findById(req.params.id).populate('team', 'name totalPoints');
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.json({ message: 'Get user by ID', data: user });
  })
);

app.put(
  '/api/users/:id',
  asyncHandler(async (req: Request, res: Response) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
      res.status(400).json({ error: 'Invalid user ID format' });
      return;
    }
    const user = await UserModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.json({ message: 'Update user', data: user });
  })
);

app.delete(
  '/api/users/:id',
  asyncHandler(async (req: Request, res: Response) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
      res.status(400).json({ error: 'Invalid user ID format' });
      return;
    }
    const deletedUser = await UserModel.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.json({ message: 'Delete user', data: deletedUser });
  })
);

// ============================================
// Teams Routes
// ============================================
app.get(
  '/api/teams/',
  asyncHandler(async (_req: Request, res: Response) => {
    const teams = await TeamModel.find()
      .populate('members', 'name email points')
      .sort({ totalPoints: -1, name: 1 });
    res.json({ message: 'Get all teams', count: teams.length, data: teams });
  })
);

app.post(
  '/api/teams/',
  asyncHandler(async (req: Request, res: Response) => {
    const team = await TeamModel.create(req.body);
    res.status(201).json({ message: 'Create new team', data: team });
  })
);

app.get(
  '/api/teams/:id',
  asyncHandler(async (req: Request, res: Response) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
      res.status(400).json({ error: 'Invalid team ID format' });
      return;
    }
    const team = await TeamModel.findById(req.params.id).populate('members', 'name email points');
    if (!team) {
      res.status(404).json({ error: 'Team not found' });
      return;
    }
    res.json({ message: 'Get team by ID', data: team });
  })
);

app.put(
  '/api/teams/:id',
  asyncHandler(async (req: Request, res: Response) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
      res.status(400).json({ error: 'Invalid team ID format' });
      return;
    }
    const team = await TeamModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!team) {
      res.status(404).json({ error: 'Team not found' });
      return;
    }
    res.json({ message: 'Update team', data: team });
  })
);

app.delete(
  '/api/teams/:id',
  asyncHandler(async (req: Request, res: Response) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
      res.status(400).json({ error: 'Invalid team ID format' });
      return;
    }
    const deletedTeam = await TeamModel.findByIdAndDelete(req.params.id);
    if (!deletedTeam) {
      res.status(404).json({ error: 'Team not found' });
      return;
    }
    res.json({ message: 'Delete team', data: deletedTeam });
  })
);

// ============================================
// Activities Routes
// ============================================
app.get(
  '/api/activities/',
  asyncHandler(async (_req: Request, res: Response) => {
    const activities = await ActivityModel.find()
      .populate('user', 'name email points')
      .populate('team', 'name')
      .sort({ performedAt: -1 });
    res.json({ message: 'Get all activities', count: activities.length, data: activities });
  })
);

app.post(
  '/api/activities/',
  asyncHandler(async (req: Request, res: Response) => {
    const activity = await ActivityModel.create(req.body);
    res.status(201).json({ message: 'Log new activity', data: activity });
  })
);

app.get(
  '/api/activities/:id',
  asyncHandler(async (req: Request, res: Response) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
      res.status(400).json({ error: 'Invalid activity ID format' });
      return;
    }
    const activity = await ActivityModel.findById(req.params.id)
      .populate('user', 'name email')
      .populate('team', 'name');
    if (!activity) {
      res.status(404).json({ error: 'Activity not found' });
      return;
    }
    res.json({ message: 'Get activity by ID', data: activity });
  })
);

app.put(
  '/api/activities/:id',
  asyncHandler(async (req: Request, res: Response) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
      res.status(400).json({ error: 'Invalid activity ID format' });
      return;
    }
    const activity = await ActivityModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!activity) {
      res.status(404).json({ error: 'Activity not found' });
      return;
    }
    res.json({ message: 'Update activity', data: activity });
  })
);

app.delete(
  '/api/activities/:id',
  asyncHandler(async (req: Request, res: Response) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
      res.status(400).json({ error: 'Invalid activity ID format' });
      return;
    }
    const deletedActivity = await ActivityModel.findByIdAndDelete(req.params.id);
    if (!deletedActivity) {
      res.status(404).json({ error: 'Activity not found' });
      return;
    }
    res.json({ message: 'Delete activity', data: deletedActivity });
  })
);

// ============================================
// Leaderboard Routes
// ============================================
app.get(
  '/api/leaderboard/',
  asyncHandler(async (_req: Request, res: Response) => {
    const leaderboard = await LeaderboardModel.find().sort({ generatedAt: -1 });
    res.json({ message: 'Get leaderboard', count: leaderboard.length, data: leaderboard });
  })
);

app.get(
  '/api/leaderboard/teams',
  asyncHandler(async (_req: Request, res: Response) => {
    const teamLeaderboard = await LeaderboardModel.findOne({ scope: 'teams' }).sort({ generatedAt: -1 });
    if (!teamLeaderboard) {
      res.status(404).json({ error: 'Team leaderboard not found' });
      return;
    }
    res.json({ message: 'Get team leaderboard', data: teamLeaderboard });
  })
);

app.get(
  '/api/leaderboard/users',
  asyncHandler(async (_req: Request, res: Response) => {
    const userLeaderboard = await LeaderboardModel.findOne({ scope: 'users' }).sort({ generatedAt: -1 });
    if (!userLeaderboard) {
      res.status(404).json({ error: 'User leaderboard not found' });
      return;
    }
    res.json({ message: 'Get user leaderboard', data: userLeaderboard });
  })
);

// ============================================
// Workouts Routes
// ============================================
app.get(
  '/api/workouts/',
  asyncHandler(async (_req: Request, res: Response) => {
    const workouts = await WorkoutModel.find().populate('recommendedFor', 'name email');
    res.json({ message: 'Get all workout suggestions', count: workouts.length, data: workouts });
  })
);

app.get(
  '/api/workouts/:userId',
  asyncHandler(async (req: Request, res: Response) => {
    const rawUserId = Array.isArray(req.params.userId) ? req.params.userId[0] : req.params.userId;
    if (!mongoose.isValidObjectId(rawUserId)) {
      res.status(400).json({ error: 'Invalid user ID format' });
      return;
    }
    const userId = new mongoose.Types.ObjectId(rawUserId);
    const workouts = await WorkoutModel.find({ recommendedFor: userId }).populate(
      'recommendedFor',
      'name email'
    );
    res.json({
      message: 'Get personalized workout suggestions',
      userId: rawUserId,
      count: workouts.length,
      data: workouts,
    });
  })
);

app.post(
  '/api/workouts/',
  asyncHandler(async (req: Request, res: Response) => {
    const workout = await WorkoutModel.create(req.body);
    res.status(201).json({ message: 'Create new workout', data: workout });
  })
);

// ============================================
// Error handling middleware
// ============================================
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof mongoose.Error.ValidationError) {
    res.status(400).json({ error: 'Validation failed', details: err.errors });
    return;
  }
  if (err instanceof Error) {
    res.status(500).json({ error: 'Internal server error', details: err.message });
    return;
  }
  res.status(500).json({ error: 'Internal server error' });
});

app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// ============================================
// Server startup
// ============================================
async function startServer() {
  try {
    await mongoose.connect(mongoUri);
    console.log(`Connected to MongoDB: ${mongoUri}`);

    app.listen(port, () => {
      const apiUrl = getApiBaseUrl();
      console.log(`✓ Backend listening on ${apiUrl}`);
      console.log(`✓ Health check: ${apiUrl}/api/health`);
      console.log(`✓ API config: ${apiUrl}/api/config`);
    });
  } catch (error) {
    console.error('Failed to start server', error);
    process.exit(1);
  }
}

startServer();
