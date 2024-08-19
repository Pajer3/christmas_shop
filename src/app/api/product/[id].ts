// src/pages/api/product/[id].ts
import { NextApiRequest, NextApiResponse } from 'next';
import Product from '@/models/products';
import { ConnectMongoDb } from '@/lib/mongodb';
import mongoose from 'mongoose';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await ConnectMongoDb();

    const { id } = req.query;

    console.log(`Received ID for operation: ${id}`);

    // Validate the ID
    if (!id || !mongoose.Types.ObjectId.isValid(id as string)) {
        console.error(`Invalid product ID format: ${id}`);
        return res.status(400).json({ message: 'Invalid product ID format' });
    }

    try {
        if (req.method === 'GET') {
            const product = await Product.findById(id);
            if (!product) {
                console.error(`Product not found with ID: ${id}`);
                return res.status(404).json({ message: 'Product not found' });
            }
            return res.status(200).json(product);
        } else if (req.method === 'PUT') {
            const { name, description, price, imageUrl, category, stock } = req.body;

            const updatedProduct = await Product.findByIdAndUpdate(
                id,
                { name, description, price, imageUrl, category, stock },
                { new: true, runValidators: true }
            );

            if (!updatedProduct) {
                console.error(`Product not found with ID: ${id}`);
                return res.status(404).json({ message: 'Product not found' });
            }
            return res.status(200).json(updatedProduct);
        } else {
            console.error(`Method not allowed: ${req.method}`);
            return res.status(405).json({ message: `Method ${req.method} not allowed` });
        }
    } catch (error: any) {
        console.error(`Error occurred: ${error.message}`);
        return res.status(500).json({ error: error.message });
    }
}
