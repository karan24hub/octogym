import mongoose, { Schema, type Document } from 'mongoose';

export interface IWorkout extends Document {
  title: string;
  focus: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  durationMinutes: number;
  suggestedFor?: string;
}

const workoutSchema = new Schema<IWorkout>(
  {
    title: { type: String, required: true, trim: true },
    focus: { type: String, required: true, trim: true },
    difficulty: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Beginner',
    },
    durationMinutes: { type: Number, required: true, min: 5 },
    suggestedFor: { type: String, default: null },
  },
  {
    timestamps: true,
  },
);

export const Workout = mongoose.model<IWorkout>('Workout', workoutSchema);
