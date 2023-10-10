import User from '../models/user-model.js';

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Retrieve user profile information.
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     responses:
 *       200:
 *         description: Successfully retrieved user profile
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
 *                 createdOn:
 *                   type: string
 *                   format: date-time
 *                   example: '2021-10-04T08:30:00.000Z'
 *                 lastUpdatedOn:
 *                   type: string
 *                   format: date-time
 *                   example: '2021-10-04T09:30:00.000Z'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       500:
 *         description: An error occurred while retrieving the user profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */

export const getProfileAPI = async (req: any, res: any) => {
    const userId = req.params.id;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

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
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "An error occurred while retrieving the user profile" });
    }
};
