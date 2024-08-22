// src/pages/api/discount-codes/route.ts
import { NextResponse } from 'next/server';
import { ConnectMongoDb } from '@/lib/mongodb';
import DiscountCode from '@/models/DiscountCode';

// GET: Fetch all discount codes
export async function GET() {
    await ConnectMongoDb();
    try {
        const discountCodes = await DiscountCode.find({});
        return NextResponse.json(discountCodes, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST: Create a new discount code
export async function POST(request: Request) {
    await ConnectMongoDb();
    try {
        const data = await request.json();
        const discountCode = new DiscountCode(data);
        await discountCode.save();
        return NextResponse.json(discountCode, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}

// PUT: Update an existing discount code
export async function PUT(request: Request) {
    await ConnectMongoDb();
    try {
        const data = await request.json();
        const { _id, ...updateData } = data;
        const updatedDiscountCode = await DiscountCode.findByIdAndUpdate(_id, updateData, { new: true });

        if (!updatedDiscountCode) {
            return NextResponse.json({ message: 'Discount code not found' }, { status: 404 });
        }

        return NextResponse.json(updatedDiscountCode, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}

// DELETE: Delete a discount code
export async function DELETE(request: Request) {
    await ConnectMongoDb();
    try {
        const { _id } = await request.json();
        const deletedDiscountCode = await DiscountCode.findByIdAndDelete(_id);

        if (!deletedDiscountCode) {
            return NextResponse.json({ message: 'Discount code not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Discount code deleted successfully' }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
