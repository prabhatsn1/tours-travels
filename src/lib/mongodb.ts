import { MongoClient, Db } from "mongodb";
import mongoose, { ConnectOptions } from "mongoose";

// MongoDB connection string - you'll need to set this in your environment variables
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/tours-travels";
const MONGODB_DB = process.env.MONGODB_DB || "tours-travels";

// Global variable to cache the database connection
let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

// Global variable to cache the connection in development
declare global {
  var mongooseCache: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
}

// Initialize the cache
let cached = global.mongooseCache;

if (!cached) {
  cached = global.mongooseCache = { conn: null, promise: null };
}

/**
 * MongoDB connection utility using native MongoDB driver
 * Implements connection caching for optimal performance in serverless environments
 */
export async function connectToDatabase(): Promise<{
  client: MongoClient;
  db: Db;
}> {
  // Return cached connection if available
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  try {
    // Create new MongoDB client
    const client = new MongoClient(MONGODB_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    // Connect to MongoDB
    await client.connect();

    // Get database instance
    const db = client.db(MONGODB_DB);

    // Cache the connection
    cachedClient = client;
    cachedDb = db;

    console.log("Successfully connected to MongoDB");
    return { client, db };
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    throw new Error("Database connection failed");
  }
}

/**
 * Connect to MongoDB using Mongoose with connection caching
 * This approach prevents multiple connections in development due to hot reloading
 */
export async function connectWithMongoose(): Promise<typeof mongoose> {
  // Return cached connection if available
  if (cached.conn) {
    return cached.conn;
  }

  // Return existing promise if connection is in progress
  if (!cached.promise) {
    const opts: ConnectOptions = {
      // Remove deprecated options for newer Mongoose versions
      // bufferMaxEntries: 0, // This option is no longer supported
    };

    // Get MongoDB URI from environment variables
    const MONGODB_URI = process.env.MONGODB_URI;

    if (!MONGODB_URI) {
      throw new Error(
        "Please define the MONGODB_URI environment variable inside .env.local"
      );
    }

    // Create connection promise
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log("✅ Connected to MongoDB successfully");
      return mongoose;
    });
  }

  try {
    // Wait for connection and cache it
    cached.conn = await cached.promise;
  } catch (e) {
    // Reset promise on error so next attempt can try again
    cached.promise = null;
    console.error("❌ Failed to connect to MongoDB:", e);
    throw e;
  }

  return cached.conn;
}

/**
 * Gracefully close database connections
 */
export async function closeDatabaseConnection(): Promise<void> {
  try {
    if (cachedClient) {
      await cachedClient.close();
      cachedClient = null;
      cachedDb = null;
    }

    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }

    console.log("Database connections closed successfully");
  } catch (error) {
    console.error("Error closing database connections:", error);
  }
}

/**
 * Get the current connection status
 */
export function getConnectionStatus(): string {
  if (!cached.conn) {
    return "disconnected";
  }

  const state = cached.conn.connection.readyState;
  switch (state) {
    case 0:
      return "disconnected";
    case 1:
      return "connected";
    case 2:
      return "connecting";
    case 3:
      return "disconnecting";
    default:
      return "unknown";
  }
}

/**
 * Check if MongoDB is connected
 */
export function isConnected(): boolean {
  return cached.conn?.connection.readyState === 1;
}

/**
 * Database health check utility
 */
export async function checkDatabaseHealth(): Promise<boolean> {
  try {
    const { db } = await connectToDatabase();
    await db.admin().ping();
    return true;
  } catch (error) {
    console.error("Database health check failed:", error);
    return false;
  }
}
