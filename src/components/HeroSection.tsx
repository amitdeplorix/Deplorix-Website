import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import StartProjectDialog from "./StartProjectDialog";
import LogoStrip from "./LogoStrip";
import Hero3DScene from "./Hero3DScene";
import BrandXMark from "./BrandXMark";

const ease = [0.22, 1, 0.36, 1] as const;

const HeroSection = () => {
  const [projectOpen, setProjectOpen] = useState(false);

  return (
    <section className="relative isolate overflow-hidden border-b border-border/60 pt-28 md:pt-36">
      <div className="absolute inset-0 -z-20 bg-glow" aria-hidden />
      <div className="absolute inset-0 -z-10 bg-grid opacity-70" aria-hidden />
      <div className="noise-overlay absolute inset-0 -z-10" aria-hidden />
      <BrandXMark className="absolute -right-40 top-8 -z-10 hidden w-[650px] opacity-[0.08] lg:block" />

      <div className="site-container px-5 pb-14 sm:px-6 md:px-10 md:pb-18 lg:px-16 lg:pb-22">
        <div className="grid items-center gap-2 sm:gap-8 lg:grid-cols-[1.05fr_.95fr] lg:gap-10">
          <div className="relative z-10 max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease }}
              className="pill-label"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-brand" />
              </span>
              Bangalore-based product studio
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.08, ease }}
              className="mt-6 font-display text-[clamp(2.7rem,6.5vw,5.5rem)] font-extrabold leading-[1.02] tracking-[-0.05em] text-foreground"
            >
              We turn bold ideas into
              <span className="text-gradient inline-block pb-1"> products that ship.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.2, ease }}
              className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground md:mt-6 md:text-xl md:leading-8"
            >
              Websites, apps, AI systems, digital growth and student projects—designed, built and supported by one focused team.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.3, ease }}
              className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:items-center"
            >
              <Button
                variant="brand"
                className="h-[52px] w-full px-7 text-[15px] sm:w-auto"
                onClick={() => setProjectOpen(true)}
              >
                Start your project <ArrowRight size={17} />
              </Button>
              <Button
                variant="hero-outline"
                className="h-[52px] w-full px-7 text-[15px] sm:w-auto"
                onClick={() => {
                  document.querySelector("#pricing")?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                See our work
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.46 }}
              className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold text-foreground/75 sm:mt-8"
            >
              {["Clear milestones", "Dedicated support", "Built to scale"].map((item) => (
                <span key={item} className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-brand shrink-0" /> {item}
                </span>
              ))}
            </motion.div>
          </div>

          <Hero3DScene />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.55, ease }}
          className="mt-10 grid grid-cols-2 overflow-hidden rounded-3xl border border-border/70 bg-card/65 shadow-[var(--shadow-soft)] backdrop-blur sm:mt-16 md:mt-20 md:grid-cols-4"
        >
          {[
            ["5", "specialist divisions"],
            ["40+", "products shipped"],
            ["98%", "on-time delivery"],
            ["End-to-end", "strategy to support"],
          ].map(([value, label], index) => (
            <div
              key={label}
              className={`px-4 py-4 sm:px-6 sm:py-5 md:px-7 ${
                index % 2 ? "border-l border-border/70" : ""
              } ${index > 1 ? "border-t border-border/70 md:border-t-0" : ""} ${
                index === 2 ? "md:border-l" : ""
              }`}
            >
              <p className="font-display text-xl font-extrabold tracking-tight text-foreground sm:text-2xl md:text-3xl">
                {value}
              </p>
              <p className="mt-1 text-xs font-medium text-muted-foreground sm:text-sm">{label}</p>
            </div>
          ))}
        </motion.div>
      </div>

      <LogoStrip />

      <StartProjectDialog open={projectOpen} onOpenChange={setProjectOpen} />
    </section>
  );
};

export default HeroSection;
