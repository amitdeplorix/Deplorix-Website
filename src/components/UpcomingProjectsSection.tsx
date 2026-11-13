import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import AnimatedSection from "./AnimatedSection";
import { Calendar, Landmark, Truck, Users } from "lucide-react";

const upcomingProjects = [
  {
    icon: Calendar,
    title: "Collevnto",
    subtitle: "College Event Management Platform",
    description:
      "A comprehensive platform designed to help colleges conduct events seamlessly — from planning and promotion to ticket generation, attendee management, and post-event analytics. Everything your institution needs in one place.",
    tags: ["Event Management", "Ticketing", "Analytics"],
    bg: "bg-secondary",
    iconBg: "bg-accent",
  },
  {
    icon: Truck,
    title: "TruckBook",
    subtitle: "Truck Booking App",
    description:
      "A smart logistics solution that connects shippers with truck owners. Book trucks on-demand, track shipments in real time, and manage freight operations with ease — built for speed and reliability.",
    tags: ["Logistics", "Booking", "Real-time Tracking"],
    bg: "bg-secondary",
    iconBg: "bg-accent",
  },
  {
    icon: Landmark,
    title: "LocalBank",
    subtitle: "Local Banking Management App",
    description:
      "A modern banking management application tailored for local and community banks. Manage accounts, transactions, loans, and customer records with a secure, intuitive interface designed for efficiency.",
    tags: ["FinTech", "Banking", "Security"],
    bg: "bg-secondary",
    iconBg: "bg-accent",
  },
  {
    icon: Users,
    title: "WorkSpher",
    subtitle: "Employee Management Application",
    description:
      "An all-in-one employee management app for tracking attendance, managing payroll, handling leave requests, and monitoring performance — empowering HR teams and managers to work smarter.",
    tags: ["HR Tech", "Payroll", "Performance"],
    bg: "bg-secondary",
    iconBg: "bg-accent",
  },
];

const UpcomingProjectsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="upcoming" className="section-padding bg-surface-elevated" ref={ref}>
      <div className="site-container grid gap-12 lg:grid-cols-[.72fr_1.28fr] lg:gap-20">
        <AnimatedSection className="lg:sticky lg:top-28 lg:self-start">
          <span className="pill-label">Product pipeline</span>
          <h2 className="section-heading mt-6">What we’re building next.</h2>
          <p className="section-copy mt-6 max-w-md">
            Four focused products moving from validated problem to working release—each designed around a clear operational need.
          </p>
          <div className="mt-9 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-40" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-brand" />
            </span>
            Active development pipeline
          </div>
        </AnimatedSection>

        <div className="overflow-hidden rounded-[2rem] border border-border/70 bg-card shadow-[var(--shadow-soft)]">
          {upcomingProjects.map((project, index) => (
            <motion.article
              key={project.title}
              initial={{ opacity: 0, x: 24 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="group grid gap-5 border-b border-border/70 p-6 last:border-b-0 sm:grid-cols-[auto_1fr] md:grid-cols-[auto_1fr_auto] md:items-start md:gap-7 md:p-8"
            >
              <div className="flex items-center gap-4 sm:block">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-soft text-accent-foreground transition-transform duration-300 group-hover:-rotate-3 group-hover:scale-105">
                  <project.icon size={21} />
                </span>
                <span className="ml-auto font-display text-xs font-bold text-muted-foreground/45 sm:mt-4 sm:block sm:text-center">
                  0{index + 1}
                </span>
              </div>

              <div>
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <h3 className="font-display text-xl font-bold tracking-tight text-foreground md:text-2xl">{project.title}</h3>
                  <p className="text-sm font-medium text-muted-foreground">{project.subtitle}</p>
                </div>
                <p className="mt-3 line-clamp-3 max-w-2xl text-sm leading-6 text-muted-foreground md:line-clamp-none md:text-base md:leading-7">{project.description}</p>
                <div className="mt-5 flex flex-wrap gap-2 md:hidden">
                  {project.tags.map((tag) => (
                    <span key={tag} className="rounded-full border border-border/70 bg-secondary/60 px-3 py-1 text-[11px] font-semibold text-muted-foreground">{tag}</span>
                  ))}
                </div>
              </div>

              <div className="hidden max-w-[180px] flex-wrap justify-end gap-2 md:flex">
                {project.tags.map((tag) => (
                  <span key={tag} className="rounded-full border border-border/70 bg-secondary/60 px-3 py-1 text-[11px] font-semibold text-muted-foreground">{tag}</span>
                ))}
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UpcomingProjectsSection;
