import mongoose from "mongoose";
import config from "./config";

const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(config.MONGO_URL);
    console.log("MongoDB connection successful");
  } catch (error) {
    console.error(`MongoDB connection error: ${JSON.stringify(error)}`);
  }
};

export default connectDB;
