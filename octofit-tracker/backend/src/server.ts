import express from 'express';
import mongoose from 'mongoose';
import { connectDatabase, isDatabaseConnected } from './config/database.js';
import { Activity } from './models/Activity.js';
import { Team } from './models/Team.js';
import { User } from './models/User.js';
import { Workout } from './models/Workout.js';
import { inMemoryStore } from './data/sampleData.js';

const app = express();
const PORT = Number(process.env.PORT || 8000);

app.use(express.json());

const codespaceName = process.env.CODESPACE_NAME;
const baseUrl = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev`
  : `http://localhost:${PORT}`;

const readUsers = async () => {
  if (isDatabaseConnected()) {
    return User.find().lean();
  }

  return [...inMemoryStore.users];
};

const readTeams = async () => {
  if (isDatabaseConnected()) {
    return Team.find().lean();
  }

  return [...inMemoryStore.teams];
};

const readActivities = async () => {
  if (isDatabaseConnected()) {
    return Activity.find().sort({ date: -1 }).lean();
  }

  return [...inMemoryStore.activities];
};

const readWorkouts = async () => {
  if (isDatabaseConnected()) {
    return Workout.find().lean();
  }

  return [...inMemoryStore.workouts];
};

app.get('/api', (_req, res) => {
  res.json({
    message: 'Welcome to OctoFit Tracker API',
    baseUrl,
    resources: ['users', 'teams', 'activities', 'leaderboard', 'workouts'],
  });
});

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'OctoFit Tracker API',
    port: PORT,
    database: isDatabaseConnected() ? 'connected' : 'fallback',
    baseUrl,
  });
});

app.get('/api/users', async (_req, res) => {
  const users = await readUsers();
  res.json(users);
});

app.post('/api/users', async (req, res) => {
  const payload = req.body ?? {};

  const newUser = {
    name: payload.name,
    email: payload.email,
    fitnessLevel: payload.fitnessLevel ?? 'beginner',
    teamId: payload.teamId ?? null,
    points: Number(payload.points ?? 0),
    streak: Number(payload.streak ?? 0),
  };

  if (isDatabaseConnected()) {
    const user = await User.create(newUser);
    return res.status(201).json(user);
  }

  const record = {
    id: `user-${Date.now()}`,
    ...newUser,
  };
  inMemoryStore.users.push(record);
  return res.status(201).json(record);
});

app.get('/api/teams', async (_req, res) => {
  const teams = await readTeams();
  res.json(teams);
});

app.post('/api/teams', async (req, res) => {
  const payload = req.body ?? {};

  const newTeam = {
    name: payload.name,
    captain: payload.captain,
    members: Array.isArray(payload.members) ? payload.members : [],
    points: Number(payload.points ?? 0),
  };

  if (isDatabaseConnected()) {
    const team = await Team.create(newTeam);
    return res.status(201).json(team);
  }

  const record = {
    id: `team-${Date.now()}`,
    ...newTeam,
  };
  inMemoryStore.teams.push(record);
  return res.status(201).json(record);
});

app.get('/api/activities', async (_req, res) => {
  const activities = await readActivities();
  res.json(activities);
});

app.post('/api/activities', async (req, res) => {
  const payload = req.body ?? {};

  const newActivity = {
    userId: payload.userId,
    type: payload.type,
    durationMinutes: Number(payload.durationMinutes ?? 0),
    distanceKm: payload.distanceKm ? Number(payload.distanceKm) : undefined,
    caloriesBurned: Number(payload.caloriesBurned ?? 0),
    date: payload.date ? new Date(payload.date) : new Date(),
  };

  if (isDatabaseConnected()) {
    const activity = await Activity.create(newActivity);
    return res.status(201).json(activity);
  }

  const record = {
    id: `activity-${Date.now()}`,
    ...newActivity,
  };
  inMemoryStore.activities.push(record);
  return res.status(201).json(record);
});

app.get('/api/leaderboard', async (_req, res) => {
  const users = await readUsers();
  const leaderBoard = [...(users as any[])]
    .sort((a, b) => Number(b.points) - Number(a.points))
    .map((user: any, index: number) => ({
      rank: index + 1,
      id: user.id ?? String(user._id ?? `user-${index + 1}`),
      name: user.name,
      points: Number(user.points ?? 0),
      teamId: user.teamId ?? null,
      streak: Number(user.streak ?? 0),
    }));

  res.json(leaderBoard);
});

app.get('/api/workouts', async (_req, res) => {
  const workouts = await readWorkouts();
  res.json(workouts);
});

app.post('/api/workouts', async (req, res) => {
  const payload = req.body ?? {};

  const newWorkout = {
    title: payload.title,
    focus: payload.focus,
    difficulty: payload.difficulty ?? 'Beginner',
    durationMinutes: Number(payload.durationMinutes ?? 0),
    suggestedFor: payload.suggestedFor ?? null,
  };

  if (isDatabaseConnected()) {
    const workout = await Workout.create(newWorkout);
    return res.status(201).json(workout);
  }

  const record = {
    id: `workout-${Date.now()}`,
    ...newWorkout,
  };
  inMemoryStore.workouts.push(record);
  return res.status(201).json(record);
});

app.use((error: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled API error:', error);
  res.status(500).json({
    message: 'Internal server error',
    error: error.message,
  });
});

await connectDatabase();

app.listen(PORT, () => {
  console.log(`OctoFit Tracker API listening on ${baseUrl}`);
});
