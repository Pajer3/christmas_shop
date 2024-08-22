"use client";
import { createContext, useContext, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Success from '@/app/success/page';

export interface CartItem {
  productId: string;
  quantity: number;
  name: string;
  description: string; 
  price: number;
  imageUrl: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string) => void;
  updateCartItemQuantity: (productId: string, quantity: number) => void;
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
        try {
          const res = await fetch('/api/cart');
          if (res.ok) {
            const data = await res.json();
            setCart(data.cartItems || []);
          } else {
            console.error('Failed to load cart from server:', res.statusText);
          }
        } catch (error) {
          console.error('Failed to load cart from server:', error);
        }
      } else {
        const localCart = localStorage.getItem('cart');
        if (localCart) {
          setCart(JSON.parse(localCart));
        }
      }
    };

    loadCart();
  }, [session]);

  const saveCartToServer = async (updatedCart: CartItem[]) => {
    if (session) {
      try {
        const res = await fetch('/api/cart', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ cart: updatedCart }),
        });
        if (!res.ok) {
          console.error('Failed to save cart to server:', res.statusText);
        }
      } catch (error) {
        console.error('Error saving cart to server:', error);
      }
    } else {
      localStorage.setItem('cart', JSON.stringify(updatedCart));
    }
  };

  const addToCart = async (item: CartItem) => {
    const updatedCart = [...cart];
    const existingItem = updatedCart.find(cartItem => cartItem.productId === item.productId);

    if (existingItem) {
      existingItem.quantity += item.quantity;
    } else {
      updatedCart.push(item);
    }

    setCart(updatedCart);
    await saveCartToServer(updatedCart);
  };

  const removeFromCart = async (productId: string) => {
    const updatedCart = cart.filter(item => item.productId !== productId);
    setCart(updatedCart);
    await saveCartToServer(updatedCart);
  };

  const updateCartItemQuantity = async (productId: string, newQuantity: number) => {
    const updatedCart = cart.map(item => 
      item.productId === productId ? { ...item, quantity: newQuantity } : item
    );
    setCart(updatedCart);
    await saveCartToServer(updatedCart);
  };

  const clearCart = async () => {
    setCart([]);
    if (session) {
      try {
        const res = await fetch('/api/cart', { method: 'DELETE' });
        if (!res.ok) {
          console.error('Failed to clear cart on server:', res.statusText);
        }
      } catch (error) {
        console.error('Error clearing cart on server:', error);
      }
    } else {
      localStorage.removeItem('cart');
    }
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateCartItemQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
