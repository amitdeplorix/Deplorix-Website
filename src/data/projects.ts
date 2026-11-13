import projectFinflow from "@/assets/project-finflow-optimized.jpg";
import projectHealthtrack from "@/assets/project-healthtrack-optimized.jpg";
import projectEduconnect from "@/assets/project-educonnect.webp";
import projectShopease from "@/assets/project-shopease-optimized.jpg";

export type Project = {
  slug: string;
  title: string;
  category: string;
  divisionId: string;
  image: string;
  summary: string;
  /** Public live URL, when the client allows us to link it. */
  liveUrl?: string;
};

/**
 * Real client work, mapped to the division that delivered it.
 * `caseStudyHref` always points at the division case-study page.
 */
export const projects: Project[] = [
  {
    slug: "finflow-dashboard",
    title: "FinFlow Dashboard",
    category: "Web App",
    divisionId: "tech",
    image: projectFinflow,
    summary: "Real-time financial analytics, invoicing and role-based reporting.",
  },
  {
    slug: "healthtrack-mobile",
    title: "HealthTrack Mobile",
    category: "Mobile App",
    divisionId: "tech",
    image: projectHealthtrack,
    summary: "Cross-platform health tracking with wearable and HealthKit sync.",
  },
  {
    slug: "shopease-commerce",
    title: "ShopEase Commerce",
    category: "E-Commerce",
    divisionId: "tech",
    image: projectShopease,
    summary: "Storefront, payments and a full admin operations suite.",
  },
  {
    slug: "educonnect-platform",
    title: "EduConnect Platform",
    category: "SaaS",
    divisionId: "projects",
    image: projectEduconnect,
    summary: "Live classes, course management and student performance dashboards.",
  },
];

export const caseStudyHref = (divisionId: string) => `/work/${divisionId}`;

export const projectsForDivision = (divisionId: string) =>
  projects.filter((p) => p.divisionId === divisionId);
