"use client";  
import { useRouter } from "next/navigation"; 
import SuccessMessage from "@/components/successMessage";

export default function Success() {
  const router = useRouter();
  const message = new URLSearchParams(window.location.search).get("message");

  return (
    <SuccessMessage 
      message={message ? decodeURIComponent(message) : "Registration completed successfully!"} 
    />
  );
}
