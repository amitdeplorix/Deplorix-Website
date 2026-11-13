import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { getDb, saveInquiry, saveInternshipApplication, getInquiries } from "./db.js";
import {
  prepareInternshipApplication,
  publicInternshipError,
  sendInternshipApplicationEmail,
} from "./internship-email.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));

// Health check endpoint
app.get("/api/health", async (req, res) => {
  try {
    const db = await getDb();
    await db.command({ ping: 1 });
    res.json({ status: "ok", database: "connected" });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

// Service Inquiry Form Endpoint (p-6 sm:p-9 lg:p-10)
app.post("/api/inquiry", async (req, res) => {
  try {
    const { name, email, phone, message, division } = req.body;

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

    res.status(201).json({ success: true, message: "Inquiry saved successfully", id: saved.id, data: saved });
  } catch (err) {
    console.error("Error saving inquiry to MongoDB:", err);
    res.status(500).json({ error: "Failed to save inquiry to database", details: err.message });
  }
});

app.post("/api/internship", async (req, res) => {
  try {
    const prepared = prepareInternshipApplication(req.body || {});
    if (prepared.isSpam) {
      return res.status(201).json({ success: true, message: "Application received" });
    }

    const email = await sendInternshipApplicationEmail(prepared.application, prepared.resume);
    let savedId = null;
    try {
      const saved = await saveInternshipApplication({
        ...prepared.application,
        resumeName: prepared.resume.name,
        resumeType: prepared.resume.type,
        resumeSize: prepared.resume.size,
        emailId: email.id,
      });
      savedId = saved.id;
    } catch (databaseError) {
      console.error("Internship application emailed but database logging failed:", databaseError);
    }

    res.status(201).json({
      success: true,
      message: "Application emailed successfully",
      emailId: email.id,
      id: savedId,
    });
  } catch (error) {
    console.error("Error emailing internship application:", error);
    const response = publicInternshipError(error);
    res.status(response.statusCode).json(response.body);
  }
});

app.get("/api/inquiries", async (req, res) => {
  try {
    const data = await getInquiries();
    res.json({ success: true, count: data.length, data });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch inquiries", details: err.message });
  }
});

// Serve static build in production
const distPath = path.resolve(__dirname, "../dist");
app.use(express.static(distPath));

app.get("*", (req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

app.listen(port, () => {
  console.log(`🚀 DeploriX Server running at http://localhost:${port}`);
  console.log(`📡 MongoDB Connected: /api/inquiry`);
});
