import React from "react";
import Link from "next/link";

interface SuccessMessageProps {
  message: string;
}

export default function SuccessMessage({ message }: SuccessMessageProps) {
  return (
    <div>
      <h2>Success</h2>
      <p>{message}</p>
      <Link href="../login">Login</Link>
    </div>
  );
}
