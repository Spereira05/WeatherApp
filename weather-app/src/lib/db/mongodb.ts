import { MongoClient } from "mongodb"

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"')
}

const uri = process.env.MONGODB_URI 
const options = {}

let client 
let clientPromise: Promise<MongoClient>

if (typeof process !== 'undefined' && process.env) {
  if (process.env.NODE_ENV === "development") {
    let globalWithMongo = global as typeof globalThis & { _mongoClientPromise?: Promise<MongoClient> }
    if (!globalWithMongo._mongoClientPromise) {
      client = new MongoClient(uri, options)
      globalWithMongo._mongoClientPromise = client.connect()
        .then(client => {
          console.log("MongoDB connected!")
          return client
        })
        .catch(error => {
          console.error("MongoDB connection error:", error)
          throw error
        })
    }
    clientPromise = globalWithMongo._mongoClientPromise
  } else {
     client = new MongoClient(uri, options)
     clientPromise = client.connect()
   }
} else {
  console.warn("MongoDB connection not initialized in Edge Runtime");
  clientPromise = Promise.resolve(null);
}

export default clientPromise