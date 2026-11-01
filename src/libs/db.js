import mongoose from 'mongoose';

const cache = globalThis._mongooseConnection ||= { connection: null, promise: null };

export async function connectDB() {
  if (cache.connection?.connection.readyState === 1) return cache.connection;
  if (!cache.promise) {
    cache.promise = mongoose.connect(process.env.MONGO_URL, {
      serverSelectionTimeoutMS: 10000,
    });
  }
  try {
    cache.connection = await cache.promise;
    return cache.connection;
  } catch (error) {
    cache.promise = null;
    throw error;
  }
}
