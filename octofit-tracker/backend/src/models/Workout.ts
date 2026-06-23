import mongoose, { Schema, type InferSchemaType } from 'mongoose';

const exerciseSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    sets: { type: Number, min: 1 },
    reps: { type: Number, min: 1 },
    durationSeconds: { type: Number, min: 1 },
  },
  { _id: false }
);

const workoutSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    difficulty: {
      type: String,
      required: true,
      enum: ['beginner', 'intermediate', 'advanced'],
    },
    targetGoal: {
      type: String,
      required: true,
      enum: ['weight-loss', 'endurance', 'strength', 'recovery'],
    },
    durationMinutes: { type: Number, required: true, min: 5 },
    exercises: { type: [exerciseSchema], default: [] },
    recommendedFor: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

export type WorkoutDocument = InferSchemaType<typeof workoutSchema>;
export const WorkoutModel = mongoose.model('Workout', workoutSchema);
