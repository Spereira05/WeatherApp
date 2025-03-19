import mongoose from 'mongoose';

declare global {
  // eslint-disable-next-line no-var
  var mongoose: {
      conn: any;
      promise: Promise<any> | null;
    } | undefined;
  }

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  );
}

export default async function dbConnect() {
  try {
    const db = await mongoose.connect(MONGODB_URI);
    return db;
  } catch (error) {
    throw error;
  }
}