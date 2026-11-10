import mongoose from 'mongoose';

export const connectToDatabase = async (): Promise<void> => {
  const databaseUrl = process.env.MONGODB_URI;

  if (!databaseUrl) {
    throw new Error('MONGODB_URI is not set in the backend .env file');
  }

  await mongoose.connect(databaseUrl);
  console.log('Connected to MongoDB');
};

