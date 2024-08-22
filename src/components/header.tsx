"use client";
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { usePathname } from "next/navigation";
import CartSummary from './cartSummary';  
import '../styles/Header.css'; // Import the CSS file

export default function Header() {
  const { data: session, status } = useSession();
  const pathName = usePathname();

  // Don't render the header or its links on the /login or /register pages
  if (pathName === '/login' || pathName === '/signup') {
    return null;
  }

  return (
    <header className="header-wrapper">
      <nav className="links">
        <Link href="/" className="header-link title">
          CHRISTMAS SHOP
        </Link>
        <div className="apart">
          <Link href="/" className={`header-link ${pathName === '/' ? 'active-page-link' : ''}`}>
            HOME
          </Link>
          <Link href="/discover" className={`header-link ${pathName === '/discover' ? 'active-page-link' : ''}`}>
            DISCOVER
          </Link>
          {status === 'authenticated' ? (
            <>
              <Link href="/account" className={`header-link ${pathName === '/account' ? 'active-page-link' : ''}`}>
                ACCOUNT
              </Link>
              <button onClick={() => signOut()} className="header-link login logout">
                LOGOUT
              </button>
            </>
          ) : (
            <Link href="/login" className={`header-link login ${pathName === '/login' ? 'active-page-link' : ''}`}>
              LOGIN
            </Link>
          )}
        </div>
        <CartSummary /> 
      </nav>
    </header>
  );
}
