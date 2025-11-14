import { MAX_AGE } from "@/lib/session/constants";
import NextAuth from "next-auth";
import type { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET || "secret",
  providers: [
    {
      id: "anonymous",
      name: "Anonymous",
      type: "credentials",
      credentials: {},
      async authorize() {
        // Generate and return a unique anonymous user object
        const guid = crypto.randomUUID();
        return {
          id: guid,
        };
      },
    },
  ],
  session: {
    strategy: "jwt", // Use JWT so no DB is needed unless you want to persist
    maxAge: MAX_AGE,
    updateAge: 24 * 60 * 60, // 24 hours
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user?.id) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        id: token.id,
      };
      return session;
    },
  },
  pages: {
    signIn: "/",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
