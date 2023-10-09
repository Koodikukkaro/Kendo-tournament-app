import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();
const mongoUri: string = process.env.MONGO_URL!;

console.log("_---------------_");
console.log(mongoUri);
console.log("_---------------_");

const connectDB = async () => {
    try {
        await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('MongoDB connection successful');
    } catch (err) {
        console.error(`MongoDB connection error: ${err}`);
    }
};

export default connectDB;
