import bcrypt from 'bcryptjs';
import User from '../models/user-model.js';

export const registerAPI = async (req: any, res: any) => {
    const { email, password } = req.body;

    // Check if email exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ error: "Email already exists" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const newUser = new User({
        email,
        password: hashedPassword,
    });

    try {
        const savedUser = await newUser.save();
        res.json(savedUser);
    } catch (err) {
        res.status(400).json({ error: err });
    }
};
