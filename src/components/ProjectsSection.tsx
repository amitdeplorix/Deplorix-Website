import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, CheckCircle2, Clock3, Users2 } from "lucide-react";
import AnimatedSection from "./AnimatedSection";
import BrandXMark from "./BrandXMark";
import { caseStudyHref } from "@/data/projects";
import projectWeb from "@/assets/project-finflow-optimized.jpg";
import projectApp from "@/assets/project-healthtrack-optimized.jpg";
import projectDesign from "@/assets/project-educonnect.webp";
import projectEcommerce from "@/assets/project-shopease-optimized.jpg";

const projects = [
  {
    title: "FinFlow Dashboard",
    category: "Web App",
    divisionId: "tech",
    image: projectWeb,
    description: "A comprehensive financial management dashboard designed for businesses to track expenses, revenue, invoices, and generate detailed financial reports in real-time.",
    techStack: ["React.js", "TypeScript", "Node.js", "MongoDB", "Tailwind CSS", "Chart.js", "Express.js", "JWT Auth"],
    duration: "3 Months",
    team: "4 Developers",
    highlights: [
      "Real-time financial analytics with interactive charts and graphs",
      "Automated invoice generation and payment tracking system",
      "Role-based access control for admin, accountant, and viewer roles",
      "Export reports in PDF and Excel formats",
      "Integrated with multiple payment gateways for seamless transactions",
      "Responsive design optimized for desktop and tablet use",
    ],
    process: "We started with in-depth client consultations to understand their financial workflows. The UI/UX was designed in Figma with multiple iterations. Development followed an Agile approach with 2-week sprints. The backend was built with Node.js and MongoDB for scalable data handling. Rigorous testing and QA ensured accuracy in all financial calculations before deployment.",
  },
  {
    title: "HealthTrack Mobile",
    category: "Mobile App",
    divisionId: "tech",
    image: projectApp,
    description: "A health and fitness tracking mobile application that helps users monitor their daily activities, set fitness goals, track nutrition, and connect with health professionals.",
    techStack: ["React Native", "TypeScript", "Firebase", "Redux", "Node.js", "PostgreSQL", "Google Fit API", "Apple HealthKit"],
    duration: "4 Months",
    team: "5 Developers",
    highlights: [
      "Step counter, calorie tracker, and workout logging with detailed analytics",
      "Personalized diet plans and nutrition tracking with barcode scanning",
      "Integration with Google Fit and Apple HealthKit for seamless data sync",
      "Push notifications for medication reminders and fitness goals",
      "In-app chat with certified health professionals",
      "Available on both Android and iOS platforms",
    ],
    process: "Research phase involved studying competitor apps and conducting user surveys. We designed user flows prioritizing simplicity and engagement. React Native was chosen for cross-platform efficiency. Firebase handled real-time data sync and authentication. The app went through extensive beta testing with 200+ users before the final release, incorporating feedback at every stage.",
  },
  {
    title: "EduConnect Platform",
    category: "SaaS",
    divisionId: "projects",
    image: projectDesign,
    description: "A full-featured SaaS platform connecting students, teachers, and institutions for online learning, course management, live classes, and performance tracking.",
    techStack: ["Next.js", "TypeScript", "Prisma", "PostgreSQL", "Tailwind CSS", "WebRTC", "Stripe", "AWS S3"],
    duration: "5 Months",
    team: "6 Developers",
    highlights: [
      "Live video classes with screen sharing and interactive whiteboard",
      "Course creation tools with drag-and-drop content builder",
      "Automated quiz generation and AI-powered grading system",
      "Student performance dashboards with progress analytics",
      "Stripe-integrated subscription and one-time payment models",
      "Multi-tenant architecture supporting multiple institutions",
    ],
    process: "We collaborated closely with educational institutions to understand pain points in online learning. The platform was architected as a multi-tenant SaaS using Next.js for SSR performance. WebRTC powers the live class feature. Prisma ORM with PostgreSQL ensures robust data management. The project followed CI/CD practices with automated testing pipelines for reliable deployments.",
  },
  {
    title: "ShopEase Commerce",
    category: "E-Commerce",
    divisionId: "tech",
    image: projectEcommerce,
    description: "A modern e-commerce platform with a focus on user experience, featuring product catalogs, cart management, secure checkout, order tracking, and an admin dashboard for store management.",
    techStack: ["React.js", "Node.js", "Express.js", "MongoDB", "Razorpay", "Redis", "Cloudinary", "Tailwind CSS"],
    duration: "3.5 Months",
    team: "4 Developers",
    highlights: [
      "Dynamic product catalog with advanced filtering and search",
      "Secure checkout with Razorpay payment gateway integration",
      "Real-time order tracking with SMS and email notifications",
      "Admin dashboard for inventory, orders, and customer management",
      "Image optimization with Cloudinary for fast page loads",
      "Redis-powered caching for high-performance product listing",
    ],
    process: "The project kicked off with market research and competitor analysis. We created detailed wireframes and prototypes in Figma. The frontend was built with React.js for a smooth SPA experience. Node.js and Express handled the backend APIs. MongoDB was chosen for flexible product schema. Performance optimization using Redis caching and Cloudinary image CDN ensured sub-second page loads.",
  },
];

const ProjectsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const reduceMotion = useReducedMotion();
  const [featured, ...supporting] = projects;

  return (
    <section id="pricing" className="section-padding bg-gradient-subtle" ref={ref}>
      <div className="site-container">
        <AnimatedSection className="mb-12 grid gap-7 md:mb-16 md:grid-cols-[.9fr_1.1fr] md:items-end">
          <div>
            <span className="pill-label">Selected work</span>
            <h2 className="section-heading mt-6">Built for the real world, not the moodboard.</h2>
          </div>
          <p className="section-copy max-w-xl md:justify-self-end">
            A selection of products shaped from early decisions through launch—combining useful experiences with dependable engineering.
          </p>
        </AnimatedSection>

        <motion.div
          initial={{ opacity: 0, y: 34 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        >
          <Link
            to={caseStudyHref(featured.divisionId)}
            className="group relative isolate grid overflow-hidden rounded-[2rem] bg-foreground text-white shadow-[var(--shadow-elevated)] lg:grid-cols-[1.25fr_.75fr]"
            aria-label={`Read the ${featured.title} case study`}
          >
            <BrandXMark className="absolute -bottom-28 -right-24 z-0 w-80 opacity-[0.07]" />
            <div className="relative min-h-[320px] overflow-hidden bg-[radial-gradient(circle_at_35%_30%,rgba(126,90,255,0.3),transparent_58%)] sm:min-h-[440px] lg:min-h-[560px] lg:[perspective:1500px]">
              <div
                className={`absolute inset-3 overflow-hidden rounded-[1.5rem] border border-white/15 bg-secondary shadow-[0_28px_70px_-30px_rgba(0,0,0,0.85)] sm:inset-5 lg:inset-7 lg:[transform-style:preserve-3d] ${
                  reduceMotion
                    ? ""
                    : "lg:transition-transform lg:duration-700 lg:ease-out lg:[transform:rotateX(0deg)_rotateY(0deg)_translateZ(0)] lg:group-hover:[transform:rotateX(-1.5deg)_rotateY(3deg)_translateZ(18px)]"
                }`}
              >
                <img
                  src={featured.image}
                  alt={`${featured.title} product interface`}
                  className={`absolute inset-0 h-full w-full object-cover ${
                    reduceMotion ? "" : "transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                  }`}
                  loading="lazy"
                  width={1920}
                  height={1440}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/65 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-foreground/15" />
                <span className="absolute left-4 top-4 rounded-full border border-white/25 bg-foreground/45 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.12em] text-white backdrop-blur md:left-5 md:top-5">
                  Featured case study
                </span>
              </div>
            </div>

            <div className="relative z-10 flex flex-col p-7 sm:p-9 lg:p-10">
              <div className="flex items-start justify-between gap-4">
                <span className="text-xs font-bold uppercase tracking-[0.14em] text-white/65">{featured.category}</span>
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white/15 bg-white/10 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:bg-white group-hover:text-foreground">
                  <ArrowUpRight size={18} />
                </span>
              </div>
              <div className="mt-auto pt-14 lg:pt-8">
                <h3 className="font-display text-3xl font-bold tracking-[-0.04em] text-white md:text-4xl">{featured.title}</h3>
                <p className="mt-4 text-sm leading-6 text-white/70 md:text-base md:leading-7">{featured.description}</p>
                <div className="mt-6 border-l border-brand/50 pl-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/45">What shipped</p>
                  <ul className="mt-3 space-y-2">
                    {featured.highlights.slice(0, 2).map((highlight) => (
                      <li key={highlight} className="flex gap-2 text-xs leading-5 text-white/70">
                        <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-[#a98bff]" />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-xs font-semibold text-white/60">
                  <span className="flex items-center gap-2"><Clock3 size={15} className="text-[#a98bff]" /> {featured.duration}</span>
                  <span className="flex items-center gap-2"><Users2 size={15} className="text-[#a98bff]" /> {featured.team}</span>
                </div>
                <div className="mt-7 flex flex-wrap gap-2 border-t border-white/10 pt-6">
                  {featured.techStack.slice(0, 4).map((tech) => (
                    <span key={tech} className="rounded-full bg-white/[0.07] px-3 py-1.5 text-[11px] font-semibold text-white/70">{tech}</span>
                  ))}
                </div>
              </div>
            </div>
          </Link>
        </motion.div>

        <div className="mt-5 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {supporting.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.65, delay: 0.12 + index * 0.08, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link
                to={caseStudyHref(project.divisionId)}
                className="group flex h-full flex-col overflow-hidden rounded-3xl border border-border/70 bg-card shadow-[var(--shadow-soft)] transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1.5 hover:border-brand/20 hover:shadow-[var(--shadow-card)]"
                aria-label={`Read the ${project.title} case study`}
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
                  <img
                    src={project.image}
                    alt={`${project.title} product interface`}
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035]"
                    loading="lazy"
                    width={960}
                    height={720}
                  />
                  <span className="absolute left-4 top-4 rounded-full bg-background/90 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-foreground backdrop-blur">
                    {project.category}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="font-display text-xl font-bold tracking-tight text-foreground">{project.title}</h3>
                    <ArrowUpRight size={17} className="mt-1 shrink-0 text-muted-foreground transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-brand" />
                  </div>
                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">{project.description}</p>
                  <div className="mt-auto flex items-center gap-4 border-t border-border/60 pt-5 text-xs font-semibold text-muted-foreground">
                    <span>{project.duration}</span>
                    <span className="h-1 w-1 rounded-full bg-brand" />
                    <span>{project.team}</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
