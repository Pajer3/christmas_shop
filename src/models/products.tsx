import mongoose, { Schema, model, models } from 'mongoose';

const productSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Product name is required'],
        index: true, 
    },
    description: {
        type: String,
        required: [true, 'Product description is required'],
    },
    price: {
        type: Number,
        required: [true, 'Product price is required'],
        min: [0, 'Price cannot be negative'],
    },
    imageUrl: {
        type: String,
        required: [true, 'Product image URL is required'],
    },
    category: {
        type: String,
        required: [true, 'Product category is required'],
    },
    stock: {
        type: Number,
        required: true,
        default: 0,
    },
}, { timestamps: true });

// Check if the model exists already (to avoid re-compiling)
const Product = models.Product || model('Product', productSchema);

export default Product;