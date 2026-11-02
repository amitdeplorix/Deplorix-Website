import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Seo from "@/components/Seo";

const sections = [
  {
    title: "1. Introduction",
    content:
      "Welcome to DeploriX Technologies. These Terms and Conditions govern your use of our website, products, and services. By accessing or using our services, you agree to be bound by these terms. If you do not agree, please do not use our services.",
  },
  {
    title: "2. Services",
    content:
      "DeploriX Technologies provides web development, app development, UI/UX design, digital marketing, social media marketing, and related technology services. We reserve the right to modify, suspend, or discontinue any service at any time without prior notice.",
  },
  {
    title: "3. Client Obligations",
    content:
      "Clients must provide accurate information, timely feedback, and necessary assets required for project completion. Delays caused by the client may affect project timelines and deliverables. Clients are responsible for reviewing and approving deliverables within the agreed timeframe.",
  },
  {
    title: "4. Payment Terms",
    content:
      "All payments must be made as per the agreed milestones outlined in the project proposal or contract. Late payments may incur additional charges. Work will not commence or continue until outstanding payments are settled. All fees are non-refundable unless otherwise stated in a written agreement.",
  },
  {
    title: "5. Intellectual Property",
    content:
      "Upon full payment, the client receives ownership of the final deliverables as specified in the project agreement. DeploriX Technologies retains the right to showcase completed projects in our portfolio unless a non-disclosure agreement (NDA) is in place. Any pre-existing frameworks, libraries, or tools used remain the property of their respective owners.",
  },
  {
    title: "6. Confidentiality",
    content:
      "Both parties agree to keep confidential any proprietary or sensitive information shared during the course of the project. This obligation survives the termination of the agreement. We will not share your data with third parties without your explicit consent, except as required by law.",
  },
  {
    title: "7. Project Timelines",
    content:
      "Estimated timelines are provided in good faith based on the project scope. However, timelines may be adjusted due to scope changes, client delays, or unforeseen technical challenges. Any changes to the project scope may result in revised timelines and additional costs.",
  },
  {
    title: "8. Limitation of Liability",
    content:
      "DeploriX Technologies shall not be liable for any indirect, incidental, or consequential damages arising from the use of our services, including but not limited to loss of data, revenue, or business opportunities. Our total liability shall not exceed the total fees paid by the client for the specific project in question.",
  },
  {
    title: "9. Termination",
    content:
      "Either party may terminate the agreement with 15 days' written notice. In the event of termination, the client shall pay for all work completed up to the termination date. Any deposits or advance payments are non-refundable unless otherwise agreed in writing.",
  },
  {
    title: "10. Warranty & Support",
    content:
      "We provide a 30-day post-delivery warranty for bug fixes related to the original project scope. Additional feature requests, modifications, or enhancements beyond the original scope will be billed separately. Extended support and maintenance packages are available upon request.",
  },
  {
    title: "11. Third-Party Services",
    content:
      "Our projects may integrate with third-party services, APIs, or platforms. DeploriX Technologies is not responsible for any downtime, changes, or issues caused by third-party providers. Clients are responsible for maintaining their own accounts and subscriptions with third-party services.",
  },
  {
    title: "12. Privacy & Data Protection",
    content:
      "We are committed to protecting your personal data. Any information collected through our website or during project engagement is handled in accordance with applicable data protection laws. We do not sell or rent personal information to third parties.",
  },
  {
    title: "13. Dispute Resolution",
    content:
      "Any disputes arising from these terms shall first be resolved through good-faith negotiation. If unresolved, disputes will be subject to arbitration or mediation in the jurisdiction where DeploriX Technologies is registered. Both parties agree to attempt resolution before pursuing legal action.",
  },
  {
    title: "14. Modifications to Terms",
    content:
      "DeploriX Technologies reserves the right to update these Terms and Conditions at any time. Changes will be posted on our website and take effect immediately. Continued use of our services after modifications constitutes acceptance of the updated terms.",
  },
  {
    title: "15. Contact Information",
    content:
      "For any questions regarding these Terms and Conditions, please contact us at deplorixtechnologies@gmail.com. We aim to respond to all inquiries within 2 business days.",
  },
];

const BASE_URL = "https://deplorixtechnologies.site";

const TermsAndConditions = () => {
  return (
    <div className="min-h-screen bg-background">
      <Seo
        title="Terms & Conditions | DeploriX Technologies"
        description="Review the terms and conditions for DeploriX Technologies software development, student projects, digital services, and BPS."
        canonical={`${BASE_URL}/terms`}
      />
      <Navbar />
      <main className="pt-28 md:pt-36 pb-20 max-w-4xl mx-auto px-6 md:px-12">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-10"
        >
          <ArrowLeft size={16} />
          Back to Home
        </Link>

        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
          Terms & Conditions
        </h1>
        <p className="mt-4 text-muted-foreground">
          Last revised: October 2026 · Effective immediately
        </p>

        <div className="mt-12 space-y-10">
          {sections.map((section) => (
            <div key={section.title} className="rounded-2xl border border-border/40 bg-card/60 p-6 md:p-8">
              <h2 className="text-xl font-semibold text-foreground mb-3">{section.title}</h2>
              <p className="text-muted-foreground leading-relaxed">{section.content}</p>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TermsAndConditions;
