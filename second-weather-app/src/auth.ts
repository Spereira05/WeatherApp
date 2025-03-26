import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import clientPromise from "@/lib/db/mongodb"

let adapter;
try {
  adapter = MongoDBAdapter(clientPromise, {
    databaseName: "weatherapp1"
  });
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
  callbacks: {
    session: async ({ session, user }) => {
      if (session?.user && user?.id) {
        session.user.id = user.id;
      }
      return session;
    },
  },
  debug: process.env.NODE_ENV === 'development',
  logger: {
    error: (code, metadata) => {
      console.error(`NextAuth Error [${code}]`, metadata);
    },
    warn: (code) => {
      console.warn(`NextAuth Warning: ${code}`);
    },
    debug: (code, metadata) => {
      console.log(`NextAuth Debug [${code}]:`, metadata);
    }
  }
})

