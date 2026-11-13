/**
 * MongoDB Data Model for DeploriX
 * Contains ONLY the Service Inquiry Form model (from p-6 sm:p-9 lg:p-10).
 * All other models have been removed.
 */

export const InquiryModel = {
  collection: "inquiries",
  description: "Stores inquiries submitted from the main service inquiry form.",
  fields: {
    division: { type: "String", required: true, example: "tech" },
    name: { type: "String", required: true, example: "John Doe" },
    email: { type: "String", required: true, example: "john@example.com" },
    phone: { type: "String", required: true, example: "+91 9876543210" },
    message: { type: "String", required: true, example: "Need a high-performance web platform." },
    createdAt: { type: "Date", default: "Date.now" },
  },
};

export const models = {
  inquiries: InquiryModel,
};

export default models;
