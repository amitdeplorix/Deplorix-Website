import { useState } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import AnimatedSection from "./AnimatedSection";
import { Button } from "@/components/ui/button";
import StartProjectDialog from "./StartProjectDialog";

const CTASection = () => {
  const [projectOpen, setProjectOpen] = useState(false);

  return (
    <section className="px-5 py-12 sm:px-6 md:px-10 md:py-20 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <AnimatedSection>
          <div className="relative overflow-hidden rounded-[2rem] bg-brand-gradient px-6 py-14 text-center shadow-[var(--shadow-brand)] md:rounded-[2.5rem] md:px-16 md:py-20">
            <div className="absolute inset-0 bg-grid opacity-25" aria-hidden />
            <div className="noise-overlay absolute inset-0 opacity-[0.06]" aria-hidden />
            <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-white/15 blur-3xl" aria-hidden />

            <div className="relative z-10 mx-auto max-w-3xl">
              <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.12em] text-white/80">Let's build something useful</span>
              <h2 className="mt-6 font-display text-4xl font-bold leading-[1.02] tracking-[-0.045em] text-white md:text-6xl">
                Bring the idea. We'll shape the path to launch.
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-white/70 md:text-lg">
                Tell us what you are trying to achieve and we’ll come back with the right team, scope and next step.
              </p>
              <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
                <Button className="h-12 rounded-full bg-white px-7 text-foreground hover:bg-white/90" onClick={() => setProjectOpen(true)}>
                  Start a Project <ArrowRight size={16} />
                </Button>
                <Button
                  className="h-12 rounded-full border border-white/25 bg-white/10 px-7 text-white shadow-none hover:bg-white/15"
                  onClick={() => (window.location.href = "mailto:deplorixtechnologies@gmail.com?subject=Book a Call")}
                >
                  Book a Call <ArrowUpRight size={16} />
                </Button>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
      <StartProjectDialog open={projectOpen} onOpenChange={setProjectOpen} />
    </section>
  );
};

export default CTASection;
