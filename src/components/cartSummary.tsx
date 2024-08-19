// components/CartSummary.tsx
"use client";

import { useCart } from '@/context/cartcontext';
import Link from 'next/link';
import Image from 'next/image';
import styles from './CartSummary.module.css';

export default function CartSummary() {
  const { cart } = useCart();

  // Calculate total items and total price
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className={styles.cartSummary}>
      <Link href="/cart" className={styles.cartIcon}>
        <Image src="/images/briefcase-blank.png" alt="Cart" width={24} height={24} />
        <span className={styles.cartCount}>{totalItems}</span>
      </Link>

      <div className={styles.cartDropdown}>
        {cart.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <ul>
            {cart.map((item) => (
              <li key={item.productId} className={styles.cartItem}>
                <Image src={item.imageUrl} alt={item.name} width={50} height={50} />
                <div>
                  <p>{item.name}</p>
                  <p>
                    {item.quantity} x ${item.price.toFixed(2)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
        {cart.length > 0 && (
          <div className={styles.cartTotal}>
            <p>Total: ${totalPrice.toFixed(2)}</p>
            <Link href="/checkout" className={styles.checkoutButton}>
              Checkout
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
