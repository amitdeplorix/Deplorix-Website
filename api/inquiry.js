import { saveInquiry } from "./_db.js";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { name, email, phone, message, division } = req.body || {};

    if (!name || !email || !phone || !message) {
      return res.status(400).json({ error: "Missing required fields (name, email, phone, message)" });
    }

    const saved = await saveInquiry({
      division: division || "tech",
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      message: message.trim(),
    });

    return res.status(201).json({
      success: true,
      message: "Inquiry saved successfully",
      id: saved.id,
      data: saved,
    });
  } catch (err) {
    console.error("Vercel Serverless Error /api/inquiry:", err);
    return res.status(500).json({ error: "Failed to save inquiry to database", details: err.message });
  }
}
