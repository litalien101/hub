import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import { ADMIN_EMAILS, CONTRIBUTOR_EMAILS } from "@/lib/env";

function roleForEmail(email: string): "ADMIN" | "CONTRIBUTOR" {
  const e = email.toLowerCase();
  if (ADMIN_EMAILS.includes(e)) return "ADMIN";
  if (CONTRIBUTOR_EMAILS.includes(e)) return "CONTRIBUTOR";
  // default: contributor (local dev convenience)
  return "CONTRIBUTOR";
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Email",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "you@guardianoverride.com" }
      },
      async authorize(credentials) {
        const email = (credentials?.email ?? "").trim().toLowerCase();
        if (!email || !email.includes("@")) return null;

        const role = roleForEmail(email);

        const user = await prisma.user.upsert({
          where: { email },
          create: { email, role },
          update: { role }
        });

        return { id: user.id, email: user.email, name: user.email, role: user.role };
      }
    })
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.sub = String(user.id ?? token.sub);
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.email = String(token.email ?? session.user.email ?? "");
        session.user.role = (token as any).role ?? "CONTRIBUTOR";
        session.user.id = token.sub ?? "";
      }
      return session;
    }
  },
  pages: {
    signIn: "/login"
  }
};
