import { NextResponse } from 'next/server';
import { ConnectMongoDb } from '@/lib/mongodb';
import DiscountCode from '@/models/DiscountCode';

// POST: Apply a promo code
export async function POST(request: Request) {
    await ConnectMongoDb();

    try {
        const { code } = await request.json();
        const discountCode = await DiscountCode.findOne({ code });

        if (!discountCode) {
            return NextResponse.json({ message: 'Discount code not found' }, { status: 404 });
        }

        // Check if the discount code is still active and valid
        if (!discountCode.active || discountCode.expiresAt < new Date() || 
            (discountCode.usageLimit !== null && discountCode.timesUsed >= discountCode.usageLimit)) {
            return NextResponse.json({ message: 'Discount code is no longer valid' }, { status: 400 });
        }

        // Increment times used
        discountCode.timesUsed += 1;
        await discountCode.save();

        return NextResponse.json({ discountPercentage: discountCode.discountPercentage }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
