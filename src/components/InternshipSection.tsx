import { useState } from "react";
import { ArrowRight, Briefcase, CheckCircle2, Code2, GitBranch, Presentation, Users } from "lucide-react";
import AnimatedSection from "./AnimatedSection";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import internshipImg from "@/assets/internship.jpg";

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

const InternshipSection = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", college: "" });

  const handleApply = (event: React.FormEvent) => {
    event.preventDefault();
    const subject = encodeURIComponent("Internship Application - DeploriX Technologies");
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone}\nCollege: ${form.college}\n\nPlease attach your latest resume before sending this email.`
    );
    window.location.href = `mailto:deplorixtechnologies@gmail.com?subject=${subject}&body=${body}`;
    setDialogOpen(false);
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

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl">Apply for the internship</DialogTitle>
            <DialogDescription>
              Share your details. Your email app will open with everything prepared; attach your resume before sending.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleApply} className="mt-3 space-y-4">
            <div>
              <Label htmlFor="intern-name">Full name</Label>
              <Input id="intern-name" required autoComplete="name" placeholder="Your full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="intern-email">Email address</Label>
              <Input id="intern-email" required autoComplete="email" type="email" placeholder="you@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="intern-phone">Phone number</Label>
              <Input id="intern-phone" required autoComplete="tel" type="tel" placeholder="+91 XXXXX XXXXX" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="intern-college">College name</Label>
              <Input id="intern-college" required placeholder="Your college name" value={form.college} onChange={(e) => setForm({ ...form, college: e.target.value })} />
            </div>
            <div className="rounded-2xl bg-brand-soft p-4 text-xs leading-5 text-accent-foreground">
              Keep your latest PDF resume ready. You’ll attach it when your email app opens.
            </div>
            <Button type="submit" variant="brand" className="h-12 w-full">
              Continue to email <ArrowRight size={16} />
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default InternshipSection;
