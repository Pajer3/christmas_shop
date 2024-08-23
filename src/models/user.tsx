import mongoose, { Schema, model, models, Document } from "mongoose";

interface CartItem extends Document {
  productId: string;
  quantity: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
}

const cartItemSchema = new Schema<CartItem>({
  productId: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    default: 1,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
});

interface User extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  cart: CartItem[];
}

const userSchema = new Schema<User>({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  cart: {
    type: [cartItemSchema],
    default: [],
  },
}, { timestamps: true });

const User = models.User || model<User>('User', userSchema);

export default User;