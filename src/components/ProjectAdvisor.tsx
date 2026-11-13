import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Loader2, Sparkle, RefreshCw } from "lucide-react";
import AnimatedSection from "./AnimatedSection";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { divisions, getDivision } from "@/data/divisions";
import { type } from "@/lib/typography";
import { trackEvent } from "@/lib/analytics";
import { openInquiry } from "@/lib/inquiry";
import { setServiceContext } from "@/lib/service-context";

type Brief = {
  divisionId: string;
  divisionReason: string;
  recommendedServices: { title: string; why: string }[];
  goals: string[];
  scope: string[];
  phases: { name: string; detail: string; duration: string }[];
  timeline: string;
  nextStep: string;
  briefText: string;
};

const audiences = ["Business", "Startup", "Student", "Institution"];
const budgets = ["Under ₹25k", "₹25k – ₹1L", "₹1L – ₹5L", "Above ₹5L", "Not sure yet"];
const timelines = ["ASAP", "2–4 weeks", "1–3 months", "Flexible"];
const examplePrompts = [
  "Launch an MVP for my startup",
  "Grow my local business online",
  "Plan my final-year AI project",
];

const Chips = ({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) => (
  <div>
    <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-white/60">{label}</p>
    <div className="mt-2 flex flex-wrap gap-2">
      {options.map((o) => {
        const active = value === o;
        return (
          <button
            key={o}
            type="button"
            onClick={() => onChange(active ? "" : o)}
            aria-pressed={active}
            className={`min-h-11 rounded-full border px-3.5 py-2 text-xs font-bold transition-colors duration-200 ${
              active
                ? "border-white bg-white text-foreground"
                : "border-white/15 bg-white/[0.04] text-white/70 hover:border-white/30 hover:text-white"
            }`}
          >
            {o}
          </button>
        );
      })}
    </div>
  </div>
);

const ProjectAdvisor = () => {
  const [description, setDescription] = useState("");
  const [audience, setAudience] = useState("");
  const [budget, setBudget] = useState("");
  const [timeline, setTimeline] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [brief, setBrief] = useState<Brief | null>(null);

  const division = brief ? getDivision(brief.divisionId) ?? divisions[0] : null;

  const generate = async () => {
    if (description.trim().length < 20) {
      setError("Please describe your project in at least 20 characters.");
      return;
    }
    setLoading(true);
    setError(null);
    setBrief(null);
    trackEvent("advisor_generate", { audience, budget, timeline });

    try {
      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/project-advisor`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ description, audience, budget, timeline }),
        }
      );
      const data = await res.json();
      if (!res.ok || data.error) {
        setError(data.error ?? "We couldn't generate your brief just now. Please try again.");
        return;
      }
      setBrief(data.brief as Brief);
      const d = getDivision(data.brief.divisionId);
      if (d) {
        setServiceContext({
          divisionId: d.id,
          service: data.brief.recommendedServices?.[0]?.title,
        });
      }
      trackEvent("advisor_result", { division: data.brief.divisionId });
    } catch {
      setError("We couldn't reach the advisor. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const sendAsRequest = () => {
    if (!brief || !division) return;
    trackEvent("advisor_send_request", { division: division.id });
    openInquiry(division.id, {
      service: brief.recommendedServices[0]?.title,
      message: brief.briefText,
    });
  };

  return (
    <section id="advisor" className="section-padding scroll-mt-28 bg-background">
      <div className="site-container">
        <AnimatedSection className="grid gap-7 md:grid-cols-[.9fr_1.1fr] md:items-end">
          <div>
            <span className={type.eyebrow}>AI project advisor</span>
            <h2 className="section-heading mt-6">Turn a rough idea into a useful starting plan.</h2>
          </div>
          <p className="section-copy max-w-xl md:justify-self-end">
            Describe the outcome you want. We’ll match the right DeploriX division, outline the likely scope and prepare a brief you can send to the team.
          </p>
        </AnimatedSection>

        <AnimatedSection className="mt-12">
          <div className="relative overflow-hidden rounded-[2rem] bg-foreground p-6 text-white shadow-[var(--shadow-elevated)] md:rounded-[2.5rem] md:p-10 lg:p-12">
            <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-brand/25 blur-3xl" aria-hidden />
            <div className="absolute inset-0 bg-grid opacity-[0.08]" aria-hidden />
            <div className="relative">
            <div role="status" aria-live="polite" className="sr-only">
              {loading ? "Building your project brief." : brief ? "Your project recommendation is ready." : ""}
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-white/60">Your prompt</p>
                <Label htmlFor="advisor-input" className="mt-1 block font-display text-xl font-bold text-white md:text-2xl">
              What do you need?
                </Label>
              </div>
              <p className="text-xs text-white/60">Be specific about the user, goal and timeline.</p>
            </div>
            <Textarea
              id="advisor-input"
              rows={5}
              maxLength={1200}
              className="mt-4 min-h-[150px] border-white/10 bg-white/[0.07] text-base text-white shadow-none placeholder:text-white/50 hover:border-white/20 focus-visible:border-[#a98bff] focus-visible:ring-[#a98bff]/20"
              placeholder="e.g. We run a dental clinic in Bangalore and want an online booking site with reminders, plus help getting found on Google."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="mr-1 text-[10px] font-bold uppercase tracking-[0.12em] text-white/55">Try an example</span>
              {examplePrompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => setDescription(prompt)}
                  className="min-h-11 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-white/70 transition-colors hover:border-white/25 hover:text-white"
                >
                  {prompt}
                </button>
              ))}
            </div>

            <div className="mt-8 grid gap-6 border-t border-white/10 pt-7 sm:grid-cols-3">
              <Chips label="You are" options={audiences} value={audience} onChange={setAudience} />
              <Chips label="Budget" options={budgets} value={budget} onChange={setBudget} />
              <Chips label="Timeline" options={timelines} value={timeline} onChange={setTimeline} />
            </div>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Button
                variant="brand"
                size="lg"
                onClick={generate}
                disabled={loading}
                className="h-12 rounded-full px-6"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Building your brief…
                  </>
                ) : (
                  <>
                    <Sparkle size={16} /> Get my recommendation
                  </>
                )}
              </Button>
              {brief && !loading && (
                <Button variant="ghost" onClick={generate} className="rounded-full text-white/65 hover:bg-white/10 hover:text-white">
                  <RefreshCw size={14} /> Try again
                </Button>
              )}
            </div>

            {error && (
              <p role="alert" className="mt-4 text-sm text-[#ff9d9d]">
                {error}
              </p>
            )}

            {loading && (
              <div className="mt-8 space-y-3" aria-hidden>
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="h-3 rounded-full bg-white/10 animate-pulse"
                    style={{ width: `${90 - i * 18}%` }}
                  />
                ))}
              </div>
            )}

            <AnimatePresence>
              {brief && division && (
                <motion.div
                  role="region"
                  aria-label="AI project recommendation"
                  aria-live="polite"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className={`mt-9 rounded-3xl p-6 text-foreground md:p-8 ${division.bg}`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-12 h-12 rounded-2xl ${division.iconBg} flex items-center justify-center shrink-0`}
                    >
                      <division.icon size={22} className="text-foreground" />
                    </div>
                    <div>
                      <p className={type.caption}>Best fit</p>
                      <h3 className={`mt-1 ${type.displayMd}`}>{division.name}</h3>
                      <p className={`mt-2 ${type.body}`}>{brief.divisionReason}</p>
                    </div>
                  </div>

                  <div className="mt-6 grid md:grid-cols-2 gap-4">
                    {brief.recommendedServices?.map((s) => (
                      <div
                        key={s.title}
                        className="rounded-2xl bg-background/70 border border-border/40 p-5"
                      >
                        <p className={type.headingSm}>{s.title}</p>
                        <p className={`mt-1.5 ${type.bodySm}`}>{s.why}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 grid md:grid-cols-2 gap-6">
                    <div>
                      <p className={type.headingXs}>Goals</p>
                      <ul className={`mt-2 space-y-1.5 ${type.bodySm}`}>
                        {brief.goals?.map((g) => (
                          <li key={g} className="flex gap-2">
                            <span className="text-foreground">—</span>
                            <span>{g}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className={type.headingXs}>Suggested scope</p>
                      <ul className={`mt-2 space-y-1.5 ${type.bodySm}`}>
                        {brief.scope?.map((s) => (
                          <li key={s} className="flex gap-2">
                            <span className="text-foreground">—</span>
                            <span>{s}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-6">
                    <p className={type.headingXs}>How we'd run it</p>
                    <div className="mt-3 grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      {brief.phases?.map((p, i) => (
                        <div
                          key={p.name}
                          className="rounded-2xl bg-background/70 border border-border/40 p-4"
                        >
                          <p className={type.caption}>Phase {i + 1}</p>
                          <p className={`mt-1 ${type.headingSm}`}>{p.name}</p>
                          <p className={`mt-1 ${type.bodySm}`}>{p.detail}</p>
                          <p className="mt-2 text-xs font-semibold text-foreground">{p.duration}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-3">
                    <div>
                      <p className={type.caption}>Estimated timeline</p>
                      <p className={`mt-1 ${type.headingSm}`}>{brief.timeline}</p>
                    </div>
                    <div className="max-w-md">
                      <p className={type.caption}>Next step</p>
                      <p className={`mt-1 ${type.bodySm}`}>{brief.nextStep}</p>
                    </div>
                  </div>

                  <div className="mt-8 flex flex-col sm:flex-row gap-3">
                    <Button size="lg" onClick={sendAsRequest} className="rounded-full gap-2 font-semibold">
                      Send this as my request <ArrowRight size={16} />
                    </Button>
                    <Button
                      asChild
                      size="lg"
                      variant="outline"
                      className="rounded-full font-semibold bg-background/70"
                    >
                      <Link
                        to={`/work/${division.id}`}
                        onClick={() => trackEvent("advisor_work_click", { division: division.id })}
                      >
                        See relevant work
                      </Link>
                    </Button>
                  </div>

                  <p className="mt-4 text-xs text-muted-foreground">
                    This recommendation is AI-generated from our real service list. A human from the
                    team confirms scope and timelines before anything starts.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default ProjectAdvisor;
