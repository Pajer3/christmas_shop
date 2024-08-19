// context/CartContext.tsx
"use client";
import { createContext, useContext, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';


export interface CartItem {
  productId: string;
  quantity: number;
  name: string;      // The name of the product
  price: number;     // The price of the product
  imageUrl: string;  // The image URL of the product
}


interface CartContextType {
  cart: CartItem[];
  addToCart: (productId: string) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const { data: session } = useSession();

  useEffect(() => {
    const loadCart = async () => {
      if (session) {
        // Load cart from the database for logged-in users
        try {
          const res = await fetch('/api/cart');
          if (res.ok) {
            const data = await res.json();
            setCart(data.cartItems || []);
          }
        } catch (error) {
          console.error('Failed to load cart:', error);
        }
      } else {
        // Load cart from local storage for guest users
        const localCart = localStorage.getItem('cart');
        if (localCart) {
          setCart(JSON.parse(localCart));
        }
      }
    };

    loadCart();
  }, [session]);

  const addToCart = async (productId: string) => {
    const updatedCart = [...cart];
    const existingItem = updatedCart.find(item => item.productId === productId);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      updatedCart.push({
        productId, quantity: 1,
        name: '',
        price: 0,
        imageUrl: ''
      });
    }

    setCart(updatedCart);

    if (session) {
      // Save cart to the database
      await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cart: updatedCart }),
      });
    } else {
      // Save cart to local storage for guest users
      localStorage.setItem('cart', JSON.stringify(updatedCart));
    }
  };

  const removeFromCart = async (productId: string) => {
    const updatedCart = cart.filter(item => item.productId !== productId);
    setCart(updatedCart);

    if (session) {
      // Update cart in the database
      await fetch('/api/cart', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      });
    } else {
      // Update local storage for guest users
      localStorage.setItem('cart', JSON.stringify(updatedCart));
    }
  };

  const clearCart = () => {
    setCart([]);
    if (session) {
      fetch('/api/cart', { method: 'DELETE' });
    } else {
      localStorage.removeItem('cart');
    }
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
