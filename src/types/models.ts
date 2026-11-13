/**
 * TypeScript Data Model for DeploriX
 * Contains ONLY the Service Inquiry Form model (from p-6 sm:p-9 lg:p-10).
 */

export interface InquiryDocument {
  _id?: string;
  division: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  createdAt?: Date | string;
}
