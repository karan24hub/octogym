import mongoose, { Schema, type Document } from 'mongoose';

export interface ITeam extends Document {
  name: string;
  captain: string;
  members: string[];
  points: number;
}

const teamSchema = new Schema<ITeam>(
  {
    name: { type: String, required: true, trim: true },
    captain: { type: String, required: true },
    members: [{ type: String, default: [] }],
    points: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  },
);

export const Team = mongoose.model<ITeam>('Team', teamSchema);
