import mongoose, { Schema, type Document } from 'mongoose';

export interface IActivity extends Document {
  userId: string;
  type: 'Running' | 'Walking' | 'Strength' | 'Cycling';
  durationMinutes: number;
  distanceKm?: number;
  caloriesBurned: number;
  date: Date;
}

const activitySchema = new Schema<IActivity>(
  {
    userId: { type: String, required: true },
    type: {
      type: String,
      enum: ['Running', 'Walking', 'Strength', 'Cycling'],
      required: true,
    },
    durationMinutes: { type: Number, required: true, min: 1 },
    distanceKm: { type: Number, min: 0 },
    caloriesBurned: { type: Number, required: true, min: 0 },
    date: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  },
);

export const Activity = mongoose.model<IActivity>('Activity', activitySchema);
