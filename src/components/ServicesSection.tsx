import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import AnimatedSection from "./AnimatedSection";
import { Button } from "@/components/ui/button";
import { divisions } from "@/data/divisions";
import { divisionExtras } from "@/data/division-extras";
import { openInquiry } from "@/lib/inquiry";
import { trackEvent } from "@/lib/analytics";
import { setServiceContext } from "@/lib/service-context";

const ServicesSection = () => {
  const [activeId, setActiveId] = useState(divisions[0].id);
  const active = divisions.find((division) => division.id === activeId) ?? divisions[0];
  const extras = divisionExtras[active.id];

  const selectDivision = (divisionId: string) => {
    setActiveId(divisionId);
    setServiceContext({ divisionId });
    trackEvent("division_selector_click", { division: divisionId, location: "services_section" });
  };

  const startInquiry = () => {
    trackEvent("proof_block_cta_click", { division: active.id, location: "division_cta" });
    openInquiry(active.id);
  };

  return (
    <section id="products" className="section-padding bg-surface-elevated">
      <div className="site-container">
        <AnimatedSection className="grid gap-7 md:grid-cols-[.9fr_1.1fr] md:items-end">
          <div>
            <span className="pill-label">Specialist divisions</span>
            <h2 className="section-heading mt-6">One partner. Five ways to move forward.</h2>
          </div>
          <p className="section-copy max-w-xl md:justify-self-end">
            Pick the team that matches your goal. Every division shares the same product thinking, delivery standards and senior oversight.
          </p>
        </AnimatedSection>

        <div className="mt-12 grid min-w-0 gap-5 lg:grid-cols-[260px_minmax(0,1fr)]">
          <AnimatedSection className="min-w-0">
            <div className="-mx-5 flex max-w-[calc(100%+2.5rem)] gap-2 overflow-x-auto px-5 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:mx-0 lg:grid lg:max-w-none lg:overflow-visible lg:p-0">
              {divisions.map((division, index) => {
                const selected = division.id === activeId;
                return (
                  <button
                    key={division.id}
                    type="button"
                    onClick={() => selectDivision(division.id)}
                    aria-pressed={selected}
                    className={`group flex min-w-max items-center gap-3 rounded-2xl border px-4 py-3.5 text-left transition-all duration-200 lg:min-w-0 ${
                      selected
                        ? "border-foreground bg-foreground text-background shadow-[var(--shadow-card)]"
                        : "border-border/70 bg-card text-foreground hover:border-foreground/20"
                    }`}
                  >
                    <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${selected ? "bg-white/10" : division.iconBg}`}>
                      <division.icon size={17} />
                    </span>
                    <span className="min-w-0">
                      <span className={`block text-[10px] font-bold uppercase tracking-[0.12em] ${selected ? "text-white/65" : "text-muted-foreground"}`}>0{index + 1}</span>
                      <span className="block text-sm font-bold">{division.short}</span>
                    </span>
                    {selected && <ArrowRight size={15} className="ml-auto hidden text-white/60 lg:block" />}
                  </button>
                );
              })}
            </div>
          </AnimatedSection>

          <AnimatePresence mode="wait">
            <motion.article
              key={active.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className={`min-w-0 overflow-hidden rounded-[2rem] border border-border/50 ${active.bg} md:rounded-[2.5rem]`}
            >
              <div className="grid lg:grid-cols-[1.08fr_.92fr]">
                <div className="p-6 sm:p-8 md:p-10 lg:p-12">
                  <div className={`grid h-14 w-14 place-items-center rounded-2xl ${active.iconBg}`}>
                    <active.icon size={24} />
                  </div>
                  <p className="mt-8 text-xs font-bold uppercase tracking-[0.13em] text-muted-foreground">{active.name}</p>
                  <h3 className="mt-2 max-w-xl font-display text-3xl font-bold leading-tight tracking-[-0.04em] text-foreground md:text-4xl">
                    {active.tagline}
                  </h3>
                  <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground">{active.blurb}</p>

                  <div className="mt-8 grid gap-3 sm:grid-cols-2">
                    {active.subServices.slice(0, 4).map((service) => (
                      <button
                        key={service.title}
                        type="button"
                        onClick={() => {
                          setServiceContext({ divisionId: active.id, service: service.title });
                          openInquiry(active.id, { service: service.title });
                        }}
                        aria-label={`Ask about ${service.title}`}
                        className="group rounded-2xl border border-border/50 bg-background/70 p-4 text-left transition-all hover:-translate-y-0.5 hover:border-brand/25 hover:bg-background"
                      >
                        <span className="flex items-start justify-between gap-3">
                          <span className="text-sm font-bold text-foreground">{service.title}</span>
                          <ArrowRight size={14} className="mt-0.5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                        </span>
                        <span className="mt-1.5 block text-xs leading-5 text-muted-foreground">{service.summary}</span>
                      </button>
                    ))}
                  </div>

                  <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                    <Button variant="hero" className="h-11 px-6" onClick={startInquiry}>
                      {active.ctaLabel} <ArrowRight size={15} />
                    </Button>
                    <Button asChild variant="hero-outline" className="h-11 px-6">
                      <Link to={`/work/${active.id}`} onClick={() => trackEvent("proof_block_cta_click", { division: active.id, location: "services_work_link" })}>
                        See relevant work
                      </Link>
                    </Button>
                  </div>
                </div>

                <div className="bg-foreground p-6 text-white sm:p-8 md:p-10 lg:p-12">
                  <p className="text-xs font-bold uppercase tracking-[0.13em] text-white/60">Proof, not promises</p>
                  {extras && (
                    <>
                      <div className="mt-7 grid grid-cols-3 gap-2 border-b border-white/10 pb-8">
                        {extras.metrics.map((metric) => (
                          <div key={metric.label}>
                            <p className="font-display text-xl font-extrabold tracking-tight text-white md:text-2xl">{metric.value}</p>
                            <p className="mt-1 text-[11px] leading-4 text-white/65">{metric.label}</p>
                          </div>
                        ))}
                      </div>

                      <blockquote className="py-8">
                        <p className="font-display text-xl font-semibold leading-8 tracking-[-0.025em] text-white/90">“{extras.testimonial.quote}”</p>
                        <footer className="mt-5 text-xs text-white/65">
                          <span className="font-bold text-white/70">{extras.testimonial.author}</span> · {extras.testimonial.role}
                        </footer>
                      </blockquote>
                    </>
                  )}

                  <div className="mt-auto border-t border-white/10 pt-7">
                    <p className="text-xs font-bold uppercase tracking-[0.13em] text-white/60">Representative work</p>
                    <div className="mt-4 space-y-3">
                      {active.work.slice(0, 2).map((work) => (
                        <div key={work.title} className="flex items-start gap-3">
                          <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-[#a98bff]" />
                          <div>
                            <p className="text-sm font-bold text-white">{work.title}</p>
                            <p className="mt-0.5 text-xs leading-5 text-white/65">{work.note}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.article>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
