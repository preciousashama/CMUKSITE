import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { TypeORMAdapter } from "@auth/typeorm-adapter";
import bcrypt from "bcrypt";

// 1. Centralized Auth Options (Better for Reusability)
export const authOptions = {
  // Use the adapter consistently for all providers
  adapter: TypeORMAdapter(process.env.DATABASE_URL),
  
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      // Google requires no manual DB query; the Adapter handles it!
    }),

    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        // RECOVERY: Using a standard fetch or internal API call is safer than 
        // managing a separate PG Pool here. If using TypeORM, use the entity manager.
        // For now, we'll assume a clean fetch from your DB.
        const res = await fetch(`${process.env.NEXTAUTH_URL}/api/user/verify`, {
          method: 'POST',
          body: JSON.stringify(credentials),
          headers: { "Content-Type": "application/json" }
        });

        const user = await res.json();

        if (res.ok && user) {
          return user; // Should return { id, name, email }
        }
        
        return null;
      },
    }),
  ],

  // 2. Security & Strategy
  session: {
    strategy: "jwt", // Fast, doesn't require a DB lookup on every page load
    maxAge: 30 * 24 * 60 * 60, // 30 Days
  },

  secret: process.env.NEXTAUTH_SECRET,

  pages: {
    signIn: "/login",
    error: "/login", // Redirect back to login on failure
  },

  // 3. The "Data Pipeline" (Crucial Fix)
  callbacks: {
    // Transfers data from the Database/Authorize to the Token
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
    // Transfers data from the Token to the Session (what you see in useSession)
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.email = token.email;
      }
      return session;
    },
  },

  // 4. Debugging (Only in development)
  debug: process.env.NODE_ENV === "development",
};

export default NextAuth(authOptions);