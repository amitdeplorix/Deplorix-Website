const MAX_RESUME_BYTES = 2 * 1024 * 1024;
const DEFAULT_RECIPIENT = "deplorixtechnologies@gmail.com";
const DEFAULT_SENDER = "DeploriX Careers <onboarding@resend.dev>";

function createHttpError(message, statusCode, code) {
  const error = new Error(message);
  error.statusCode = statusCode;
  error.code = code;
  return error;
}

function requiredText(value, label, maxLength) {
  if (typeof value !== "string" || !value.trim()) {
    throw createHttpError(`${label} is required`, 400, "VALIDATION_ERROR");
  }
  const text = value.trim();
  if (text.length > maxLength) {
    throw createHttpError(`${label} is too long`, 400, "VALIDATION_ERROR");
  }
  return text;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function normalizeBase64(value) {
  if (typeof value !== "string" || !value.trim()) {
    throw createHttpError("A PDF resume is required", 400, "VALIDATION_ERROR");
  }

  const data = value.includes(",") ? value.slice(value.indexOf(",") + 1) : value;
  const normalized = data.replace(/\s/g, "");
  if (!normalized || !/^[A-Za-z0-9+/]+={0,2}$/.test(normalized)) {
    throw createHttpError("Resume data is invalid", 400, "VALIDATION_ERROR");
  }
  return normalized;
}

export function prepareInternshipApplication(payload) {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    throw createHttpError("Invalid application payload", 400, "VALIDATION_ERROR");
  }

  // Honeypot field: accept silently so bots do not learn how they were detected.
  if (typeof payload.website === "string" && payload.website.trim()) {
    return { isSpam: true };
  }

  const name = requiredText(payload.name, "Full name", 120).replace(/\s+/g, " ");
  const email = requiredText(payload.email, "Email address", 254).toLowerCase();
  const phone = requiredText(payload.phone, "Phone number", 24).replace(/\s+/g, " ");
  const college = requiredText(payload.college, "College name", 180).replace(/\s+/g, " ");

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw createHttpError("Enter a valid email address", 400, "VALIDATION_ERROR");
  }
  if (!/^[+]?[-\d\s()]{8,24}$/.test(phone)) {
    throw createHttpError("Enter a valid phone number", 400, "VALIDATION_ERROR");
  }

  const resumeInput = payload.resume;
  if (!resumeInput || typeof resumeInput !== "object" || Array.isArray(resumeInput)) {
    throw createHttpError("A PDF resume is required", 400, "VALIDATION_ERROR");
  }

  const originalName = requiredText(resumeInput.name, "Resume file name", 180);
  const mimeType = requiredText(resumeInput.type, "Resume file type", 80).toLowerCase();
  if (!originalName.toLowerCase().endsWith(".pdf") || mimeType !== "application/pdf") {
    throw createHttpError("Resume must be a PDF file", 400, "VALIDATION_ERROR");
  }

  const base64 = normalizeBase64(resumeInput.data);
  const resumeBuffer = Buffer.from(base64, "base64");
  if (!resumeBuffer.length || resumeBuffer.length > MAX_RESUME_BYTES) {
    throw createHttpError("Resume must be 2 MB or smaller", 400, "VALIDATION_ERROR");
  }
  if (resumeBuffer.subarray(0, 5).toString("ascii") !== "%PDF-") {
    throw createHttpError("Resume must be a valid PDF file", 400, "VALIDATION_ERROR");
  }

  const safeFileName = originalName.replace(/[^a-zA-Z0-9._ -]/g, "_");
  return {
    isSpam: false,
    application: { name, email, phone, college },
    resume: {
      name: safeFileName,
      type: "application/pdf",
      data: base64,
      size: resumeBuffer.length,
    },
  };
}

export async function sendInternshipApplicationEmail(application, resume) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw createHttpError(
      "Internship email delivery is not configured",
      503,
      "EMAIL_NOT_CONFIGURED",
    );
  }

  const recipients = (process.env.INTERNSHIP_TO_EMAIL || DEFAULT_RECIPIENT)
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
  const from = process.env.INTERNSHIP_FROM_EMAIL || DEFAULT_SENDER;
  const name = escapeHtml(application.name);
  const email = escapeHtml(application.email);
  const phone = escapeHtml(application.phone);
  const college = escapeHtml(application.college);

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: recipients,
      reply_to: application.email,
      subject: `Internship application — ${application.name} — ${application.college}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto;color:#17151f">
          <div style="background:#17151f;color:#fff;padding:24px 28px;border-radius:18px 18px 0 0">
            <p style="margin:0 0 8px;font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:#b9a8ff">DeploriX Careers</p>
            <h1 style="margin:0;font-size:24px">New internship application</h1>
          </div>
          <div style="border:1px solid #e5e1ed;border-top:0;padding:28px;border-radius:0 0 18px 18px">
            <table style="width:100%;border-collapse:collapse;font-size:15px">
              <tr><td style="padding:9px 0;color:#6d6878;width:120px">Name</td><td style="padding:9px 0;font-weight:700">${name}</td></tr>
              <tr><td style="padding:9px 0;color:#6d6878">Email</td><td style="padding:9px 0"><a href="mailto:${email}" style="color:#7347ee">${email}</a></td></tr>
              <tr><td style="padding:9px 0;color:#6d6878">Phone</td><td style="padding:9px 0"><a href="tel:${phone}" style="color:#7347ee">${phone}</a></td></tr>
              <tr><td style="padding:9px 0;color:#6d6878">College</td><td style="padding:9px 0">${college}</td></tr>
            </table>
            <p style="margin:22px 0 0;padding:14px 16px;background:#f6f2ff;border-radius:12px;font-size:13px;color:#514b5c">The applicant's PDF resume is attached to this email. Replying will respond directly to the applicant.</p>
          </div>
        </div>
      `,
      text: [
        "New DeploriX internship application",
        `Name: ${application.name}`,
        `Email: ${application.email}`,
        `Phone: ${application.phone}`,
        `College: ${application.college}`,
        "",
        "The applicant's PDF resume is attached.",
      ].join("\n"),
      attachments: [{ filename: resume.name, content: resume.data }],
    }),
  });

  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = createHttpError(
      "Email delivery failed. Please try again shortly.",
      502,
      "EMAIL_DELIVERY_FAILED",
    );
    error.providerStatus = response.status;
    error.providerMessage = result?.message;
    throw error;
  }

  return { id: result.id };
}

export function publicInternshipError(error) {
  const statusCode = Number.isInteger(error?.statusCode) ? error.statusCode : 500;
  const safeMessage =
    statusCode >= 500
      ? error?.code === "EMAIL_NOT_CONFIGURED"
        ? "Application email delivery is not configured yet. Please contact DeploriX directly."
        : "We could not email your application just now. Please try again shortly."
      : error.message;
  return { statusCode, body: { error: safeMessage, code: error?.code || "INTERNAL_ERROR" } };
}
