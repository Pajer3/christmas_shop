"use client";
import Link from "next/link";

export default function Page() {
    return (
        <main>
            <h1>Page</h1>
        <Link href={"/account"}>here</Link>
        </main>
    );
}
