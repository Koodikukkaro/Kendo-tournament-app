import { Express } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/user-model.js';


export const loginAPI = async (req: Express.Request, res: Express.Response) => {
    const { email, password } = req.body;

    // Check if the email exists
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(401).json({ error: "Invalid email or password" });
    }

    // Check if the password matches
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
        return res.status(401).json({ error: "Invalid email or password" });
    }

    // Todo: need to generate a session here.
    res.json({
        user_id: user._id,
        first_name: user.firstName,
        last_name: user.lastName,
        email: user.email,
        phone: user.phoneNumber,
        club: user.clubName,
        dan: user.danRank,
        underage: user.underage,
        guardian: user.guardiansEmail,
        created_on: user.createdAt,
        last_updated_on: user.updatedAt
    });
};
