import bcrypt from 'bcryptjs';
import User from '../models/user-model.js';
import { Express } from 'express';

/**
 * @swagger
 * /api/user/register:
 *   post:
 *     summary: Register a new user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - firstName
 *               - lastName
 *               - phoneNumber
 *               - clubName
 *               - danRank
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: mypassword123
 *               firstName:
 *                 type: string
 *                 example: John
 *               lastName:
 *                 type: string
 *                 example: Doe
 *               phoneNumber:
 *                 type: string
 *                 example: +1234567890
 *               clubName:
 *                 type: string
 *                 example: EliteClub
 *               danRank:
 *                 type: string
 *                 example: 1st Dan
 *               underage:
 *                 type: boolean
 *                 example: false
 *                 description: If true, guardiansEmail is required
 *               guardiansEmail:
 *                 type: string
 *                 example: guardian@example.com
 *     responses:
 *       200:
 *         description: Successfully registered user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Registration failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 * */


export const registerAPI = async (req: Express.Request, res: Express.Response) => {
    const { email, password, firstName, lastName, phoneNumber, clubName, danRank, underage, guardiansEmail } = req.body;

    // Email validation using a simple regular expression
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: "Invalid email format" });
    }

    // Password validation: between 8 and 30 characters, and alphanumeric
    const passwordRegex = /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]{8,30})$/;
    if (!passwordRegex.test(password)) {
        return res.status(400).json({ error: "Password must be 8-30 characters long and alphanumeric" });
    }

    // Validate required fields
    if (!firstName || !lastName) {
        return res.status(400).json({ error: "First name and last name are required" });
    }

    // Check if phone number is provided
    if (!phoneNumber) {
        return res.status(400).json({ error: "Phone number is required" });
    }

    // Simple phone number validation using a regular expression
    const phoneRegex = /^[0-9]{10,15}$/;  // Adjust the length as needed
    if (!phoneRegex.test(phoneNumber)) {
        return res.status(400).json({ error: "Invalid phone number format" });
    }

    // Check if underage is true and guardiansEmail is empty
    if (underage && !guardiansEmail) {
        return res.status(400).json({ error: "Guardian's email is required for underage users" });
    }

    // Check if email exists
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "Email already exists" });
        }
    } catch (err) {
        console.log(err);
        return res.status(400).json({ "message": "An error occurred. User registration failed!" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const newUser = new User({
        email,
        password: hashedPassword,
        firstName,
        lastName,
        phoneNumber,
        clubName,
        danRank,
        underage: underage || false,
        guardiansEmail,
    });

    try {
        const savedUser = await newUser.save();
        res.json({
            "message": "User registration successful"
        });
    } catch (err) {
        console.log(err);
        res.status(400).json({ "message": "An error occurred. User registration failed!" });
    }
};
