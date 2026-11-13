import AnimatedSection from "./AnimatedSection";
import { Zap, Shield, Users, CheckCircle2 } from "lucide-react";
import StudioSystemScene from "./StudioSystemScene";

const features = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "We ship at speed without compromising quality. Agile processes, rapid iteration.",
  },
  {
    icon: Shield,
    title: "Built to Scale",
    description: "Production-grade architecture from day one. Your product grows with your business.",
  },
  {
    icon: Users,
    title: "Human-Centred",
    description: "Every screen serves a purpose. We design experiences people genuinely enjoy.",
  },
];

const AboutSection = () => {
  return (
    <section id="solutions" className="section-padding relative overflow-hidden">
      <div className="absolute right-[-12rem] top-24 h-80 w-80 rounded-full bg-brand/10 blur-3xl" aria-hidden />
      <div className="site-container relative">
        <div className="grid items-center gap-14 lg:grid-cols-[.9fr_1.1fr] lg:gap-24">
          <AnimatedSection>
            <span className="pill-label">Why DeploriX</span>
            <h2 className="section-heading mt-6">
              Senior thinking without the agency drag.
            </h2>
            <p className="section-copy mt-6 max-w-xl">
              We bring product strategy, thoughtful design and reliable engineering into one accountable team—so decisions are faster and launches feel calmer.
            </p>
            <ul className="mt-8 grid gap-3 text-sm font-semibold text-foreground/80 sm:grid-cols-2">
              {["Bangalore-based team", "Fixed milestones & timelines", "Post-launch support", "Real client projects"].map(
                (item) => (
                  <li key={item} className="flex items-center gap-2 rounded-xl border border-border/60 bg-card px-3.5 py-3 shadow-[var(--shadow-soft)]">
                    <CheckCircle2 size={16} className="shrink-0 text-brand" /> {item}
                  </li>
                )
              )}
            </ul>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <StudioSystemScene />
          </AnimatedSection>
        </div>

        <div className="mt-20 grid gap-5 md:grid-cols-3">
          {features.map((feature, i) => (
            <AnimatedSection key={feature.title} delay={i * 0.12}>
              <div className="card-soft group h-full p-7 hover-lift md:p-8">
                <div className="mb-8 flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent transition-transform duration-300 group-hover:scale-105">
                  <feature.icon size={22} className="text-accent-foreground" />
                  </div>
                  <span className="font-display text-sm font-bold text-muted-foreground/50">0{i + 1}</span>
                </div>
                <h3 className="mb-2 text-xl font-bold text-foreground">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
