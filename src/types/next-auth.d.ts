import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      role: "ADMIN" | "CONTRIBUTOR";
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: "ADMIN" | "CONTRIBUTOR";
  }
}
