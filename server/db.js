import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME || "deplorix";

if (!uri) {
  console.warn("⚠️ MONGODB_URI is not set in environment variables.");
}

let client;
let clientPromise;

export async function getDb() {
  if (!uri) {
    throw new Error("MONGODB_URI is not set in environment variables.");
  }

  if (!client) {
    client = new MongoClient(uri, {
      maxPoolSize: 10,
    });
    clientPromise = client.connect();
  }

  await clientPromise;
  return client.db(dbName);
}

/**
 * Saves an inquiry submitted from the main service inquiry form.
 * Required parts only: division, name, email, phone, message.
 */
export async function saveInquiry(data) {
  const db = await getDb();
  const collection = db.collection("inquiries");
  const doc = {
    division: data.division || "tech",
    name: data.name.trim(),
    email: data.email.trim().toLowerCase(),
    phone: data.phone.trim(),
    message: data.message.trim(),
    createdAt: new Date(),
  };
  const result = await collection.insertOne(doc);
  return { id: result.insertedId, ...doc };
}

export async function getInquiries(limit = 100) {
  const db = await getDb();
  const collection = db.collection("inquiries");
  return collection.find({}).sort({ createdAt: -1 }).limit(limit).toArray();
}
