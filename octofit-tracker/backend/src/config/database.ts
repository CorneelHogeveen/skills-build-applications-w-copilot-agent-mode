import mongoose from 'mongoose';

const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/octofit_db';

export async function connectDatabase(): Promise<void> {
  try {
    await mongoose.connect(mongoUri);
    console.log(`Connected to MongoDB: ${mongoUri}`);
  } catch (error) {
    console.error('Failed to connect to MongoDB', error);
    throw error;
  }
}

export function getMongoUri(): string {
  return mongoUri;
}

export default mongoose;
