import { NextApiRequest, NextApiResponse } from 'next';
import User from '../../../models/user'; 
import { ConnectMongoDb } from '../../../lib/mongodb'; // Adjust the path to your MongoDB connection function

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await ConnectMongoDb();

    const { email } = req.query;

    if (!email || typeof email !== 'string') {
        return res.status(400).json({ message: 'Invalid email' });
    }

    try {
        const user = await User.findOne({ email }).exec();

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({ message: 'Error retrieving user data', error });
    }
}
