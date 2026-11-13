import { ArrowDownRight, CheckCircle2 } from "lucide-react";
import AnimatedSection from "./AnimatedSection";

const steps = [
  { number: "01", title: "Discover", description: "We align on the problem, audience, goals and the smallest valuable first release.", deliverable: "Clear brief + roadmap" },
  { number: "02", title: "Design", description: "Flows, prototypes and visual direction are shaped with fast feedback loops.", deliverable: "Validated product direction" },
  { number: "03", title: "Build", description: "We engineer, integrate and test in focused milestones you can review as we go.", deliverable: "Production-ready release" },
  { number: "04", title: "Launch & grow", description: "We deploy, measure, improve and stay close after the first release goes live.", deliverable: "Support + iteration plan" },
];

const WorkflowSection = () => (
  <section id="process" className="section-padding overflow-hidden bg-foreground text-background">
    <div className="site-container">
      <AnimatedSection className="grid gap-8 md:grid-cols-[.9fr_1.1fr] md:items-end">
        <div>
          <span className="inline-flex rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.12em] text-white/75">
            How we work
          </span>
          <h2 className="mt-6 font-display text-4xl font-bold leading-[1.02] tracking-[-0.045em] text-white md:text-5xl lg:text-6xl">
            A clear path from idea to impact.
          </h2>
        </div>
        <p className="max-w-xl text-base leading-7 text-white/60 md:justify-self-end md:text-lg">
          No black boxes or endless handoffs. You always know what is happening, what comes next and what decisions we need from you.
        </p>
      </AnimatedSection>

      <div className="mt-14 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, index) => (
          <AnimatedSection key={step.number} delay={index * 0.08}>
            <article className="group flex h-full min-h-[280px] flex-col rounded-3xl border border-white/10 bg-white/[0.055] p-6 transition-colors duration-300 hover:bg-white/[0.09] md:p-7">
              <div className="flex items-center justify-between">
                <span className="font-display text-sm font-bold text-white/65">{step.number}</span>
                <ArrowDownRight className="h-5 w-5 text-white/30 transition-transform duration-300 group-hover:translate-x-1 group-hover:translate-y-1 group-hover:text-white" />
              </div>
              <div className="mt-auto pt-14">
                <h3 className="text-2xl font-bold text-white">{step.title}</h3>
                <p className="mt-3 text-sm leading-6 text-white/70">{step.description}</p>
                <p className="mt-6 flex items-center gap-2 border-t border-white/10 pt-4 text-xs font-bold uppercase tracking-[0.1em] text-white/70">
                  <CheckCircle2 size={14} className="text-[#a98bff]" /> {step.deliverable}
                </p>
              </div>
            </article>
          </AnimatedSection>
        ))}
      </div>
    </div>
  </section>
);

export default WorkflowSection;
