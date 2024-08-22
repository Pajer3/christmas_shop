import mongoose, { Schema, Document } from 'mongoose';

interface IDiscountCode extends Document {
  code: string;
  discountPercentage: number;
  expiresAt: Date;
  usageLimit?: number;
  timesUsed: number;
  active: boolean;
}

const DiscountCodeSchema: Schema = new Schema({
  code: { type: String, required: true, unique: true },
  discountPercentage: { type: Number, required: true },
  expiresAt: { type: Date, required: true },
  usageLimit: { type: Number, default: null }, // Null means unlimited
  timesUsed: { type: Number, default: 0 },
  active: { type: Boolean, default: true },
});

const DiscountCode = mongoose.models.DiscountCode || mongoose.model<IDiscountCode>('DiscountCode', DiscountCodeSchema);
export default DiscountCode;
