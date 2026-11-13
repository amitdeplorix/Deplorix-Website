import { ArrowUpRight, Mail, MessageCircle } from "lucide-react";
import AnimatedSection from "./AnimatedSection";
import ServiceInquiryForm from "./ServiceInquiryForm";

const ContactSection = () => (
  <section id="contact" className="section-padding bg-surface-elevated">
    <div className="site-container">
      <AnimatedSection className="grid gap-7 md:grid-cols-[.9fr_1.1fr] md:items-end">
        <div>
          <span className="pill-label">Get in touch</span>
          <h2 className="section-heading mt-6">A good project starts with a clear conversation.</h2>
        </div>
        <div className="max-w-xl md:justify-self-end">
          <p className="section-copy">
            Share what you are building, where you are stuck, or what you want to learn. We’ll route it to the right team and suggest a useful next step.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <a href="mailto:deplorixtechnologies@gmail.com" className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border bg-card px-4 py-2.5 text-sm font-bold text-foreground shadow-[var(--shadow-soft)] transition-colors hover:bg-secondary">
              <Mail size={15} className="text-brand" /> Email us <ArrowUpRight size={13} />
            </a>
            <a href="https://wa.me/918050536508" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border bg-card px-4 py-2.5 text-sm font-bold text-foreground shadow-[var(--shadow-soft)] transition-colors hover:bg-secondary">
              <MessageCircle size={15} className="text-[#1fbd5c]" /> WhatsApp <ArrowUpRight size={13} />
            </a>
          </div>
        </div>
      </AnimatedSection>

      <ServiceInquiryForm />
    </div>
  </section>
);

export default ContactSection;
