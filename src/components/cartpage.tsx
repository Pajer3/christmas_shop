// pages/cart/page.tsx
"use client";

import { useCart } from '@/context/cartcontext';
import Image from 'next/image';
import { useState } from 'react';
import styles from './CartPage.module.css';

export default function CartPage() {
  const { cart, removeFromCart, clearCart, updateCartItemQuantity } = useCart();
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0); // Store discount percentage

  const handlePromoCodeSubmit = async () => {
    try {
      const response = await fetch('/api/apply-promo-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: promoCode }),
      });

      if (response.ok) {
        const data = await response.json();
        setDiscount(data.discountPercentage);
      } else {
        console.error('Invalid promo code');
      }
    } catch (error) {
      console.error('Failed to apply promo code', error);
    }
  };

  const handleQuantityChange = (productId: string, quantity: string) => {
    const sanitizedQuantity = quantity.replace(/^0+(?!$)/, '');
    if (sanitizedQuantity === '' || (Number(sanitizedQuantity) >= 1 && !isNaN(Number(sanitizedQuantity)))) {
      updateCartItemQuantity(productId, Number(sanitizedQuantity));
    }
  };

  const totalItemsPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const totalDiscount = (totalItemsPrice * discount) / 100;
  const totalPriceAfterDiscount = totalItemsPrice - totalDiscount;
  const tax = totalPriceAfterDiscount * 0.1; // Example tax rate
  const shippingCost = 0; // Flat rate for simplicity
  const estimatedTotal = totalPriceAfterDiscount + shippingCost + tax;

  return (
    <div className={styles.cartContainer}>
      <div className={styles.cartGrid}>
        {cart.map((item) => (
          <div key={item.productId} className={styles.cartItem}>
            <Image src={item.imageUrl} alt={item.name} width={100} height={100} />
            <div className={styles.itemDetails}>
              <label className={styles.product_name} htmlFor="product-name">Productname</label>
              <p className={styles.productName}>{item.name}</p>
            </div>
           
            <div className={styles.itemPricing}>
              <div>            
              <label className={styles.product_name} htmlFor="price">Price</label>
              <p>${item.price.toFixed(2)}</p>
              </div>
              <div className={styles.quantityControls}>
                <button onClick={() => updateCartItemQuantity(item.productId, item.quantity - 1)} className={styles.removeButton}>-</button>
                <input
                  className={styles.how_quantity}
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => handleQuantityChange(item.productId, e.target.value)}
                />
                <button onClick={() => updateCartItemQuantity(item.productId, item.quantity + 1)} className={styles.addButton}>+</button>
              </div>
              <p>${(item.price * item.quantity).toFixed(2)}</p>
              <button onClick={() => removeFromCart(item.productId)} className={styles.removeCartItemButton}>Remove</button>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.cartSummary}>
        <div className={styles.promoCodeSection}>
          <input 
            type="text" 
            placeholder="Promo Code" 
            value={promoCode} 
            onChange={(e) => setPromoCode(e.target.value)} 
            className={styles.promoCodeInput} 
          />
          <button onClick={handlePromoCodeSubmit} className={styles.promoCodeButton}>Submit</button>
        </div>
        
        <div className={styles.priceBreakdown}>
          <p>SHIPPING COST: ${shippingCost.toFixed(2)}</p>
          <p>DISCOUNT: -${totalDiscount.toFixed(2)}</p>
          <p>TAX: ${tax.toFixed(2)}</p> {/* Tax calculation */}
          <p>ESTIMATED TOTAL: ${estimatedTotal.toFixed(2)}</p>
        </div>
        
        <button className={styles.checkoutButton}>CHECKOUT</button>
      </div>
    </div>
  );
}
