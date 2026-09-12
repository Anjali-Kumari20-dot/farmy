const mongoose = require("mongoose");


const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/farmy";
  console.log("[debug] Attempting to connect to MongoDB at:", mongoUri);

  const options = {
    autoIndex: true, // build indexes defined in schemas
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  };

  try {
    const conn = await mongoose.connect(mongoUri, options);
    console.log(`[database] connected: ${conn.connection.host} / ${conn.connection.name}`);

    // Listeners for runtime connection health
    mongoose.connection.on("error", (err) => {
      console.error("[Database Error]", err.message);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("[database] MongoDB disconnected. Attempting reconnection...");
    });

    mongoose.connection.on("reconnected", () => {
      console.log("[database] MongoDB reconnected successfully.");
    });

    return conn;
  } catch (error) {
    console.error("[database Connection Failed]", error.message);
    // Don't crash immediately in dev mode so the app can provide clear API errors
    return null;
  }
};

/**
 * Graceful database disconnect handler for process termination
 */
const disconnectDB = async () => {
  try {
    await mongoose.connection.close(false);
    console.log("[Database] MongoDB connection closed through app termination.");
  } catch (err) {
    console.error("[Database Disconnect Error]", err.message);
  }
};

module.exports = {
  connectDB,
  disconnectDB,
};
