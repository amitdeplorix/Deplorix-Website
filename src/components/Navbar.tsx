import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import StartProjectDialog from "./StartProjectDialog";
import logo from "@/assets/deplorix-logo.png";

const navLinks = [
  { label: "About", href: "#solutions" },
  { label: "Services", href: "#products" },
  { label: "Work", href: "#pricing" },
  { label: "Process", href: "#process" },
  { label: "Internships", href: "#resources" },
  { label: "Explore", href: "/explore" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [projectOpen, setProjectOpen] = useState(false);
  const [activeHash, setActiveHash] = useState("");
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === "/";
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const smoothScrollProgress = useSpring(scrollYProgress, {
    stiffness: 130,
    damping: 24,
    mass: 0.35,
  });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!isHome) return;
    const sections = Array.from(document.querySelectorAll<HTMLElement>("main section[id]"));

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) {
          const visibleHash = `#${visible.target.id}`;
          setActiveHash(navLinks.some((link) => link.href === visibleHash) ? visibleHash : "");
        }
      },
      { rootMargin: "-30% 0px -55%", threshold: [0, 0.15, 0.4] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [isHome]);

  useEffect(() => {
    const menuButton = menuButtonRef.current;
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    window.dispatchEvent(new CustomEvent("deplorix:nav-open", { detail: mobileOpen }));
    const backgroundRegions = [document.querySelector("main"), document.querySelector("footer")].filter(
      (region): region is Element => Boolean(region),
    );
    backgroundRegions.forEach((region) => {
      if (mobileOpen) region.setAttribute("inert", "");
      else region.removeAttribute("inert");
    });

    const focusableElements = () =>
      Array.from(
        mobileMenuRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ) ?? [],
      );

    const handleMenuKeys = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
        return;
      }
      if (event.key !== "Tab") return;

      const focusables = focusableElements();
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    let focusFrame = 0;
    if (mobileOpen) {
      window.addEventListener("keydown", handleMenuKeys);
      focusFrame = window.requestAnimationFrame(() => focusableElements()[0]?.focus());
    }

    return () => {
      document.body.style.overflow = "";
      backgroundRegions.forEach((region) => region.removeAttribute("inert"));
      window.removeEventListener("keydown", handleMenuKeys);
      if (focusFrame) window.cancelAnimationFrame(focusFrame);
      if (mobileOpen) menuButton?.focus();
    };
  }, [mobileOpen]);

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    if (href.startsWith("/")) {
      navigate(href);
      return;
    }
    if (!isHome) {
      navigate(`/${href}`);
      return;
    }
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const isActive = (href: string) =>
    href.startsWith("/") ? location.pathname === href : isHome && activeHash === href;

  return (
    <>
      <motion.header
        initial={{ y: -90 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          scrolled || mobileOpen ? "nav-glass" : "bg-transparent"
        }`}
      >
        <nav className="site-container flex h-[72px] items-center justify-between gap-4 px-5 md:h-20 md:px-10" aria-label="Main navigation">
          <Link to="/" className="group flex shrink-0 items-center gap-2.5 text-foreground" aria-label="DeploriX Technologies home">
            <span className="grid h-10 w-10 place-items-center rounded-2xl border border-border/70 bg-card shadow-[var(--shadow-soft)] transition-transform duration-300 group-hover:-rotate-3 group-hover:scale-105">
              <img src={logo} alt="" className="h-8 w-8 rounded-full object-contain" width={32} height={32} />
            </span>
            <span className="font-display text-[15px] font-extrabold leading-[1.05] tracking-[-0.03em]">
              deploriX
              <span className="block font-sans text-[11px] font-semibold tracking-[0.12em] text-muted-foreground">TECHNOLOGIES</span>
            </span>
          </Link>

          <div className="hidden items-center gap-1 rounded-full border border-border/70 bg-card/75 p-1.5 shadow-[var(--shadow-soft)] backdrop-blur-xl lg:flex">
            {navLinks.map((link) => (
              <button
                key={link.label}
                type="button"
                onClick={() => handleNavClick(link.href)}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={`relative rounded-full px-4 py-2 text-sm font-semibold transition-colors duration-200 ${
                  isActive(link.href) ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {isActive(link.href) && (
                  <motion.span layoutId="nav-active" className="absolute inset-0 rounded-full bg-secondary" transition={{ type: "spring", stiffness: 380, damping: 32 }} />
                )}
                <span className="relative">{link.label}</span>
              </button>
            ))}
          </div>

          <div className="hidden items-center gap-3 lg:flex">
            <button type="button" onClick={() => handleNavClick("#contact")} className="px-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground">
              Contact
            </button>
            <Button variant="hero" className="h-11 px-5" onClick={() => setProjectOpen(true)}>
              Start a project <ArrowUpRight size={16} />
            </Button>
          </div>

          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            className="grid h-11 w-11 place-items-center rounded-full border border-border bg-card text-foreground shadow-[var(--shadow-soft)] lg:hidden"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </nav>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              ref={mobileMenuRef}
              id="mobile-navigation"
              role="dialog"
              aria-modal="true"
              aria-label="Mobile navigation"
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-x-0 top-full h-[calc(100dvh-72px)] overflow-y-auto border-t border-border/70 bg-background/95 backdrop-blur-2xl lg:hidden"
            >
              <div className="grid min-h-full content-start gap-1 px-5 pb-[calc(1.5rem+env(safe-area-inset-bottom))] pt-5">
                {navLinks.map((link, index) => (
                  <motion.button
                    key={link.label}
                    type="button"
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.035 }}
                    onClick={() => handleNavClick(link.href)}
                    aria-current={isActive(link.href) ? "page" : undefined}
                    className={`flex items-center justify-between rounded-2xl px-4 py-3.5 text-left text-base font-semibold ${
                      isActive(link.href) ? "bg-secondary text-foreground" : "text-foreground/80"
                    }`}
                  >
                    {link.label}
                    <ArrowUpRight size={16} className="text-muted-foreground" />
                  </motion.button>
                ))}
                <button type="button" onClick={() => handleNavClick("#contact")} className="flex items-center justify-between rounded-2xl px-4 py-3.5 text-left text-base font-semibold text-foreground/80">
                  Contact <ArrowUpRight size={16} className="text-muted-foreground" />
                </button>
                <Button
                  variant="brand"
                  className="mt-3 h-12"
                  onClick={() => {
                    setMobileOpen(false);
                    setProjectOpen(true);
                  }}
                >
                  Start a project <ArrowUpRight size={16} />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-[2px] origin-left bg-brand-gradient"
          style={{ scaleX: reduceMotion ? scrollYProgress : smoothScrollProgress }}
        />
      </motion.header>

      <StartProjectDialog open={projectOpen} onOpenChange={setProjectOpen} />
    </>
  );
};

export default Navbar;
