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
    databaseName: "weatherapp"
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
    session: async ({ token, session, user }) => {
      console.log("Session callback - token:", token);
      console.log("Session callback - user:", user);
      
      if (session?.user) {
        session.user.id = token?.id || user?.id;
        console.log("Updated session with user ID:", session.user.id);
      }
      return session;
    },
    jwt: async ({ token, user }) => {
      console.log("JWT callback - user:", user);
      
      if (user?.id) {
        token.id = user.id;
        console.log("Updated token with user ID:", token.id);
      }
      return token;
    },
  },
  debug: process.env.NODE_ENV === 'development' && false,
  logger: {
    error(error) {
      console.error(`NextAuth Error:`, error);
    },
    warn(code) {
      console.warn(`NextAuth Warning [${code}]`);
    },
    debug(code, metadata) {
      console.log(`NextAuth Debug [${code}]:`, metadata);
    },
  },
});

