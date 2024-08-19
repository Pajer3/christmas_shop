"use client";

import { useState, useEffect } from "react";
import Loader from './loader';
import Header from './header';
import { AuthProvider } from "@/providers";

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
        <Header />
        {loading ? <Loader /> : children}
      </AuthProvider>
    </>
  );
}