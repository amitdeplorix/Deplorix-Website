import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getDivision } from "@/data/divisions";
import { useServiceContext } from "@/lib/service-context";
import { openInquiry } from "@/lib/inquiry";
import { trackEvent } from "@/lib/analytics";
import { type } from "@/lib/typography";

/**
 * Persistent contact CTA. Appears after the hero and carries whichever service
 * or division the visitor last engaged with into the enquiry form.
 */
const StickyContactBar = () => {
  const ctx = useServiceContext();
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const division = getDivision(ctx.divisionId);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const nearBottom =
        y + window.innerHeight > document.documentElement.scrollHeight - 700;
      const form = document.getElementById("service-inquiry");
      const formVisible = form
        ? form.getBoundingClientRect().top < window.innerHeight * 0.9 &&
          form.getBoundingClientRect().bottom > 0
        : false;
      setVisible(!dismissed && y > window.innerHeight * 0.8 && !nearBottom && !formVisible);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [dismissed]);

  useEffect(() => {
    window.dispatchEvent(new CustomEvent("deplorix:sticky-visibility", { detail: visible }));
    return () => window.dispatchEvent(new CustomEvent("deplorix:sticky-visibility", { detail: false }));
  }, [visible]);

  useEffect(() => setDismissed(false), [ctx.divisionId, ctx.service]);

  if (!division) return null;

  const handleClick = () => {
    trackEvent("sticky_cta_click", { division: division.id, service: ctx.service });
    openInquiry(division.id, { service: ctx.service ?? division.name });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.35 }}
          className="pointer-events-none fixed bottom-4 left-3 right-3 z-40 md:bottom-6 md:left-0 md:right-0"
        >
          <div className="pointer-events-auto mx-auto flex max-w-xl items-center gap-3 rounded-full border border-white/80 bg-background/95 px-3 py-2.5 shadow-[var(--shadow-elevated)] backdrop-blur-xl md:gap-5 md:px-5 md:py-3">
            <div className="min-w-0 flex-1">
              <p className={`${type.caption} hidden sm:block`}>Talking about</p>
              <p className="truncate text-sm font-semibold text-foreground">
                {division.short}
                {ctx.service ? ` — ${ctx.service}` : ""}
              </p>
            </div>
            <Button
              size="sm"
              onClick={handleClick}
              className="rounded-full gap-1.5 font-semibold shrink-0"
            >
              Get a proposal <ArrowRight size={14} />
            </Button>
            <button
              type="button"
              onClick={() => {
                setDismissed(true);
                setVisible(false);
              }}
              aria-label="Dismiss proposal bar"
              className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <X size={15} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StickyContactBar;
