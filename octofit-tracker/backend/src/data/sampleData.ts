export type UserRecord = {
  id: string;
  name: string;
  email: string;
  fitnessLevel: 'beginner' | 'intermediate' | 'advanced';
  teamId?: string;
  points: number;
  streak: number;
};

export type TeamRecord = {
  id: string;
  name: string;
  captain: string;
  members: string[];
  points: number;
};

export type ActivityRecord = {
  id: string;
  userId: string;
  type: 'Running' | 'Walking' | 'Strength' | 'Cycling';
  durationMinutes: number;
  distanceKm?: number;
  caloriesBurned: number;
  date: string | Date;
};

export type WorkoutRecord = {
  id: string;
  title: string;
  focus: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  durationMinutes: number;
  suggestedFor?: string;
};

export const sampleUsers: UserRecord[] = [
  {
    id: 'user-1',
    name: 'Ava Thompson',
    email: 'ava@example.com',
    fitnessLevel: 'intermediate',
    teamId: 'team-1',
    points: 820,
    streak: 5,
  },
  {
    id: 'user-2',
    name: 'Leo Ramirez',
    email: 'leo@example.com',
    fitnessLevel: 'advanced',
    teamId: 'team-1',
    points: 950,
    streak: 7,
  },
  {
    id: 'user-3',
    name: 'Mia Chen',
    email: 'mia@example.com',
    fitnessLevel: 'beginner',
    teamId: 'team-2',
    points: 640,
    streak: 3,
  },
];

export const sampleTeams: TeamRecord[] = [
  {
    id: 'team-1',
    name: 'Thunder',
    captain: 'user-1',
    members: ['user-1', 'user-2'],
    points: 1770,
  },
  {
    id: 'team-2',
    name: 'Lightning',
    captain: 'user-3',
    members: ['user-3'],
    points: 640,
  },
];

export const sampleActivities: ActivityRecord[] = [
  {
    id: 'activity-1',
    userId: 'user-1',
    type: 'Running',
    durationMinutes: 35,
    distanceKm: 5.2,
    caloriesBurned: 420,
    date: '2026-09-25',
  },
  {
    id: 'activity-2',
    userId: 'user-2',
    type: 'Strength',
    durationMinutes: 45,
    caloriesBurned: 510,
    date: '2026-09-24',
  },
  {
    id: 'activity-3',
    userId: 'user-3',
    type: 'Walking',
    durationMinutes: 25,
    distanceKm: 3.1,
    caloriesBurned: 210,
    date: '2026-09-23',
  },
];

export const sampleWorkouts: WorkoutRecord[] = [
  {
    id: 'workout-1',
    title: 'Trail Burn Interval',
    focus: 'Cardio',
    difficulty: 'Intermediate',
    durationMinutes: 30,
    suggestedFor: 'user-1',
  },
  {
    id: 'workout-2',
    title: 'Core & Power Circuit',
    focus: 'Strength',
    difficulty: 'Advanced',
    durationMinutes: 40,
    suggestedFor: 'user-2',
  },
  {
    id: 'workout-3',
    title: 'Steady Pace Walk',
    focus: 'Recovery',
    difficulty: 'Beginner',
    durationMinutes: 20,
    suggestedFor: 'user-3',
  },
];

export const inMemoryStore = {
  users: [...sampleUsers],
  teams: [...sampleTeams],
  activities: [...sampleActivities],
  workouts: [...sampleWorkouts],
};
