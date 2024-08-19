// src/pages/api/product/route.ts
import { NextResponse } from 'next/server';
import Product from '@/models/products';
import { ConnectMongoDb } from '@/lib/mongodb';

export async function GET() {
    await ConnectMongoDb();
    try {
        const products = await Product.find({});
        return NextResponse.json(products, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}

export async function POST(request: Request) {
    await ConnectMongoDb();
    const { action, _id, name, description, price, imageUrl, category, stock } = await request.json();

    try {
        if (action === 'create') {
            await Product.create({
                name,
                description,
                price,
                imageUrl,
                category,
                stock,
            });
        } else if (action === 'update' && _id) {
            const updatedProduct = await Product.findByIdAndUpdate(
                _id,
                { name, description, price, imageUrl, category, stock },
                { new: true, runValidators: true }
            );
            if (!updatedProduct) {
                return NextResponse.json({ message: 'Product not found' }, { status: 404 });
            }
        } else {
            return NextResponse.json({ message: 'Invalid action or missing product ID' }, { status: 400 });
        }

        // Return the updated list of products after the operation
        const updatedProducts = await Product.find({});
        return NextResponse.json(updatedProducts, { status: 200 });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
