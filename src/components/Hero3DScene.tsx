import { useEffect, useState, type PointerEvent as ReactPointerEvent } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { ArrowUpRight, Layers3, MapPin, Sparkles } from "lucide-react";
import projectPreview from "@/assets/project-finflow-optimized.jpg";

const ease = [0.22, 1, 0.36, 1] as const;
const finePointerQuery = "(hover: hover) and (pointer: fine)";

const Hero3DScene = () => {
  const reduceMotion = useReducedMotion();
  const [hasFinePointer, setHasFinePointer] = useState(
    () => typeof window !== "undefined" && window.matchMedia(finePointerQuery).matches,
  );

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const rawRotateY = useTransform(pointerX, [-0.5, 0.5], [-7, 7]);
  const rawRotateX = useTransform(pointerY, [-0.5, 0.5], [5, -5]);
  const rotateX = useSpring(rawRotateX, { stiffness: 150, damping: 22, mass: 0.7 });
  const rotateY = useSpring(rawRotateY, { stiffness: 150, damping: 22, mass: 0.7 });
  const ambientMotion = hasFinePointer && !reduceMotion;

  useEffect(() => {
    const media = window.matchMedia(finePointerQuery);
    const updatePointerMode = (event: MediaQueryListEvent) => setHasFinePointer(event.matches);

    media.addEventListener("change", updatePointerMode);
    return () => media.removeEventListener("change", updatePointerMode);
  }, []);

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!ambientMotion) return;

    const bounds = event.currentTarget.getBoundingClientRect();
    pointerX.set((event.clientX - bounds.left) / bounds.width - 0.5);
    pointerY.set((event.clientY - bounds.top) / bounds.height - 0.5);
  };

  const resetPerspective = () => {
    pointerX.set(0);
    pointerY.set(0);
  };

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, x: 34, scale: 0.96 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ duration: reduceMotion ? 0 : 0.9, delay: reduceMotion ? 0 : 0.18, ease }}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetPerspective}
      onPointerCancel={resetPerspective}
      className="relative mx-auto h-[350px] w-full max-w-[560px] sm:h-[480px] lg:mx-0 lg:h-[520px]"
      style={{ perspective: "1400px" }}
    >
      <div
        className="absolute inset-x-[12%] top-[9%] h-[72%] rounded-full bg-brand/25 blur-[72px]"
        aria-hidden="true"
      />
      <div
        className="absolute -right-[4%] bottom-[8%] h-52 w-52 rounded-full bg-brand/20 blur-[72px] sm:h-64 sm:w-64"
        aria-hidden="true"
      />

      <motion.div
        className="absolute inset-x-3 bottom-4 top-2 sm:inset-x-6 sm:bottom-8 sm:top-8"
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      >
        <div
          className="absolute inset-x-[9%] bottom-[2%] h-[22%] rounded-[50%] bg-foreground/15 blur-2xl"
          style={{ transform: "translate3d(0, 28px, -120px) rotateX(72deg)" }}
          aria-hidden="true"
        />

        <div
          className="absolute inset-[7%_5%_9%_9%] rounded-[2rem] border border-brand/20 bg-brand/10"
          style={{
            transform: "translate3d(22px, 24px, -72px)",
            boxShadow: "0 28px 70px -34px hsl(var(--brand) / 0.7)",
          }}
          aria-hidden="true"
        />

        <div
          className="absolute inset-[3%_7%_9%_3%] rounded-[2rem] border border-brand/15 bg-brand-soft/50"
          style={{ transform: "translate3d(-16px, 13px, -42px)" }}
          aria-hidden="true"
        />

        <div
          className="absolute inset-x-[4%] bottom-[8%] top-[3%] rounded-[1.75rem] border border-white/80 bg-card/90 p-2 shadow-[0_35px_90px_-32px_hsl(var(--foreground)/0.45)] backdrop-blur-xl sm:rounded-[2.2rem] sm:p-2.5"
          style={{ transform: "translateZ(0px)", transformStyle: "preserve-3d" }}
        >
          <div className="flex h-10 items-center justify-between px-3 sm:h-12 sm:px-4">
            <div className="flex items-center gap-1.5" aria-hidden="true">
              <span className="h-2 w-2 rounded-full bg-[#ff6b6b] sm:h-2.5 sm:w-2.5" />
              <span className="h-2 w-2 rounded-full bg-[#ffd166] sm:h-2.5 sm:w-2.5" />
              <span className="h-2 w-2 rounded-full bg-[#06d6a0] sm:h-2.5 sm:w-2.5" />
            </div>
            <div className="flex items-center gap-1.5 rounded-full border border-border/60 bg-secondary/80 px-2.5 py-1 text-[8px] font-extrabold uppercase tracking-[0.15em] text-muted-foreground sm:text-[10px]">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Live product
            </div>
          </div>

          <div
            className="relative h-[calc(100%_-_2.5rem)] overflow-hidden rounded-[1.3rem] bg-secondary sm:h-[calc(100%_-_3rem)] sm:rounded-[1.7rem]"
            style={{ transform: "translateZ(22px)" }}
          >
            <img
              src={projectPreview}
              alt="FinFlow financial analytics dashboard designed and engineered by DeploriX"
              className="h-full w-full object-cover object-top"
              width={960}
              height={720}
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#15121f]/92" />
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-4 text-white sm:p-6">
              <div>
                <div className="mb-2 flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.16em] text-white/60 sm:text-[10px]">
                  <Layers3 size={13} /> Featured build
                </div>
                <p className="font-display text-lg font-extrabold tracking-[-0.03em] sm:text-2xl">
                  FinFlow intelligence
                </p>
                <p className="mt-1 hidden text-xs text-white/65 sm:block">Product design · Full-stack engineering</p>
              </div>
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white text-foreground shadow-lg sm:h-11 sm:w-11">
                <ArrowUpRight size={17} />
              </span>
            </div>
          </div>
        </div>

        {/* Floating badge 1: Top-Left */}
        <div
          className="absolute -left-2 top-[16%] z-20 sm:left-1 md:left-2"
          style={{ transform: "translateZ(88px)" }}
        >
          <motion.div
            animate={ambientMotion ? { y: [0, -9, 0] } : { y: 0 }}
            transition={ambientMotion ? { duration: 5, repeat: Infinity, ease: "easeInOut" } : { duration: 0 }}
            className="flex items-center gap-2.5 rounded-2xl border border-white/85 bg-card/90 p-2.5 pr-3 shadow-[0_18px_45px_-20px_hsl(var(--foreground)/0.4)] backdrop-blur-xl sm:gap-3 sm:p-3 sm:pr-4"
          >
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-brand-soft text-brand sm:h-10 sm:w-10">
              <Sparkles size={17} />
            </span>
            <span>
              <span className="block text-[10px] font-extrabold text-foreground sm:text-xs">Strategy to launch</span>
              <span className="block text-[9px] text-muted-foreground sm:text-[11px]">One integrated team</span>
            </span>
          </motion.div>
        </div>

        {/* Floating badge 2: Bottom-Right */}
        <div
          className="absolute -right-2 bottom-[6%] z-20 sm:right-1 md:right-2"
          style={{ transform: "translateZ(104px)" }}
        >
          <motion.div
            animate={ambientMotion ? { y: [0, 8, 0] } : { y: 0 }}
            transition={
              ambientMotion
                ? { duration: 5.6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }
                : { duration: 0 }
            }
            className="flex items-center gap-2.5 rounded-2xl border border-white/85 bg-card/90 p-2.5 pr-3 shadow-[0_18px_45px_-20px_hsl(var(--foreground)/0.4)] backdrop-blur-xl sm:gap-3 sm:p-3 sm:pr-4"
          >
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-brand-soft text-brand sm:h-10 sm:w-10">
              <MapPin size={16} />
            </span>
            <span>
              <span className="block text-[10px] font-extrabold text-foreground sm:text-xs">Bangalore · Worldwide</span>
              <span className="block text-[9px] text-muted-foreground sm:text-[11px]">Built without borders</span>
            </span>
          </motion.div>
        </div>

        <motion.div
          animate={ambientMotion ? { scale: [1, 1.12, 1], opacity: [0.6, 1, 0.6] } : { scale: 1, opacity: 0.8 }}
          transition={ambientMotion ? { duration: 4.5, repeat: Infinity, ease: "easeInOut" } : { duration: 0 }}
          className="absolute right-[3%] top-[9%] z-20 h-4 w-4 rounded-full border-[5px] border-white bg-brand shadow-[0_0_28px_hsl(var(--brand)/0.75)] sm:h-5 sm:w-5"
          style={{ transform: "translateZ(118px)" }}
          aria-hidden="true"
        />
        <div
          className="absolute -left-[2%] bottom-[15%] h-10 w-10 rounded-full border border-brand/25 sm:h-14 sm:w-14"
          style={{ transform: "translateZ(-24px)" }}
          aria-hidden="true"
        />
      </motion.div>
    </motion.div>
  );
};

export default Hero3DScene;
