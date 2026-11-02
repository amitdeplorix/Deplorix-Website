import { useEffect, useState } from "react";
import { z } from "zod";
import AnimatedSection from "./AnimatedSection";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2 } from "lucide-react";
import { divisions } from "@/data/divisions";
import { type } from "@/lib/typography";
import { trackEvent } from "@/lib/analytics";
import { INQUIRY_EVENT, type InquiryDetail, getPendingInquiry, openInquiry } from "@/lib/inquiry";

export { openInquiry, INQUIRY_EVENT, type InquiryDetail };

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

  const handleSubmit = (e: React.FormEvent) => {
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

    const subject = encodeURIComponent(`Enquiry — ${topicFor(divisionId)}`);
    const body = encodeURIComponent(
      [
        `Division: ${topicFor(divisionId)}`,
        `Name: ${data.name}`,
        `Email: ${data.email}`,
        `Phone: ${data.phone}`,
        "",
        "Details:",
        data.message,
        "",
        `Expected follow-up: ${followUpFor(divisionId)}`,
      ].join("\n")
    );
    window.location.href = `mailto:deplorixtechnologies@gmail.com?subject=${subject}&body=${body}`;
    window.setTimeout(() => setSubmitting(false), 1500);
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
      <div
        id="service-inquiry"
        className="scroll-mt-28 mt-16 max-w-4xl mx-auto rounded-3xl bg-background border border-border/50 p-8 md:p-10"
      >
        <h3 className={type.displayMd}>Tell us what you need</h3>
        <p className={`mt-3 ${type.body}`}>
          Pick a division and we'll route your request to the right team.{" "}
          <span className="text-foreground font-medium">{followUpFor(divisionId)}</span>
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          {divisions.map((d) => {
            const isActive = d.id === divisionId;
            return (
              <button
                key={d.id}
                type="button"
                onClick={() => {
                  setDivisionId(d.id);
                  trackEvent("division_selector_click", { division: d.id, location: "inquiry_form" });
                }}
                className={`rounded-full px-4 py-2 transition-colors duration-300 border ${
                  isActive
                    ? `bg-foreground text-background border-transparent ${type.pillActive}`
                    : `text-muted-foreground hover:text-foreground border-border/60 ${type.pillIdle}`
                }`}
              >
                {d.short}
              </button>
            );
          })}
        </div>

        <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
          <div>
            <Label htmlFor="inq-topic" className={type.label}>Inquiry topic</Label>
            <Input id="inq-topic" value={topicFor(divisionId)} readOnly className="mt-1.5 bg-secondary/60" />
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <Label htmlFor="inq-name" className={type.label}>Full name</Label>
              <Input
                id="inq-name"
                placeholder="Your full name"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                {...fieldProps("name")}
              />
              {errorText("name")}
            </div>
            <div>
              <Label htmlFor="inq-email" className={type.label}>Email address</Label>
              <Input
                id="inq-email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                {...fieldProps("email")}
              />
              {errorText("email")}
            </div>
          </div>
          <div>
            <Label htmlFor="inq-phone" className={type.label}>Phone number</Label>
            <Input
              id="inq-phone"
              type="tel"
              placeholder="+91 XXXXX XXXXX"
              value={form.phone}
              onChange={(e) => update("phone", e.target.value)}
              {...fieldProps("phone")}
            />
            {errorText("phone")}
          </div>
          <div>
            <Label htmlFor="inq-message" className={type.label}>What do you need?</Label>
            <Textarea
              id="inq-message"
              rows={4}
              maxLength={1000}
              placeholder="A short description of your requirement, timeline and budget range."
              value={form.message}
              onChange={(e) => update("message", e.target.value)}
              {...fieldProps("message")}
            />
            <div className="flex justify-between gap-4">
              {errorText("message") ?? <span />}
              <p className="mt-1.5 text-xs text-muted-foreground">{form.message.length}/1000</p>
            </div>
          </div>

          {/* Pre-submit summary */}
          <div className="rounded-2xl bg-secondary/50 border border-border/40 p-5">
            <p className={type.headingXs}>Before you send</p>
            <dl className="mt-3 grid sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
              <div className="flex gap-2">
                <dt className="text-muted-foreground">Division:</dt>
                <dd className="font-semibold text-foreground">{topicFor(divisionId)}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="text-muted-foreground">Reply to:</dt>
                <dd className="font-semibold text-foreground break-all">{form.email || "—"}</dd>
              </div>
              <div className="flex gap-2 sm:col-span-2">
                <dt className="text-muted-foreground">What happens next:</dt>
                <dd className="text-foreground">{followUpFor(divisionId)}</dd>
              </div>
            </dl>
          </div>

          <Button type="submit" size="lg" disabled={submitting} className="rounded-full gap-2 font-semibold">
            {submitting ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Opening your email app…
              </>
            ) : (
              <>
                Send request <ArrowRight size={16} />
              </>
            )}
          </Button>
        </form>
      </div>
    </AnimatedSection>
  );
};

export default ServiceInquiryForm;
