/**
 * Client API utilities for submitting the Service Inquiry form to MongoDB.
 */

export type InquiryPayload = {
  division: string;
  name: string;
  email: string;
  phone: string;
  message: string;
};

async function postJson(endpoint: string, payload: unknown) {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || data.message || `Request failed with status ${response.status}`);
  }

  return data;
}

export async function submitInquiry(payload: InquiryPayload) {
  return postJson("/api/inquiry", payload);
}

export async function checkApiHealth() {
  const res = await fetch("/api/health");
  return res.json();
}
