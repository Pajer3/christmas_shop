"use client";

import { useState, useEffect } from "react";
import Loader from './loader';
import Header from './header';
import { AuthProvider } from "@/providers";
import { CartProvider } from '@/context/cartcontext'; // Import the CartProvider

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <AuthProvider>
        <CartProvider> {/* Wrap children with CartProvider */}
          <Header />
          {loading ? <Loader /> : children}
        </CartProvider>
      </AuthProvider>
    </>
  );
}
