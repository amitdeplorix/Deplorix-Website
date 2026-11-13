import { getDb } from "./_db.js";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  try {
    const db = await getDb();
    await db.command({ ping: 1 });
    return res.status(200).json({ status: "ok", database: "connected" });
  } catch (err) {
    return res.status(500).json({ status: "error", message: err.message });
  }
}
