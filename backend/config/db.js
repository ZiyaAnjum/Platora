const mongoose = require('mongoose');

/**
 * Connects to MongoDB using the URI defined in the environment variables.
 * Exits the process if the connection fails, since the API is useless without a DB.
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`MongoDB connection error: ${err.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
