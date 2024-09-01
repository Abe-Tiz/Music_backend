const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const uri = process.env.MONGO_URL;
// const uri = "mongodb://127.0.0.1:27017/musicDb";

// Function to connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1);  
  }
};


module.exports = connectDB;
