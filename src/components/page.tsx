"use client";
import { useState, useEffect } from 'react';
import Image from 'next/image';
import '../styles/home.css';
import { useCart } from '../context/cartcontext';

interface Product {
    _id: string;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    category: string;
    stock: number;
}

export default function Page() {
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        // Fetch products data from the API
        const fetchProducts = async () => {
            try {
                const response = await fetch('/api/product');
                const data = await response.json();
                setProducts(data);
            } catch (error) {
                console.error('Failed to fetch products:', error);
            }
        };

        fetchProducts();
    }, []);

    const handleCreateCheckoutSession = async (productId: string) => {
        try {
            const response = await fetch("/api/create-checkout-session", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ productId }),
            });

            const { sessionUrl } = await response.json();
            window.location.href = sessionUrl;
        } catch (error) {
            console.error("Error creating checkout session:", error);
        }
    };

    const totalPlaceholders = 8;
    const placeholdersNeeded = totalPlaceholders - products.length;

    return (
        <main>
            {/* Banner */}
            <div className="banner">
                <Image src="/images/Group128.png" alt="banner" width={1200} height={300} />
            </div>

            {/* Search Bar */}
            <div className="search-bar">
                <Image src="/images/search.png" alt="Search" width={10} height={10} />
                <input type="text" placeholder="Search..." />
            </div>

            {/* Product Grid */}
            <div className="product-grid">
                {/* Display fetched products */}
                {products.map((product) => (
                    <div className="product-placeholder" key={product._id}>
                        <div className="image-placeholder">
                            <Image src={product.imageUrl} alt={product.name} width={150} height={150} />
                        </div>
                        <div className="title-placeholder">{product.name}</div>
                        <div className="description-placeholder">{product.description}</div>
                        <div className="price-placeholder">Price: ${product.price}</div>
                        <div className="button-placeholder">
                            <button className="btn" onClick={() => handleCreateCheckoutSession(product._id)}>Buy Now</button>
                            <button className="btn">Details</button>
                            <button className="btn">Add to Cart</button>
                        </div>
                    </div>
                ))}

                {/* Display remaining placeholders if needed */}
                {[...Array(placeholdersNeeded)].map((_, index) => (
                    <div className="product-placeholder" key={`placeholder-${index}`}>
                        <div className="image-placeholder"></div>
                        <div className="title-placeholder"></div>
                        <div className="description-placeholder"></div>
                        <div className="price-placeholder"></div>
                        <div className="button-placeholder">
                            <div className="btn"></div>
                            <div className="btn"></div>
                            <div className="btn"></div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Category Banners */}
            <div className="category-banners">
                <div className="banner-item">
                    <h2>COUPLES</h2>
                </div>
                <div className="banner-item">
                    <h2>FOR THE KIDS</h2>
                </div>
            </div>

            {/* Another Product Grid */}
            <div className="product-grid">
                {/* Repeat the logic here if needed */}
                {products.slice(totalPlaceholders).map((product, index) => (
                    <div className="product-placeholder" key={`grid-2-${product._id}`}>
                        <div className="image-placeholder">
                            <Image src={product.imageUrl} alt={product.name} width={150} height={150} />
                        </div>
                        <div className="title-placeholder">{product.name}</div>
                        <div className="description-placeholder">{product.description}</div>
                        <div className="price-placeholder">Price: ${product.price}</div>
                        <div className="button-placeholder">
                            <button className="btn" onClick={() => handleCreateCheckoutSession(product._id)}>Buy Now</button>
                            <button className="btn">Details</button>
                            <button className="btn">Add to Cart</button>
                        </div>
                    </div>
                ))}
                {[...Array(Math.max(0, placeholdersNeeded - products.length))].map((_, index) => (
                    <div className="product-placeholder" key={`placeholder-grid-2-${index}`}>
                        <div className="image-placeholder"></div>
                        <div className="title-placeholder"></div>
                        <div className="description-placeholder"></div>
                        <div className="price-placeholder"></div>
                        <div className="button-placeholder">
                            <div className="btn"></div>
                            <div className="btn"></div>
                            <div className="btn"></div>
                        </div>
                    </div>
                ))}
            </div>
        </main>
    );
}
