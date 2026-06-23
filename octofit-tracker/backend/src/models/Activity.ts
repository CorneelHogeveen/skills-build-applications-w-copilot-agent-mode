import mongoose, { Schema, type InferSchemaType } from 'mongoose';

const activitySchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    team: { type: Schema.Types.ObjectId, ref: 'Team' },
    type: {
      type: String,
      required: true,
      enum: ['run', 'cycle', 'strength', 'yoga', 'swim', 'hike'],
    },
    durationMinutes: { type: Number, required: true, min: 1 },
    caloriesBurned: { type: Number, required: true, min: 1 },
    distanceKm: { type: Number, min: 0 },
    performedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export type ActivityDocument = InferSchemaType<typeof activitySchema>;
export const ActivityModel = mongoose.model('Activity', activitySchema);
