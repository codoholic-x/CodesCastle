// ============================================
// FILE: backend/src/config/db.js
// PURPOSE: Establishes connection to MongoDB Atlas using Mongoose.
// This file is imported once in server.js when the app starts.
// If the connection fails, the server will log the error and exit,
// since the app cannot function without the database.
// ============================================

const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`[DB] MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[DB] Connection failed: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
