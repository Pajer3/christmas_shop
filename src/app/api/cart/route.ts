import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import User from '@/models/user';
import { ConnectMongoDb } from '@/lib/mongodb';

interface CartItem {
  productId: string;
  quantity: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
}

function isError(error: unknown): error is Error {
  return typeof error === 'object' && error !== null && 'message' in error;
}

export async function GET(req: NextRequest) {
  try {
    await ConnectMongoDb();

    const token = await getToken({ req });

    if (!token || !token.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const user = await User.findOne({ email: token.email });
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ cartItems: user.cart || [] });
  } catch (error) {
    return NextResponse.json({ message: 'Server error', error: isError(error) ? error.message : 'Unknown error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await ConnectMongoDb();
    const token = await getToken({ req });

    if (!token || !token.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const user = await User.findOne({ email: token.email });
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const { cart }: { cart: CartItem[] } = await req.json();

    // Validate cart items
    for (const item of cart) {
      if (!item.description) {
        return NextResponse.json({ message: 'Invalid cart item: description is required' }, { status: 400 });
      }
    }

    user.cart = cart;
    await user.save();

    return NextResponse.json({ message: 'Cart updated' });
  } catch (error) {
    return NextResponse.json({ message: 'Server error', error: isError(error) ? error.message : 'Unknown error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await ConnectMongoDb();
    const token = await getToken({ req });

    if (!token || !token.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const user = await User.findOne({ email: token.email });
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const { productId } = await req.json().catch(() => ({})); // Ensure it handles the request with no body

    if (productId) {
      // Remove the specific item from the cart
      user.cart = user.cart.filter((item: CartItem) => item.productId !== productId);
    } else {
      // Clear the entire cart
      user.cart = [];
    }

    const savedUser = await user.save();

    console.log("Cart after clearing:", savedUser.cart); // Debugging

    return NextResponse.json({ message: productId ? 'Item removed from cart' : 'Cart cleared successfully' });
  } catch (error) {
    console.error("Error in DELETE method:", isError(error) ? error.message : error);
    return NextResponse.json({ message: 'Server error', error: isError(error) ? error.message : 'Unknown error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await ConnectMongoDb();
    const token = await getToken({ req });

    if (!token || !token.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const user = await User.findOne({ email: token.email });
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const { productId: updateProductId, quantity } = await req.json();
    const cartItem = user.cart.find((item: CartItem) => item.productId === updateProductId);

    if (cartItem) {
      cartItem.quantity = quantity;
      await user.save();
      return NextResponse.json({ message: 'Cart item updated' });
    } else {
      return NextResponse.json({ message: 'Item not found in cart' }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json({ message: 'Server error', error: isError(error) ? error.message : 'Unknown error' }, { status: 500 });
  }
}

