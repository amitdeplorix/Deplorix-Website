import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, CalendarClock, MousePointer2, Plus } from "lucide-react";
import StartProjectDialog from "./StartProjectDialog";
import LogoStrip from "./LogoStrip";

const ease = [0.22, 1, 0.36, 1] as const;

const Avatar = ({ initials, tone = "ink" }: { initials: string; tone?: "ink" | "brand" | "peach" }) => (
  <span
    className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold ring-2 ring-card ${
      tone === "brand"
        ? "bg-brand-gradient text-brand-foreground"
        : tone === "peach"
          ? "bg-peach text-foreground"
          : "bg-primary text-primary-foreground"
    }`}
  >
    {initials}
  </span>
);

const ProgressCard = ({
  initials,
  title,
  started,
  step,
  value,
  tone,
}: {
  initials: string;
  title: string;
  started: string;
  step: string;
  value: number;
  tone?: "ink" | "brand" | "peach";
}) => (
  <div className="float-card w-60 p-4">
    <div className="flex items-center gap-3">
      <Avatar initials={initials} tone={tone} />
      <div className="min-w-0">
        <p className="text-sm font-semibold text-foreground truncate">{title}</p>
        <p className="text-[11px] text-muted-foreground">{started}</p>
      </div>
    </div>
    <p className="mt-3 text-[11px] font-medium text-foreground/80">{step}</p>
    <div className="mt-1.5 h-1.5 w-full rounded-full bg-muted overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 1.4, delay: 0.9, ease }}
        className="h-full rounded-full bg-primary"
      />
    </div>
  </div>
);

const Floating = ({
  children,
  className,
  delay = 0,
  drift = 10,
}: {
  children: React.ReactNode;
  className: string;
  delay?: number;
  drift?: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20, scale: 0.96 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ duration: 0.8, delay, ease }}
    className={`absolute z-20 ${className}`}
  >
    <motion.div
      animate={{ y: [0, -drift, 0] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay }}
    >
      {children}
    </motion.div>
  </motion.div>
);

const HeroSection = () => {
  const [projectOpen, setProjectOpen] = useState(false);

  return (
    <section className="relative overflow-hidden pt-28 md:pt-36">
      {/* Glow + grid background */}
      <div className="absolute inset-0 bg-glow" aria-hidden />
      <div className="absolute inset-x-0 top-10 h-[720px] bg-grid" aria-hidden />
      {[
        "left-[22%] top-[22%]",
        "left-[52%] top-[18%]",
        "right-[22%] top-[44%]",
        "left-[30%] top-[62%]",
      ].map((pos) => (
        <Plus key={pos} size={18} strokeWidth={1.25} className={`absolute ${pos} text-foreground/25 hidden md:block`} aria-hidden />
      ))}

      <div className="relative max-w-7xl mx-auto px-6 md:px-12">
        {/* Floating cards (desktop) */}
        <Floating className="hidden lg:block left-0 top-6" delay={0.5}>
          <ProgressCard
            initials="FF"
            title="FinFlow Dashboard"
            started="Kick-off Mon 12 Oct, 2026"
            step="Sprint 3, Week 2"
            value={68}
          />
        </Floating>
        <Floating className="hidden lg:block right-0 top-2" delay={0.65} drift={14}>
          <ProgressCard
            initials="HT"
            title="HealthTrack Mobile"
            started="Kick-off Tue 20 Oct, 2026"
            step="Beta build, Week 4"
            value={52}
            tone="brand"
          />
        </Floating>
        <Floating className="hidden lg:flex left-6 top-[300px] items-center gap-1" delay={0.8}>
          <div className="flex items-center gap-2.5 rounded-full bg-primary pl-1.5 pr-5 py-1.5 shadow-[var(--shadow-card)]">
            <Avatar initials="DT" tone="peach" />
            <div>
              <p className="text-xs font-semibold text-primary-foreground">Deplorix Tech</p>
              <p className="text-[10px] text-primary-foreground/70">Web & app engineering</p>
            </div>
          </div>
          <MousePointer2 size={18} className="fill-foreground text-foreground -mt-8 ml-1 -rotate-12" />
        </Floating>
        <Floating className="hidden lg:flex right-6 top-[310px] items-center gap-1" delay={0.95}>
          <MousePointer2 size={18} className="fill-brand text-brand -mt-8 mr-1 rotate-[-70deg]" />
          <div className="flex items-center gap-2.5 rounded-full bg-brand-gradient pl-1.5 pr-5 py-1.5 shadow-[var(--shadow-brand)]">
            <Avatar initials="DP" />
            <div>
              <p className="text-xs font-semibold text-brand-foreground">Deplorix Projects</p>
              <p className="text-[10px] text-brand-foreground/80">Final-year mentors</p>
            </div>
          </div>
        </Floating>

        {/* Headline */}
        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <motion.span
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease }}
            className="pill-label"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-brand" />
            Software, AI & digital studio in Bangalore
          </motion.span>

          <div className="relative mt-6">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.1, ease }}
              className="text-[2.6rem] leading-[1.1] sm:text-6xl md:text-7xl font-semibold tracking-tight text-foreground"
            >
              Build. Deploy. Grow.
              <br />
              Software That Ships
              <br />
              <span className="text-ghost">For Startups & Students</span>
              <br />
              In Bangalore.
            </motion.h1>

            {/* Floating appointment card — positioned on the upper-right so it never blocks headline text */}
            <motion.div
              initial={{ opacity: 0, y: 20, rotate: 0 }}
              animate={{ opacity: 1, y: [0, -8, 0], rotate: -4 }}
              transition={{
                opacity: { duration: 0.8, delay: 0.6, ease },
                rotate: { duration: 0.8, delay: 0.6, ease },
                y: { duration: 5, repeat: Infinity, ease: "easeInOut" },
              }}
              className="hidden md:block absolute -right-2 lg:-right-8 top-2 md:top-6 z-20 w-48 text-left select-none pointer-events-none"
              aria-hidden
            >
              <div className="overflow-hidden rounded-2xl border border-white/20 shadow-[var(--shadow-brand)]">
                <div className="bg-brand-gradient p-3.5">
                  <span className="block text-[11px] font-normal text-brand-foreground/85">Scoping call with</span>
                  <span className="block text-base font-semibold text-brand-foreground leading-tight">DeploriX Team</span>
                  <div className="mt-2 flex gap-1.5">
                    <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur">
                      Web App
                    </span>
                    <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur">
                      AI
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 bg-card px-3.5 py-2 text-[12px] font-semibold text-foreground border-t border-border/40 shadow-[var(--shadow-card)]">
                  <CalendarClock size={14} className="text-brand shrink-0" />
                  <span>12:00 PM, 7 Nov</span>
                </div>
              </div>
            </motion.div>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3, ease }}
            className="mt-7 text-base md:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed"
          >
            Five specialist divisions building websites, apps, AI, brands, support teams and
            final-year projects — shipped, documented and supported.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.45, ease }}
            className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <Button
              variant="hero-outline"
              className="h-12 px-7 text-[15px] w-full sm:w-auto"
              onClick={() => document.querySelector("#products")?.scrollIntoView({ behavior: "smooth" })}
            >
              Learn More
            </Button>
            <Button
              variant="hero"
              className="h-12 px-7 text-[15px] gap-2 w-full sm:w-auto"
              onClick={() => setProjectOpen(true)}
            >
              Get Started <ArrowRight size={16} />
            </Button>
          </motion.div>
        </div>
      </div>

      <div className="relative mt-20 md:mt-24">
        <LogoStrip />
      </div>

      <StartProjectDialog open={projectOpen} onOpenChange={setProjectOpen} />
    </section>
  );
};

export default HeroSection;
