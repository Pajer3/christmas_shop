"use client"
import CartPageComponent from '@/components/cartpage';

export default function CartPage() {
    return (
        <main>
            <CartPageComponent />
            <style jsx>{`
                main {
                    height: 100%;
                }
            `}</style>
        </main>
    )
}