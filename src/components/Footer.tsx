import { ArrowUpRight, Instagram, Linkedin, Mail, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "@/assets/deplorix-logo.png";
import BrandXMark from "./BrandXMark";

const columns = [
  {
    title: "Divisions",
    links: [
      { label: "Deplorix Tech", href: "/work/tech" },
      { label: "Deplorix Digital", href: "/work/digital" },
      { label: "Deplorix Projects", href: "/work/projects" },
      { label: "Business Process Solutions", href: "/work/bps" },
      { label: "Deplorix Training", href: "/work/training" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/#solutions" },
      { label: "Selected work", href: "/#pricing" },
      { label: "Process", href: "/#process" },
      { label: "Internships", href: "/#resources" },
      { label: "Explore", href: "/explore" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Contact", href: "/#contact" },
      { label: "Terms & Conditions", href: "/terms" },
    ],
  },
];

const socials = [
  { icon: Mail, href: "mailto:deplorixtechnologies@gmail.com", label: "Email" },
  { icon: Linkedin, href: "https://www.linkedin.com/company/deplorix-technologies/", label: "LinkedIn" },
  { icon: Instagram, href: "https://www.instagram.com/deplorix.tech", label: "Instagram" },
];

const Footer = () => (
  <footer className="relative isolate mx-2 overflow-hidden rounded-t-[2rem] bg-foreground text-white sm:mx-3 md:mx-5 md:rounded-t-[2.5rem]">
    <BrandXMark className="absolute -bottom-36 -right-20 -z-10 w-[460px] opacity-[0.09] sm:w-[620px]" />
    <div className="site-container relative px-6 py-14 md:px-12 md:py-20">
      <div className="grid gap-12 border-b border-white/10 pb-12 lg:grid-cols-[1.25fr_1.75fr] lg:gap-20">
        <div>
          <Link to="/" className="inline-flex items-center gap-3 text-white" aria-label="DeploriX Technologies home">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white">
              <img src={logo} alt="" className="h-9 w-9 rounded-full object-contain" width={36} height={36} />
            </span>
            <span className="font-display text-xl font-extrabold tracking-[-0.035em]">deploriX</span>
          </Link>
          <p className="mt-6 max-w-sm text-sm leading-6 text-white/65">
            A Bangalore-based product and digital studio helping businesses and students move from idea to launch.
          </p>
          <p className="mt-5 flex items-center gap-2 text-sm font-semibold text-white/70">
            <MapPin size={16} className="text-[#a98bff]" /> Bangalore, India · Working worldwide
          </p>
          <div className="mt-7 flex gap-2">
            {socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target={social.href.startsWith("mailto") ? undefined : "_blank"}
                rel="noopener noreferrer"
                aria-label={social.label}
                className="grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-white/[0.06] text-white/70 transition-colors hover:border-white/25 hover:bg-white/10 hover:text-white"
              >
                <social.icon size={18} />
              </a>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3">
          {columns.map((column) => (
            <div key={column.title}>
              <h4 className="text-xs font-bold uppercase tracking-[0.14em] text-white/55">{column.title}</h4>
              <ul className="mt-5 space-y-3.5">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.href} className="group inline-flex min-h-11 items-center gap-1.5 text-sm text-white/60 transition-colors hover:text-white">
                      {link.label}
                      <ArrowUpRight size={12} className="opacity-0 transition-opacity group-hover:opacity-100" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3 pt-7 text-xs text-white/55 sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} DeploriX Technologies. All rights reserved.</p>
        <p>Designed and built with care in Bangalore.</p>
      </div>
    </div>
  </footer>
);

export default Footer;
