import { useState } from "react";
import { ArrowRight, Briefcase, CheckCircle2, Code2, GitBranch, Loader2, Presentation, Upload, Users } from "lucide-react";
import AnimatedSection from "./AnimatedSection";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import internshipImg from "@/assets/internship.jpg";
import { submitInternshipApplication } from "@/lib/api";

const journey = [
  {
    number: "01",
    title: "Join a product squad",
    description: "Work alongside developers, designers and testers with clear weekly ownership.",
    icon: Users,
  },
  {
    number: "02",
    title: "Ship real work",
    description: "Contribute to live briefs, product builds and practical review cycles—not tutorial clones.",
    icon: Code2,
  },
  {
    number: "03",
    title: "Leave with proof",
    description: "Turn your contribution into a stronger GitHub, portfolio story and interview narrative.",
    icon: Briefcase,
  },
];

const outcomes = [
  { icon: GitBranch, label: "Git workflow" },
  { icon: Presentation, label: "Demo confidence" },
  { icon: Users, label: "Team communication" },
  { icon: CheckCircle2, label: "Placement readiness" },
];

const MAX_RESUME_BYTES = 2 * 1024 * 1024;

const fileToBase64 = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      const [, data = ""] = result.split(",", 2);
      if (!data) reject(new Error("We couldn't read the selected resume."));
      else resolve(data);
    };
    reader.onerror = () => reject(new Error("We couldn't read the selected resume."));
    reader.readAsDataURL(file);
  });

const InternshipSection = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", college: "", website: "" });
  const [resume, setResume] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleApply = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!resume) {
      setError("Please attach your latest PDF resume.");
      return;
    }
    if (resume.size > MAX_RESUME_BYTES) {
      setError("Your resume must be 2 MB or smaller.");
      return;
    }

    setSubmitting(true);
    try {
      const resumeData = await fileToBase64(resume);
      await submitInternshipApplication({
        ...form,
        resume: {
          name: resume.name,
          type: "application/pdf",
          data: resumeData,
        },
      });
      setSent(true);
      setResume(null);
      setForm({ name: "", email: "", phone: "", college: "", website: "" });
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "We couldn't send your application. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleResume = (file: File | null) => {
    setError(null);
    if (!file) {
      setResume(null);
      return;
    }
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      setResume(null);
      setError("Please choose a PDF resume.");
      return;
    }
    if (file.size > MAX_RESUME_BYTES) {
      setResume(null);
      setError("Your resume must be 2 MB or smaller.");
      return;
    }
    setResume(file);
  };

  return (
    <section id="resources" className="section-padding bg-surface-elevated">
      <div className="site-container">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_.95fr] lg:gap-20">
          <AnimatedSection>
            <div className="relative">
              <div className="absolute -inset-5 rounded-[2.5rem] bg-glow opacity-80 blur-2xl" aria-hidden />
              <div className="relative overflow-hidden rounded-[2rem] border border-white/80 bg-card p-2 shadow-[var(--shadow-elevated)] md:rounded-[2.5rem]">
                <img
                  src={internshipImg}
                  alt="DeploriX interns collaborating on a product project"
                  className="aspect-[4/3] w-full rounded-[1.65rem] object-cover md:rounded-[2.1rem]"
                  loading="lazy"
                  width={1024}
                  height={768}
                />
                <div className="absolute inset-x-6 bottom-6 rounded-2xl border border-white/20 bg-foreground/85 p-4 text-white backdrop-blur-md md:inset-x-8 md:bottom-8 md:p-5">
                  <p className="text-xs font-bold uppercase tracking-[0.13em] text-white/65">The promise</p>
                  <p className="mt-1.5 font-display text-lg font-bold tracking-tight md:text-xl">Work that becomes proof—not just a certificate.</p>
                </div>
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.12}>
            <span className="pill-label">Careers & training</span>
            <h2 className="section-heading mt-6">An internship built around doing the work.</h2>
            <p className="section-copy mt-6 max-w-xl">
              Learn in a working team, get direct feedback and build the habits companies actually expect from early-career talent.
            </p>

            <div className="mt-9 space-y-3">
              {journey.map((step) => (
                <article key={step.number} className="group grid grid-cols-[auto_1fr] gap-4 rounded-2xl border border-border/70 bg-card p-4 shadow-[var(--shadow-soft)] transition-all hover:border-brand/25 md:p-5">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-soft text-accent-foreground"><step.icon size={19} /></span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-brand">{step.number}</span>
                      <h3 className="text-base font-bold text-foreground">{step.title}</h3>
                    </div>
                    <p className="mt-1.5 text-sm leading-6 text-muted-foreground">{step.description}</p>
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-7 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
              {outcomes.map((outcome) => (
                <div key={outcome.label} className="rounded-xl border border-border/60 bg-background px-3 py-3 text-center">
                  <outcome.icon size={16} className="mx-auto text-brand" />
                  <p className="mt-2 text-[11px] font-bold leading-4 text-muted-foreground">{outcome.label}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button variant="brand" className="h-12 px-7" onClick={() => setDialogOpen(true)}>
                Apply for the internship <ArrowRight size={16} />
              </Button>
              <p className="text-xs leading-5 text-muted-foreground">Applications are reviewed on a rolling basis.</p>
            </div>
          </AnimatedSection>
        </div>
      </div>

      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) {
            setError(null);
            setSent(false);
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl">Apply for the internship</DialogTitle>
            <DialogDescription>
              Share your details and PDF resume. Your application is sent directly to the DeploriX careers inbox.
            </DialogDescription>
          </DialogHeader>
          {sent ? (
            <div role="status" aria-live="polite" className="mt-4 rounded-3xl border border-emerald-200 bg-emerald-50 p-6 text-center">
              <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-emerald-100 text-emerald-700">
                <CheckCircle2 size={24} />
              </span>
              <h3 className="mt-4 font-display text-xl font-bold text-foreground">Application sent successfully</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Your details and resume were delivered directly to deplorixtechnologies@gmail.com.
              </p>
              <Button type="button" variant="brand" className="mt-5 h-11 w-full" onClick={() => setDialogOpen(false)}>
                Done
              </Button>
            </div>
          ) : (
          <form onSubmit={handleApply} className="mt-3 space-y-4">
            <div>
              <Label htmlFor="intern-name">Full name</Label>
              <Input id="intern-name" required autoComplete="name" placeholder="Your full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} disabled={submitting} />
            </div>
            <div>
              <Label htmlFor="intern-email">Email address</Label>
              <Input id="intern-email" required autoComplete="email" type="email" placeholder="you@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} disabled={submitting} />
            </div>
            <div>
              <Label htmlFor="intern-phone">Phone number</Label>
              <Input id="intern-phone" required autoComplete="tel" type="tel" placeholder="+91 XXXXX XXXXX" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} disabled={submitting} />
            </div>
            <div>
              <Label htmlFor="intern-college">College name</Label>
              <Input id="intern-college" required placeholder="Your college name" value={form.college} onChange={(e) => setForm({ ...form, college: e.target.value })} disabled={submitting} />
            </div>
            <div>
              <Label htmlFor="intern-resume">Resume (PDF, maximum 2 MB)</Label>
              <label htmlFor="intern-resume" className="mt-2 flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border border-dashed border-border bg-secondary/45 px-4 py-3 text-sm transition-colors hover:border-brand/35 hover:bg-brand-soft">
                <Upload size={18} className="shrink-0 text-brand" />
                <span className="min-w-0 truncate font-semibold text-foreground">
                  {resume ? resume.name : "Choose your PDF resume"}
                </span>
              </label>
              <Input
                id="intern-resume"
                required
                type="file"
                accept="application/pdf,.pdf"
                className="sr-only"
                onChange={(event) => handleResume(event.target.files?.[0] ?? null)}
                disabled={submitting}
              />
            </div>
            <div className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
              <Label htmlFor="intern-website">Website</Label>
              <Input id="intern-website" tabIndex={-1} autoComplete="off" value={form.website} onChange={(event) => setForm({ ...form, website: event.target.value })} />
            </div>
            {error && <p role="alert" className="text-sm font-medium text-destructive">{error}</p>}
            <div className="rounded-2xl bg-brand-soft p-4 text-xs leading-5 text-accent-foreground">
              Your application and resume will be emailed securely to the DeploriX careers team.
            </div>
            <Button type="submit" variant="brand" className="h-12 w-full" disabled={submitting}>
              {submitting ? <><Loader2 size={16} className="animate-spin" /> Sending application…</> : <>Send application <ArrowRight size={16} /></>}
            </Button>
          </form>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default InternshipSection;
