import mongoose from "mongoose";
import "dotenv/config";

const mongoUri = process.env.MONGODB_URL;
if (mongoUri === null || mongoUri === undefined) {
  throw new Error("MONGO_URL is not defined in environment variables.");
}

const connectDB = (): void => {
  mongoose
    .connect(mongoUri)
    .then((_result) => {
      console.log("MongoDB connection successful");
    })
    .catch((error) => {
      console.error(`MongoDB connection error: ${JSON.stringify(error)}`);
    });
};

export default connectDB;
