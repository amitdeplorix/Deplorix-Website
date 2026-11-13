import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

const WhatsAppButton = () => {
  const [stickyVisible, setStickyVisible] = useState(false);
  const [pastHero, setPastHero] = useState(false);
  const [navOpen, setNavOpen] = useState(false);

  useEffect(() => {
    const handler = (event: Event) => setStickyVisible(Boolean((event as CustomEvent<boolean>).detail));
    window.addEventListener("deplorix:sticky-visibility", handler);
    return () => window.removeEventListener("deplorix:sticky-visibility", handler);
  }, []);

  useEffect(() => {
    const updateVisibility = () => {
      const pastHeroThreshold = window.scrollY > window.innerHeight * 0.72;
      const nearPageEnd =
        window.scrollY + window.innerHeight > document.documentElement.scrollHeight - 650;
      const contact = document.getElementById("contact");
      const contactVisible = contact
        ? contact.getBoundingClientRect().top < window.innerHeight * 0.9 &&
          contact.getBoundingClientRect().bottom > 0
        : false;
      setPastHero(pastHeroThreshold && !nearPageEnd && !contactVisible);
    };
    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });
    window.addEventListener("resize", updateVisibility);
    return () => {
      window.removeEventListener("scroll", updateVisibility);
      window.removeEventListener("resize", updateVisibility);
    };
  }, []);

  useEffect(() => {
    const handler = (event: Event) => setNavOpen(Boolean((event as CustomEvent<boolean>).detail));
    window.addEventListener("deplorix:nav-open", handler);
    return () => window.removeEventListener("deplorix:nav-open", handler);
  }, []);

  return (
    <AnimatePresence>
      {!stickyVisible && pastHero && !navOpen && (
        <motion.a
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          href="https://wa.me/918050536508?text=Hi%20DeploriX%2C%20I%27d%20like%20to%20know%20more%20about%20your%20services."
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat on WhatsApp"
          className="group fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] right-4 z-40 flex h-[52px] w-[52px] items-center justify-center gap-2 rounded-full bg-[#1fbd5c] text-white shadow-[0_16px_34px_-14px_rgba(31,189,92,.7)] transition-all duration-300 hover:-translate-y-1 hover:bg-[#19a950] hover:shadow-xl sm:bottom-6 sm:right-6 sm:h-auto sm:w-auto sm:px-5 sm:py-3.5"
        >
          <MessageCircle className="h-6 w-6 fill-white stroke-white" />
          <span className="hidden text-sm font-semibold sm:inline">Chat with us</span>
        </motion.a>
      )}
    </AnimatePresence>
  );
};

export default WhatsAppButton;
