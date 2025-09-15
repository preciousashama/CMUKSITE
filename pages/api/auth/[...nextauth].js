import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { TypeORMAdapter } from "@auth/typeorm-adapter";
import { Pool } from "pg";
import bcrypt from "bcrypt";
import cors from "../../../lib/cors";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const authHandler = async (req, res) => {
  await cors(req, res); // ✅ Apply CORS

  return await NextAuth(req, res, {
    adapter: TypeORMAdapter(process.env.DATABASE_URL),

    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      }),

      CredentialsProvider({
        name: "Credentials",
        credentials: {
          email: { label: "Email", type: "text" },
          password: { label: "Password", type: "password" },
        },
        async authorize(credentials) {
          const { email, password } = credentials;

          try {
            const result = await pool.query(
              'SELECT id, name, email, password, "emailVerified" AS emailverified FROM users WHERE email = $1',
              [email]
            );

            if (result.rows.length === 0) {
              return null;
            }

            const user = result.rows[0];

            const isValid = await bcrypt.compare(password, user.password);
            if (!isValid) {
              return null;
            }

            if (!user.emailverified) {
              throw new Error("Please verify your email before logging in.");
            }

            return {
              id: user.id.toString(),
              name: user.name,
              email: user.email,
            };
          } catch (err) {
            console.error("Login error:", err);
            throw new Error(err.message || "Login failed");
          }
        },
      }),
    ],

    pages: {
      signIn: "/login",
    },

    session: {
      strategy: "jwt",
    },

    callbacks: {
      async session({ session, user }) {
        // Attach full user info to session
        if (user) {
          session.user.id = user.id;
          session.user.name = user.name;
          session.user.email = user.email;
        }
        return session;
      },
    },
  });
};

export default authHandler;
