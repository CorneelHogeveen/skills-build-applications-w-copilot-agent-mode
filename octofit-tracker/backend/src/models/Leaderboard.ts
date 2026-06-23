import mongoose, { Schema, type InferSchemaType } from 'mongoose';

const leaderboardEntrySchema = new Schema(
  {
    rank: { type: Number, required: true, min: 1 },
    displayName: { type: String, required: true, trim: true },
    score: { type: Number, required: true, min: 0 },
    entityType: { type: String, required: true, enum: ['user', 'team'] },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    team: { type: Schema.Types.ObjectId, ref: 'Team' },
  },
  { _id: false }
);

const leaderboardSchema = new Schema(
  {
    scope: { type: String, required: true, enum: ['users', 'teams'] },
    period: { type: String, required: true, enum: ['weekly', 'monthly', 'all-time'] },
    entries: { type: [leaderboardEntrySchema], default: [] },
    generatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export type LeaderboardDocument = InferSchemaType<typeof leaderboardSchema>;
export const LeaderboardModel = mongoose.model('Leaderboard', leaderboardSchema);
