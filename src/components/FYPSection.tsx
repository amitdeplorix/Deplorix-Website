import { ArrowRight, BookOpen, CheckCircle2, Code2, Compass, Presentation, Sparkles } from "lucide-react";
import AnimatedSection from "./AnimatedSection";
import { Button } from "@/components/ui/button";
import { openInquiry } from "@/lib/inquiry";

const supportLevels = [
  {
    name: "Guided",
    ideal: "For students who have started and need expert direction",
    timeline: "2 mentorship sessions",
    features: ["Topic and scope review", "Architecture guidance", "Code and documentation review"],
  },
  {
    name: "Build Together",
    ideal: "For teams that want structured weekly support",
    timeline: "Weekly milestones",
    features: ["Development guidance", "Documentation support", "Deployment and presentation prep"],
  },
  {
    name: "End-to-End",
    ideal: "For ambitious projects needing complete project support",
    timeline: "From proposal to viva",
    features: ["Advanced stack guidance", "Research and testing support", "Mock viva and post-submission help"],
  },
];

const outcomes = [
  { icon: Compass, label: "A clear, feasible scope" },
  { icon: Code2, label: "Original, explainable code" },
  { icon: BookOpen, label: "University-ready documentation" },
  { icon: Presentation, label: "A confident final presentation" },
];

const FYPSection = () => {
  const startPlan = (plan: string) => {
    openInquiry("projects", {
      service: `${plan} final-year project support`,
      message: `I'm interested in the ${plan} support level for my final-year project. Please help me understand the right scope and next steps.`,
    });
  };

  return (
    <section id="fyp" className="section-padding bg-background">
      <div className="site-container">
        <AnimatedSection className="grid gap-8 lg:grid-cols-[.88fr_1.12fr] lg:gap-12">
          <div className="relative overflow-hidden rounded-[2rem] bg-brand-gradient p-7 text-white shadow-[var(--shadow-brand)] sm:p-9 md:rounded-[2.5rem] lg:p-11">
            <div className="absolute inset-0 bg-grid opacity-20" aria-hidden />
            <div className="absolute -bottom-24 -right-20 h-64 w-64 rounded-full bg-white/20 blur-3xl" aria-hidden />
            <div className="relative">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.12em] text-white/80">
                <Sparkles size={13} /> For students
              </span>
              <h2 className="mt-7 font-display text-4xl font-bold leading-[1.02] tracking-[-0.045em] text-white md:text-5xl">
                Build a project you can actually defend.
              </h2>
              <p className="mt-5 max-w-lg text-base leading-7 text-white/70">
                Thoughtful mentorship for final-year teams—from choosing the right problem to explaining every decision during your viva.
              </p>

              <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                {outcomes.map((outcome) => (
                  <div key={outcome.label} className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/15"><outcome.icon size={17} /></span>
                    <p className="text-sm font-semibold text-white/90">{outcome.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="min-w-0 rounded-[2rem] border border-border/70 bg-card p-6 shadow-[var(--shadow-soft)] sm:p-8 md:rounded-[2.5rem] md:p-10">
            <p className="text-xs font-bold uppercase tracking-[0.13em] text-muted-foreground">Choose your level of support</p>
            <div className="-mx-1 mt-6 flex w-full max-w-full snap-x snap-mandatory gap-4 overflow-x-auto px-1 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:mx-0 lg:block lg:overflow-visible lg:p-0">
              {supportLevels.map((level, index) => (
                <div key={level.name} className="group grid w-[88%] shrink-0 snap-start gap-5 rounded-2xl border border-border/70 bg-secondary/35 p-5 sm:w-[72%] lg:w-auto lg:min-w-0 lg:grid-cols-[1fr_auto] lg:items-center lg:rounded-none lg:border-x-0 lg:border-b-0 lg:border-t lg:bg-transparent lg:px-0 lg:py-7 lg:first:border-t-0 lg:first:pt-0 lg:last:pb-0">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="font-display text-xs font-bold text-brand">0{index + 1}</span>
                      <h3 className="font-display text-2xl font-bold tracking-tight text-foreground">{level.name}</h3>
                    </div>
                    <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">{level.ideal}</p>
                    <p className="mt-3 inline-flex rounded-full bg-brand-soft px-3 py-1 text-xs font-bold text-accent-foreground">{level.timeline}</p>
                    <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                      {level.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2 text-xs leading-5 text-muted-foreground">
                          <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-brand" /> {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Button variant={index === 1 ? "brand" : "hero-outline"} className="min-h-11 w-full md:w-auto" onClick={() => startPlan(level.name)}>
                    Discuss this option <ArrowRight size={15} />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default FYPSection;
