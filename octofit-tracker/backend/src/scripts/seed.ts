import mongoose from 'mongoose';
import { User } from '../models/User.js';
import { Team } from '../models/Team.js';
import { Activity } from '../models/Activity.js';
import { Workout } from '../models/Workout.js';

const connectionString = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/octofit_db';

const seedData = {
  users: [
    {
      name: 'Ava Thompson',
      email: 'ava@example.com',
      fitnessLevel: 'intermediate',
      teamId: 'team-1',
      points: 820,
      streak: 5,
    },
    {
      name: 'Leo Ramirez',
      email: 'leo@example.com',
      fitnessLevel: 'advanced',
      teamId: 'team-1',
      points: 950,
      streak: 7,
    },
    {
      name: 'Mia Chen',
      email: 'mia@example.com',
      fitnessLevel: 'beginner',
      teamId: 'team-2',
      points: 640,
      streak: 3,
    },
  ],
  teams: [
    { name: 'Thunder', captain: 'Ava Thompson', members: ['Ava Thompson', 'Leo Ramirez'], points: 1770 },
    { name: 'Lightning', captain: 'Mia Chen', members: ['Mia Chen'], points: 640 },
  ],
  activities: [
    {
      userId: 'ava@example.com',
      type: 'Running',
      durationMinutes: 35,
      distanceKm: 5.2,
      caloriesBurned: 420,
      date: new Date('2026-09-25'),
    },
    {
      userId: 'leo@example.com',
      type: 'Strength',
      durationMinutes: 45,
      caloriesBurned: 510,
      date: new Date('2026-09-24'),
    },
  ],
  workouts: [
    {
      title: 'Trail Burn Interval',
      focus: 'Cardio',
      difficulty: 'Intermediate',
      durationMinutes: 30,
      suggestedFor: 'ava@example.com',
    },
  ],
};

async function seedDatabase() {
  try {
    await mongoose.connect(connectionString);
    console.log('Connected to octofit_db');

    await User.deleteMany({});
    await Team.deleteMany({});
    await Activity.deleteMany({});
    await Workout.deleteMany({});

    const createdUsers = await User.insertMany(seedData.users);
    const createdTeams = await Team.insertMany(seedData.teams);
    await Activity.insertMany(seedData.activities);
    await Workout.insertMany(seedData.workouts);

    console.log(`Seeded ${createdUsers.length} users, ${createdTeams.length} teams`);
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
