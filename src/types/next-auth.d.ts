import NextAuth from "next-auth";

declare module "next-auth" {
export interface User {
  id: string;
  email: string;
  firstName: string;
  phone: string;
  role: string;
  lastName: string;
}

  interface Session {
    user: {
      id: string;
      email: string;
      role: string; // Add role to the Session's user type
    };
  }

  interface JWT {
    role: string; // Add role to the JWT type
  }
}
