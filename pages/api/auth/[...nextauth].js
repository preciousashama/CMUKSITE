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
              "SELECT * FROM users WHERE email = $1",
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

            return {
              id: user.id.toString(),
              name: user.name,
              email: user.email,
            };
          } catch (err) {
            console.error("Login error:", err);
            return null;
          }
        },
      }),
    ],

    pages: {
      signIn: "/login-page",
    },

    session: {
      strategy: "database",
    },
  });
};

export default authHandler;
