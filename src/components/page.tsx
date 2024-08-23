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
  const { addToCart } = useCart(); // Use the updated addToCart function from the cart context

  useEffect(() => {
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

  const handleAddToCart = (product: Product) => {
    addToCart({
      productId: product._id,
      quantity: 1,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      description: product.description // Ensure description is included
    });
  };

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
      <div className="banner">
        <Image src="/images/Group128.png" alt="banner" width={1200} height={300} priority />
      </div>

      <div className="search-bar">
        <Image src="/images/search.png" alt="Search" width={10} height={10} />
        <input type="text" placeholder="Search..." />
      </div>

      <div className="product-grid">
        {products.map((product) => (
          <div className="product-placeholder" key={product._id}>
            <div className="image-placeholder">
              <Image className="img-border" src={product.imageUrl} alt={product.name} width={250} height={150} />
            </div>
            <div className="title-placeholder">{product.name}</div>
            <div className="description-placeholder">Price: ${product.price}</div>
            <div className="price-placeholder">{product.description}</div>
            <div className="button-placeholder">
              <button className="btn" onClick={() => handleCreateCheckoutSession(product._id)}>Buy Now</button>
              <button className="btn">Details</button>
              <button className="btn" onClick={() => handleAddToCart(product)}>Add</button>
            </div>
          </div>
        ))}
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

      <div className="category-banners">
        <div className="banner-item">
          <h2>COUPLES</h2>
        </div>
        <div className="banner-item">
          <h2>FOR THE KIDS</h2>
        </div>
      </div>

      <div className="product-grid">
        {products.slice(totalPlaceholders).map((product) => (
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
              <button className="btn" onClick={() => handleAddToCart(product)}>Add to Cart</button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
