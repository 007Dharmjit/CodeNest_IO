const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/CodeNest_io");
    console.log("Database Connected Successfully!");
  } catch (error) {
    console.error("Database Connection Failed:", error);
    process.exit(1);
  }
};

module.exports = connectDB;
