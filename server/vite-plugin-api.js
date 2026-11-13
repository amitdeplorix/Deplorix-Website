import { getDb, saveInquiry } from "./db.js";

function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 5 * 1024 * 1024) {
        req.destroy();
        reject(new Error("Payload too large"));
      }
    });
    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        reject(e);
      }
    });
    req.on("error", reject);
  });
}

function sendJson(res, statusCode, data) {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(data));
}

export function apiMiddlewarePlugin() {
  return {
    name: "vite-plugin-mongodb-api",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url ? req.url.split("?")[0] : "";

        if (!url.startsWith("/api/")) {
          return next();
        }

        // Enable CORS
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

        if (req.method === "OPTIONS") {
          res.statusCode = 204;
          return res.end();
        }

        try {
          if (url === "/api/health" && req.method === "GET") {
            const db = await getDb();
            await db.command({ ping: 1 });
            return sendJson(res, 200, { status: "ok", database: "connected" });
          }

          // ONLY the Service Inquiry Form (from p-6 sm:p-9 lg:p-10) is handled
          if (url === "/api/inquiry" && req.method === "POST") {
            const body = await parseJsonBody(req);
            const { name, email, phone, message, division } = body;

            if (!name || !email || !phone || !message) {
              return sendJson(res, 400, {
                error: "Missing required fields (name, email, phone, message)",
              });
            }

            const saved = await saveInquiry({
              division: division || "tech",
              name: name.trim(),
              email: email.trim().toLowerCase(),
              phone: phone.trim(),
              message: message.trim(),
            });

            return sendJson(res, 201, {
              success: true,
              message: "Inquiry saved successfully",
              id: saved.id,
              data: saved,
            });
          }

          sendJson(res, 404, { error: "API route not found" });
        } catch (err) {
          console.error("API error:", err);
          sendJson(res, 500, { error: "Internal server error", details: err.message });
        }
      });
    },
  };
}
