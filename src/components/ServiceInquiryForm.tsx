import { useEffect, useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import AnimatedSection from "./AnimatedSection";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ArrowRight, Clock3, Loader2, MessageSquare, ShieldCheck } from "lucide-react";
import { divisions } from "@/data/divisions";
import { trackEvent } from "@/lib/analytics";
import { INQUIRY_EVENT, type InquiryDetail, getPendingInquiry } from "@/lib/inquiry";
import { submitInquiry } from "@/lib/api";

const topicFor = (divisionId: string) => {
  const d = divisions.find((x) => x.id === divisionId);
  return d ? `${d.name} — ${d.tagline}` : "General enquiry";
};

const followUpFor = (divisionId: string) => {
  switch (divisionId) {
    case "tech":
      return "We'll reply with a scoping call slot and a rough build estimate.";
    case "digital":
      return "We'll reply with a strategy call slot and a sample content plan.";
    case "projects":
      return "We'll reply with project options matched to your syllabus and timeline.";
    case "bps":
      return "We'll reply with a process call slot and a staffing outline.";
    case "training":
      return "We'll reply with the next batch dates and the curriculum outline.";
    default:
      return "We'll reply within one working day.";
  }
};

const inquirySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: "Please enter your full name (at least 2 characters)." })
    .max(100, { message: "Name must be less than 100 characters." }),
  email: z
    .string()
    .trim()
    .email({ message: "Enter a valid email address, e.g. you@example.com." })
    .max(255, { message: "Email must be less than 255 characters." }),
  phone: z
    .string()
    .trim()
    .regex(/^[+]?[\d\s-]{8,18}$/, { message: "Enter a valid phone number (8–18 digits)." }),
  message: z
    .string()
    .trim()
    .min(20, { message: "Tell us a little more — at least 20 characters." })
    .max(1000, { message: "Please keep it under 1000 characters." }),
});

type FormState = z.infer<typeof inquirySchema>;
type FieldErrors = Partial<Record<keyof FormState, string>>;

const ServiceInquiryForm = () => {
  const [divisionId, setDivisionId] = useState(divisions[0].id);
  const [form, setForm] = useState<FormState>({ name: "", email: "", phone: "", message: "" });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof FormState, boolean>>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      const raw = (e as CustomEvent<InquiryDetail | string>).detail;
      const detail: InquiryDetail = typeof raw === "string" ? { divisionId: raw } : raw;
      if (divisions.some((d) => d.id === detail.divisionId)) setDivisionId(detail.divisionId);

      if (detail.message || detail.service) {
        setForm((prev) => ({
          ...prev,
          message:
            detail.message?.slice(0, 1000) ??
            (prev.message.trim()
              ? prev.message
              : `I'm interested in ${detail.service}. Please share how you'd approach this and what it would involve.`),
        }));
        setTouched((prev) => ({ ...prev, message: false }));
        setErrors((prev) => ({ ...prev, message: undefined }));
      }

      document.getElementById("service-inquiry")?.scrollIntoView({ behavior: "smooth", block: "center" });
    };
    window.addEventListener(INQUIRY_EVENT, handler);

    const param = new URLSearchParams(window.location.search).get("division");
    if (param && divisions.some((d) => d.id === param)) {
      setDivisionId(param);
      if (window.location.hash === "#service-inquiry") {
        setTimeout(
          () => document.getElementById("service-inquiry")?.scrollIntoView({ behavior: "smooth", block: "center" }),
          300
        );
      }
    }

    const pending = getPendingInquiry();
    if (pending) {
      setTimeout(() => window.dispatchEvent(new CustomEvent(INQUIRY_EVENT, { detail: pending })), 400);
    }

    return () => window.removeEventListener(INQUIRY_EVENT, handler);
  }, []);

  const validateField = (field: keyof FormState, value: string) => {
    const result = inquirySchema.shape[field].safeParse(value);
    setErrors((prev) => ({ ...prev, [field]: result.success ? undefined : result.error.issues[0].message }));
  };

  const update = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (touched[field]) validateField(field, value);
  };

  const blur = (field: keyof FormState) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validateField(field, form[field]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = inquirySchema.safeParse(form);
    if (!result.success) {
      const next: FieldErrors = {};
      result.error.issues.forEach((issue) => {
        const key = issue.path[0] as keyof FormState;
        if (!next[key]) next[key] = issue.message;
      });
      setErrors(next);
      setTouched({ name: true, email: true, phone: true, message: true });
      document.getElementById(`inq-${Object.keys(next)[0]}`)?.focus();
      return;
    }

    setSubmitting(true);
    const data = result.data;
    trackEvent("inquiry_form_submit", { division: divisionId, topic: topicFor(divisionId) });

    try {
      await submitInquiry({
        division: divisionId,
        name: data.name,
        email: data.email,
        phone: data.phone,
        message: data.message,
      });

      toast.success("Inquiry submitted successfully! Our team will contact you shortly.");
      setForm({ name: "", email: "", phone: "", message: "" });
      setTouched({});
      setErrors({});
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to submit inquiry. Please try again.";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const errorText = (field: keyof FormState) =>
    errors[field] ? (
      <p id={`inq-${field}-error`} role="alert" className="mt-1.5 text-sm text-destructive">
        {errors[field]}
      </p>
    ) : null;

  const fieldProps = (field: keyof FormState) => ({
    "aria-invalid": !!errors[field],
    "aria-describedby": errors[field] ? `inq-${field}-error` : undefined,
    onBlur: () => blur(field),
    className: `mt-1.5 ${errors[field] ? "border-destructive focus-visible:ring-destructive" : ""}`,
  });

  return (
    <AnimatedSection>
      <div id="service-inquiry" className="mx-auto mt-16 max-w-6xl scroll-mt-28 overflow-hidden rounded-[2rem] border border-border/60 bg-background shadow-[var(--shadow-card)] md:rounded-[2.5rem]">
        <div className="grid lg:grid-cols-[.82fr_1.18fr]">
          <aside className="relative overflow-hidden bg-foreground p-7 text-white sm:p-9 lg:p-10">
            <div className="absolute -left-16 -top-16 h-56 w-56 rounded-full bg-brand/20 blur-3xl" aria-hidden />
            <div className="relative">
              <p className="text-xs font-bold uppercase tracking-[0.13em] text-white/60">Start the conversation</p>
              <h3 className="mt-4 font-display text-3xl font-bold leading-tight tracking-[-0.04em] text-white">Tell us where you want to go next.</h3>
              <p className="mt-4 text-sm leading-6 text-white/70">
                Choose the closest-fit division and share enough context for us to make the first reply useful.
              </p>

              <div className="mt-8 space-y-4 border-t border-white/10 pt-7">
                {[
                  { icon: MessageSquare, title: "Right team, first time", text: "Your request is routed to the relevant division." },
                  { icon: Clock3, title: "One working day", text: "We aim to respond with a concrete next step." },
                  { icon: ShieldCheck, title: "No pressure", text: "The first conversation is simply about fit and scope." },
                ].map((item) => (
                  <div key={item.title} className="flex gap-3">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/10 text-[#a98bff]"><item.icon size={16} /></span>
                    <div>
                      <p className="text-sm font-bold text-white">{item.title}</p>
                      <p className="mt-0.5 text-xs leading-5 text-white/60">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.06] p-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-white/55">Selected route</p>
                <p className="mt-1.5 text-sm font-bold text-white">{topicFor(divisionId)}</p>
                <p className="mt-2 text-xs leading-5 text-white/65">{followUpFor(divisionId)}</p>
              </div>
            </div>
          </aside>

          <div className="p-6 sm:p-9 lg:p-10">
            <p className="text-xs font-bold uppercase tracking-[0.13em] text-muted-foreground">What can we help with?</p>
            <div className="-mx-1 mt-4 flex gap-2 overflow-x-auto px-1 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {divisions.map((division) => {
                const isActive = division.id === divisionId;
                return (
                  <button
                    key={division.id}
                    type="button"
                    onClick={() => {
                      setDivisionId(division.id);
                      trackEvent("division_selector_click", { division: division.id, location: "inquiry_form" });
                    }}
                    aria-pressed={isActive}
                    className={`min-w-max rounded-full border px-3.5 py-2 text-xs font-bold transition-colors ${
                      isActive
                        ? "border-foreground bg-foreground text-background"
                        : "border-border bg-card text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {division.short}
                  </button>
                );
              })}
            </div>

            <form onSubmit={handleSubmit} noValidate className="mt-7 space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <Label htmlFor="inq-name">Full name</Label>
                  <Input id="inq-name" autoComplete="name" placeholder="Your full name" value={form.name} onChange={(e) => update("name", e.target.value)} {...fieldProps("name")} />
                  {errorText("name")}
                </div>
                <div>
                  <Label htmlFor="inq-email">Email address</Label>
                  <Input id="inq-email" autoComplete="email" type="email" placeholder="you@example.com" value={form.email} onChange={(e) => update("email", e.target.value)} {...fieldProps("email")} />
                  {errorText("email")}
                </div>
              </div>
              <div>
                <Label htmlFor="inq-phone">Phone number</Label>
                <Input id="inq-phone" autoComplete="tel" type="tel" placeholder="+91 XXXXX XXXXX" value={form.phone} onChange={(e) => update("phone", e.target.value)} {...fieldProps("phone")} />
                {errorText("phone")}
              </div>
              <div>
                <div className="flex items-center justify-between gap-4">
                  <Label htmlFor="inq-message">Your project or requirement</Label>
                  <span className="text-xs text-muted-foreground">{form.message.length}/1000</span>
                </div>
                <Textarea
                  id="inq-message"
                  rows={5}
                  maxLength={1000}
                  placeholder="What are you trying to achieve? Include your audience, timeline and any constraints."
                  value={form.message}
                  onChange={(e) => update("message", e.target.value)}
                  {...fieldProps("message")}
                />
                {errorText("message")}
              </div>

              <div className="flex flex-col gap-3 border-t border-border/70 pt-5 sm:flex-row sm:items-center sm:justify-between">
                <p className="max-w-xs text-xs leading-5 text-muted-foreground">We usually respond within one business day with concrete next steps.</p>
                <Button type="submit" variant="brand" size="lg" disabled={submitting} className="h-12 rounded-full px-6">
                  {submitting ? (
                    <><Loader2 size={16} className="animate-spin" /> Submitting…</>
                  ) : (
                    <>Submit Request <ArrowRight size={16} /></>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
};

export default ServiceInquiryForm;
