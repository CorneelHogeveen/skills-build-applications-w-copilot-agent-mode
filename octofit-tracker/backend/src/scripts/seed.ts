import mongoose from 'mongoose';
import { ActivityModel } from '../models/Activity';
import { LeaderboardModel } from '../models/Leaderboard';
import { TeamModel } from '../models/Team';
import { UserModel } from '../models/User';
import { WorkoutModel } from '../models/Workout';

const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/octofit_db';

async function seedDatabase() {
  console.log('Seed the octofit_db database with test data');
  await mongoose.connect(mongoUri);

  try {
    await Promise.all([
      ActivityModel.deleteMany({}),
      LeaderboardModel.deleteMany({}),
      TeamModel.deleteMany({}),
      UserModel.deleteMany({}),
      WorkoutModel.deleteMany({}),
    ]);

    const teams = await TeamModel.insertMany([
      {
        name: 'Sunrise Sprinters',
        description: 'Early morning runners focused on interval training.',
      },
      {
        name: 'Iron Pulse Collective',
        description: 'Strength-first squad balancing lifting and cardio.',
      },
      {
        name: 'Mobility Mavericks',
        description: 'Recovery-minded team that values mobility and consistency.',
      },
    ]);

    const users = await UserModel.insertMany([
      {
        name: 'Emma de Vries',
        email: 'emma.vries@octofit.test',
        age: 28,
        fitnessLevel: 'advanced',
        points: 1470,
        team: teams[0]._id,
      },
      {
        name: 'Noah van Dijk',
        email: 'noah.dijk@octofit.test',
        age: 33,
        fitnessLevel: 'intermediate',
        points: 1210,
        team: teams[0]._id,
      },
      {
        name: 'Lotte Jansen',
        email: 'lotte.jansen@octofit.test',
        age: 25,
        fitnessLevel: 'advanced',
        points: 1530,
        team: teams[1]._id,
      },
      {
        name: 'Milan Bakker',
        email: 'milan.bakker@octofit.test',
        age: 30,
        fitnessLevel: 'intermediate',
        points: 1185,
        team: teams[1]._id,
      },
      {
        name: 'Sara Visser',
        email: 'sara.visser@octofit.test',
        age: 27,
        fitnessLevel: 'beginner',
        points: 920,
        team: teams[2]._id,
      },
      {
        name: 'Daan Smit',
        email: 'daan.smit@octofit.test',
        age: 35,
        fitnessLevel: 'intermediate',
        points: 1040,
        team: teams[2]._id,
      },
    ]);

    teams[0].members = [users[0]._id, users[1]._id];
    teams[0].totalPoints = users[0].points + users[1].points;
    teams[1].members = [users[2]._id, users[3]._id];
    teams[1].totalPoints = users[2].points + users[3].points;
    teams[2].members = [users[4]._id, users[5]._id];
    teams[2].totalPoints = users[4].points + users[5].points;

    await Promise.all(teams.map((team) => team.save()));

    await ActivityModel.insertMany([
      {
        user: users[0]._id,
        team: teams[0]._id,
        type: 'run',
        durationMinutes: 45,
        caloriesBurned: 520,
        distanceKm: 9.1,
        performedAt: new Date('2026-06-15T06:45:00.000Z'),
      },
      {
        user: users[1]._id,
        team: teams[0]._id,
        type: 'cycle',
        durationMinutes: 60,
        caloriesBurned: 610,
        distanceKm: 24.8,
        performedAt: new Date('2026-06-15T17:20:00.000Z'),
      },
      {
        user: users[2]._id,
        team: teams[1]._id,
        type: 'strength',
        durationMinutes: 50,
        caloriesBurned: 430,
        performedAt: new Date('2026-06-16T18:05:00.000Z'),
      },
      {
        user: users[3]._id,
        team: teams[1]._id,
        type: 'hike',
        durationMinutes: 75,
        caloriesBurned: 560,
        distanceKm: 8.7,
        performedAt: new Date('2026-06-17T09:40:00.000Z'),
      },
      {
        user: users[4]._id,
        team: teams[2]._id,
        type: 'yoga',
        durationMinutes: 35,
        caloriesBurned: 190,
        performedAt: new Date('2026-06-17T07:10:00.000Z'),
      },
      {
        user: users[5]._id,
        team: teams[2]._id,
        type: 'swim',
        durationMinutes: 40,
        caloriesBurned: 370,
        distanceKm: 1.2,
        performedAt: new Date('2026-06-18T19:00:00.000Z'),
      },
    ]);

    await WorkoutModel.insertMany([
      {
        title: 'Tempo Run Builder',
        description: 'Progressive run session to improve lactate threshold.',
        difficulty: 'advanced',
        targetGoal: 'endurance',
        durationMinutes: 55,
        exercises: [
          { name: 'Warm-up jog', durationSeconds: 600 },
          { name: 'Tempo block', durationSeconds: 1800 },
          { name: 'Cooldown jog', durationSeconds: 900 },
        ],
        recommendedFor: [users[0]._id, users[1]._id],
      },
      {
        title: 'Foundational Strength Circuit',
        description: 'Full-body dumbbell circuit for muscle and conditioning.',
        difficulty: 'intermediate',
        targetGoal: 'strength',
        durationMinutes: 45,
        exercises: [
          { name: 'Goblet squat', sets: 4, reps: 10 },
          { name: 'Push-up', sets: 4, reps: 12 },
          { name: 'Dumbbell row', sets: 4, reps: 10 },
          { name: 'Plank hold', sets: 3, durationSeconds: 60 },
        ],
        recommendedFor: [users[2]._id, users[3]._id],
      },
      {
        title: 'Recovery Flow',
        description: 'Low-impact mobility routine for active recovery days.',
        difficulty: 'beginner',
        targetGoal: 'recovery',
        durationMinutes: 30,
        exercises: [
          { name: 'Cat-cow stretch', durationSeconds: 120 },
          { name: 'Hip opener sequence', durationSeconds: 300 },
          { name: 'Breathing reset', durationSeconds: 180 },
        ],
        recommendedFor: [users[4]._id, users[5]._id],
      },
    ]);

    await LeaderboardModel.insertMany([
      {
        scope: 'users',
        period: 'weekly',
        entries: [
          {
            rank: 1,
            displayName: users[2].name,
            score: users[2].points,
            entityType: 'user',
            user: users[2]._id,
          },
          {
            rank: 2,
            displayName: users[0].name,
            score: users[0].points,
            entityType: 'user',
            user: users[0]._id,
          },
          {
            rank: 3,
            displayName: users[1].name,
            score: users[1].points,
            entityType: 'user',
            user: users[1]._id,
          },
        ],
      },
      {
        scope: 'teams',
        period: 'weekly',
        entries: [
          {
            rank: 1,
            displayName: teams[1].name,
            score: teams[1].totalPoints,
            entityType: 'team',
            team: teams[1]._id,
          },
          {
            rank: 2,
            displayName: teams[0].name,
            score: teams[0].totalPoints,
            entityType: 'team',
            team: teams[0]._id,
          },
          {
            rank: 3,
            displayName: teams[2].name,
            score: teams[2].totalPoints,
            entityType: 'team',
            team: teams[2]._id,
          },
        ],
      },
    ]);

    console.log('Seeding completed successfully.');
  } finally {
    await mongoose.connection.close();
  }
}

seedDatabase().catch((error) => {
  console.error('Seeding failed', error);
  process.exit(1);
});
