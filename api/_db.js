import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME || "deplorix";

let cachedClient = null;
let cachedDb = null;

export async function getDb() {
  if (cachedDb) return cachedDb;
  if (!uri) throw new Error("MONGODB_URI environment variable is not defined");

  if (!cachedClient) {
    cachedClient = new MongoClient(uri, {
      maxPoolSize: 10,
    });
    await cachedClient.connect();
  }

  cachedDb = cachedClient.db(dbName);
  return cachedDb;
}

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

export async function saveInternshipApplication(data) {
  const db = await getDb();
  const collection = db.collection("internship_applications");
  const doc = {
    name: data.name.trim(),
    email: data.email.trim().toLowerCase(),
    phone: data.phone.trim(),
    college: data.college.trim(),
    resumeName: data.resumeName,
    resumeType: data.resumeType,
    resumeSize: data.resumeSize,
    emailId: data.emailId || null,
    createdAt: new Date(),
  };
  const result = await collection.insertOne(doc);
  return { id: result.insertedId, ...doc };
}
