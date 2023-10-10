import bcrypt from 'bcryptjs';
import User from '../models/user-model.js';

/**
 * @swagger
 * /api/user/login:
 *   post:
 *     summary: Login existing user
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: mypassword123
 *     responses:
 *       200:
 *         description: Successfully logged in
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user_id:
 *                   type: string
 *                 first_name:
 *                   type: string
 *                 last_name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 phone:
 *                   type: string
 *                 club:
 *                   type: string
 *                 dan:
 *                   type: string
 *                 underage:
 *                   type: boolean
 *                 guardian:
 *                   type: string
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 * */

export const loginAPI = async (req: any, res: any) => {
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
        guardian: user.guardiansEmail
    });
};
