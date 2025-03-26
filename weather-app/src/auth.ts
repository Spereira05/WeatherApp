import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import clientPromise from "@/lib/db/mongodb"

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  console.error("Missing Google OAuth credentials in environment variables");
}

console.log("Auth.ts: Configuring NextAuth");
console.log("Google Client ID exists:", !!process.env.GOOGLE_CLIENT_ID);
console.log("Google Client Secret exists:", !!process.env.GOOGLE_CLIENT_SECRET);

let adapter;
try {
  adapter = MongoDBAdapter(clientPromise, {
    databaseName: "weatherapp1"
  });
  console.log("MongoDB adapter created successfully");
} catch (error) {
  console.error("MongoDB Adapter initialization error:", error);
  adapter = undefined;
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET, 
    })
  ],
  adapter: adapter,
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    session: async ({ session, user }) => {
      if (session?.user && user?.id) {
        session.user.id = user.id;
      }
      return session;
    },
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },
  debug: process.env.NODE_ENV === 'development',
  logger: {
    error(code, metadata) {
      console.error(`NextAuth Error [${code}]:`, metadata);
    },
    warn(code) {
      console.warn(`NextAuth Warning [${code}]`);
    },
    debug(code, metadata) {
      console.log(`NextAuth Debug [${code}]:`, metadata);
    },
  },
});

