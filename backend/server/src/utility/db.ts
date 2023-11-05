import mongoose from "mongoose";
import "dotenv/config";

const mongoUri = process.env.MONGODB_URL;
if (mongoUri === null || mongoUri === undefined) {
  throw new Error("MONGO_URL is not defined in environment variables.");
}

console.log("---------------");
console.log(mongoUri);
console.log("---------------");

const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(mongoUri);
    console.log("MongoDB connection successful");
  } catch (err) {
    console.error(`MongoDB connection error: ${String(err)}`);
  }
};

export default connectDB;
