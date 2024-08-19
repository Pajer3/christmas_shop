import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import User from '@/models/user';
import { ConnectMongoDb } from '@/lib/mongodb';

interface CartItem {
    productId: string;
    quantity: number;
    name: string; // Optional: Product name for convenience
    price: number; // Optional: Product price at time of adding to cart
    imageUrl: string; // Optional: Product image URL for display in cart
  }
  

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });
  await ConnectMongoDb();

  if (!session || !session.user || !session.user.email) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const user = await User.findOne({ email: session.user.email });

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  if (req.method === 'GET') {
    return res.status(200).json({ cartItems: user.cart || [] });
  }

  if (req.method === 'POST') {
    const { cart } = req.body;
    user.cart = cart;
    await user.save();
    return res.status(200).json({ message: 'Cart updated' });
  }

  if (req.method === 'DELETE') {
    const { productId } = req.body;

    user.cart = user.cart.filter((item: CartItem) => item.productId !== productId);

    await user.save();
    return res.status(200).json({ message: 'Item removed from cart' });
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
