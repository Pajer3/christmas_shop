import { NextApiRequest, NextApiResponse } from 'next';
import Product from '@/models/products';
import { ConnectMongoDb } from '@/lib/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await ConnectMongoDb();

    if (req.method === 'GET') {
        try {
            const { q } = req.query;
            const products = await Product.find({
                name: { $regex: q, $options: 'i' } // Case-insensitive search
            });
            res.status(200).json(products);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    } else {
        res.status(405).json({ message: 'Only GET method is allowed' });
    }
}
