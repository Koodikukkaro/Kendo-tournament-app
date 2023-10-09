import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    clubName: { type: String, required: true },
    danRank: { type: String, required: true },
    underage: { type: Boolean, default: false }, // Default to false if not provided
    guardiansEmail: { type: String }, // Optional, so not required
});

const User = mongoose.model('User', userSchema);

export default User;
