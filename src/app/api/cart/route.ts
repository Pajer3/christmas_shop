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

// Type guard to check if the error is an instance of Error
function isError(error: unknown): error is Error {
  return typeof error === 'object' && error !== null && 'message' in error;
}

export async function GET(req: NextRequest) {
  try {
    await ConnectMongoDb();
    
    const token = await getToken({ req });
    if (!token || !token.email) {
      console.error("Unauthorized request, no valid token found");
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const user = await User.findOne({ email: token.email });
    if (!user) {
      console.error("User not found with email:", token.email);
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ cartItems: user.cart || [] });
  } catch (error) {
    if (isError(error)) {
      console.error("Error in GET method:", error.message);
    } else {
      console.error("Unknown error in GET method");
    }
    return NextResponse.json({ message: 'Server error', error: isError(error) ? error.message : 'Unknown error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await ConnectMongoDb();
    const token = await getToken({ req });

    if (!token || !token.email) {
      console.error("Unauthorized request, no valid token found");
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const user = await User.findOne({ email: token.email });

    if (!user) {
      console.error("User not found with email:", token.email);
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const { cart } = await req.json();
    user.cart = cart;
    await user.save();
    return NextResponse.json({ message: 'Cart updated' });
  } catch (error) {
    if (isError(error)) {
      console.error("Error in POST method:", error.message);
    } else {
      console.error("Unknown error in POST method");
    }
    return NextResponse.json({ message: 'Server error', error: isError(error) ? error.message : 'Unknown error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await ConnectMongoDb();
    const token = await getToken({ req });

    if (!token || !token.email) {
      console.error("Unauthorized request, no valid token found");
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const user = await User.findOne({ email: token.email });

    if (!user) {
      console.error("User not found with email:", token.email);
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const { productId } = await req.json();

    if (productId) {
      console.log("Attempting to remove product with ID:", productId);
      user.cart = user.cart.filter((item: CartItem) => item.productId !== productId);
      await user.save();
      console.log("Product removed successfully");
      return NextResponse.json({ message: 'Item removed from cart' });
    } else {
      console.log("Clearing entire cart for user:", token.email);
      user.cart = [];
      await user.save();
      console.log("Cart cleared successfully");
      return NextResponse.json({ message: 'Cart cleared' });
    }
  } catch (error) {
    if (isError(error)) {
      console.error("Error in DELETE method:", error.message);
    } else {
      console.error("Unknown error in DELETE method");
    }
    return NextResponse.json({ message: 'Server error', error: isError(error) ? error.message : 'Unknown error' }, { status: 500 });
  }
}


export async function PUT(req: NextRequest) {
  try {
    await ConnectMongoDb();
    const token = await getToken({ req });

    if (!token || !token.email) {
      console.error("Unauthorized request, no valid token found");
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const user = await User.findOne({ email: token.email });

    if (!user) {
      console.error("User not found with email:", token.email);
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
    if (isError(error)) {
      console.error("Error in PUT method:", error.message);
    } else {
      console.error("Unknown error in PUT method");
    }
    return NextResponse.json({ message: 'Server error', error: isError(error) ? error.message : 'Unknown error' }, { status: 500 });
  }
}
