// next-auth.d.ts
import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    firstName?: string | null;
    email?: string | null;
    phone?: string | null;
    password?: string | null;
    
  }

  interface Session {
    user?: User;
  }
}