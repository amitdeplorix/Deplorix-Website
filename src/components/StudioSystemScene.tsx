import {
  useEffect,
  useId,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  Activity,
  Check,
  Code2,
  Layers3,
  PackageCheck,
  Palette,
  Target,
} from "lucide-react";

const finePointerQuery = "(hover: hover) and (pointer: fine)";
const entranceEase = [0.22, 1, 0.36, 1] as const;

const stages = [
  {
    name: "Align",
    detail: "Direction locked",
    progress: 100,
    Icon: Target,
  },
  {
    name: "Design",
    detail: "System approved",
    progress: 100,
    Icon: Palette,
  },
  {
    name: "Build",
    detail: "Sprint in motion",
    progress: 76,
    Icon: Code2,
  },
] as const;

const StudioSystemScene = () => {
  const reduceMotion = useReducedMotion();
  const titleId = useId();
  const descriptionId = useId();
  const [hasFinePointer, setHasFinePointer] = useState(false);

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const mappedRotateY = useTransform(pointerX, [-0.5, 0.5], [-4.5, 4.5]);
  const mappedRotateX = useTransform(pointerY, [-0.5, 0.5], [3.5, -3.5]);
  const rotateX = useSpring(mappedRotateX, { stiffness: 170, damping: 24, mass: 0.65 });
  const rotateY = useSpring(mappedRotateY, { stiffness: 170, damping: 24, mass: 0.65 });
  const ambientMotion = hasFinePointer && !reduceMotion;

  useEffect(() => {
    const media = window.matchMedia(finePointerQuery);
    const updatePointerMode = () => setHasFinePointer(media.matches);

    updatePointerMode();
    media.addEventListener("change", updatePointerMode);
    return () => media.removeEventListener("change", updatePointerMode);
  }, []);

  const handlePointerMove = (event: ReactPointerEvent<HTMLElement>) => {
    if (!ambientMotion) return;

    const bounds = event.currentTarget.getBoundingClientRect();
    pointerX.set((event.clientX - bounds.left) / bounds.width - 0.5);
    pointerY.set((event.clientY - bounds.top) / bounds.height - 0.5);
  };

  const resetTilt = () => {
    pointerX.set(0);
    pointerY.set(0);
  };

  return (
    <motion.figure
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      initial={reduceMotion ? false : { opacity: 0, y: 24, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: reduceMotion ? 0 : 0.8, ease: entranceEase }}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetTilt}
      onPointerCancel={resetTilt}
      className="relative mx-auto h-[430px] w-full max-w-[640px] sm:h-[500px] lg:mx-0 lg:h-[560px]"
      style={{ perspective: "1500px" }}
    >
      <figcaption className="sr-only">
        <span id={titleId}>DeploriX delivery system</span>
        <span id={descriptionId}>
          An on-track product delivery cockpit showing the Align, Design, and Build phases,
          with a four-phase delivery flow and a weekly review rhythm.
        </span>
      </figcaption>

      <div className="absolute inset-0" aria-hidden="true">
        <div className="absolute left-[8%] top-[13%] h-[58%] w-[68%] rounded-full bg-brand/20 blur-[76px]" />
        <div className="absolute bottom-[7%] right-[3%] h-[42%] w-[45%] rounded-full bg-peach/35 blur-[72px]" />
        <div className="absolute inset-x-[9%] bottom-[5%] h-[12%] rounded-[50%] bg-foreground/20 blur-2xl" />
      </div>

      <motion.div
        className="absolute inset-x-1 bottom-5 top-5 sm:inset-x-5 sm:bottom-7 sm:top-7"
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        aria-hidden="true"
      >
        <div
          className="absolute inset-[12%_4%_8%_9%] rounded-[2rem] border border-brand/20 bg-brand/10 sm:rounded-[2.5rem]"
          style={{
            transform: "translate3d(20px, 24px, -86px)",
            boxShadow: "0 38px 90px -48px hsl(var(--brand) / 0.9)",
          }}
        />
        <div
          className="absolute inset-[8%_8%_10%_4%] rounded-[2rem] border border-white/50 bg-brand-soft/45 sm:rounded-[2.5rem]"
          style={{ transform: "translate3d(-18px, 12px, -48px)" }}
        />

        <div
          className="absolute inset-x-[3%] bottom-[8%] top-[7%] overflow-hidden rounded-[1.7rem] border border-white/10 bg-[#0d0b13] shadow-[0_42px_100px_-42px_hsl(var(--foreground)/0.7)] sm:rounded-[2.35rem]"
          style={{
            transform: "translateZ(0px)",
            transformStyle: "preserve-3d",
            backgroundImage:
              "radial-gradient(circle at 86% 5%, hsl(var(--brand) / 0.24), transparent 31%), radial-gradient(circle at 8% 100%, hsl(var(--peach) / 0.08), transparent 28%), linear-gradient(145deg, #17131f 0%, #0d0b13 58%, #09080d 100%)",
          }}
        >
          <div className="absolute inset-x-[12%] top-0 h-px bg-gradient-to-r from-transparent via-white/45 to-transparent" />
          <div className="noise-overlay absolute inset-0 opacity-[0.06] mix-blend-screen" />

          <div className="relative flex h-14 items-center justify-between border-b border-white/[0.07] px-4 sm:h-[4.5rem] sm:px-6">
            <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/[0.07] text-brand sm:h-10 sm:w-10 sm:rounded-2xl">
                <Layers3 size={18} strokeWidth={1.8} />
              </span>
              <span className="min-w-0">
                <span className="block truncate font-display text-[11px] font-extrabold tracking-[-0.02em] text-white sm:text-sm">
                  DeploriX delivery system
                </span>
                <span className="mt-0.5 hidden text-[9px] font-semibold uppercase tracking-[0.16em] text-white/35 min-[390px]:block sm:text-[10px]">
                  Strategy to shipped product
                </span>
              </span>
            </div>

            <span className="ml-2 inline-flex shrink-0 items-center gap-1.5 rounded-full border border-emerald-300/20 bg-emerald-400/10 px-2.5 py-1.5 text-[8px] font-extrabold uppercase tracking-[0.12em] text-emerald-200 sm:px-3 sm:text-[9px]">
              <motion.span
                animate={ambientMotion ? { scale: [1, 1.35, 1], opacity: [0.75, 1, 0.75] } : undefined}
                transition={ambientMotion ? { duration: 2.4, repeat: Infinity, ease: "easeInOut" } : undefined}
                className="h-1.5 w-1.5 rounded-full bg-emerald-300 shadow-[0_0_12px_rgba(110,231,183,0.9)]"
              />
              On track
            </span>
          </div>

          <div className="relative grid h-[calc(100%_-_3.5rem)] grid-cols-[minmax(0,1fr)_5.75rem] gap-2 p-2.5 sm:h-[calc(100%_-_4.5rem)] sm:grid-cols-[minmax(0,1fr)_9.25rem] sm:gap-3 sm:p-4">
            <div className="flex min-w-0 flex-col rounded-[1.15rem] border border-white/[0.08] bg-white/[0.035] p-2.5 sm:rounded-[1.55rem] sm:p-4">
              <div className="mb-2.5 flex items-end justify-between gap-2 sm:mb-4">
                <div>
                  <p className="text-[8px] font-extrabold uppercase tracking-[0.18em] text-brand sm:text-[10px]">
                    Delivery lane 04
                  </p>
                  <p className="mt-1 font-display text-xs font-bold text-white sm:text-base">
                    One accountable flow
                  </p>
                </div>
                <span className="hidden items-center gap-1 text-[9px] font-semibold text-white/40 min-[390px]:flex sm:text-[10px]">
                  <Activity size={11} /> Live pulse
                </span>
              </div>

              <div className="grid flex-1 grid-rows-3 gap-1.5 sm:gap-2.5" style={{ transformStyle: "preserve-3d" }}>
                {stages.map((stage, index) => (
                  <div
                    key={stage.name}
                    className="group relative flex min-h-0 items-center gap-2 overflow-hidden rounded-xl border border-white/[0.08] bg-[#181521]/90 px-2 py-1.5 sm:gap-3 sm:rounded-2xl sm:px-3 sm:py-2.5"
                    style={{
                      transform: `translate3d(${index * 2}px, 0, ${18 + index * 8}px)`,
                      boxShadow: "0 12px 30px -22px rgba(0, 0, 0, 0.9)",
                    }}
                  >
                    <span className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-brand/70 to-transparent" />
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-brand/10 text-brand sm:h-9 sm:w-9 sm:rounded-xl">
                      <stage.Icon size={14} strokeWidth={1.9} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center justify-between gap-1">
                        <span className="truncate text-[10px] font-extrabold text-white sm:text-xs">
                          {stage.name}
                        </span>
                        <span className="text-[8px] font-bold tabular-nums text-white/45 sm:text-[9px]">
                          {stage.progress}%
                        </span>
                      </span>
                      <span className="mt-0.5 hidden truncate text-[8px] text-white/35 min-[390px]:block sm:text-[10px]">
                        {stage.detail}
                      </span>
                      <span className="mt-1 block h-1 overflow-hidden rounded-full bg-white/[0.07] sm:mt-1.5">
                        <motion.span
                          initial={reduceMotion ? false : { scaleX: 0 }}
                          whileInView={{ scaleX: 1 }}
                          viewport={{ once: true }}
                          transition={{
                            duration: reduceMotion ? 0 : 0.75,
                            delay: reduceMotion ? 0 : 0.28 + index * 0.1,
                            ease: entranceEase,
                          }}
                          className="block h-full origin-left rounded-full bg-gradient-to-r from-brand to-[#c7a4ff]"
                          style={{ width: `${stage.progress}%` }}
                        />
                      </span>
                    </span>
                    {stage.progress === 100 ? (
                      <span className="hidden h-5 w-5 shrink-0 place-items-center rounded-full border border-emerald-300/15 bg-emerald-400/10 text-emerald-300 min-[390px]:grid sm:h-6 sm:w-6">
                        <Check size={11} strokeWidth={2.5} />
                      </span>
                    ) : (
                      <span className="hidden h-2 w-2 shrink-0 rounded-full bg-peach shadow-[0_0_12px_hsl(var(--peach)/0.65)] min-[390px]:block" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="grid min-w-0 grid-rows-[1.15fr_.85fr] gap-2 sm:gap-3">
              <div className="relative overflow-hidden rounded-[1.15rem] border border-white/[0.08] bg-white/[0.04] p-2 sm:rounded-[1.55rem] sm:p-3.5">
                <div className="absolute -right-7 -top-7 h-20 w-20 rounded-full bg-brand/20 blur-2xl" />
                <p className="relative text-[7px] font-extrabold uppercase tracking-[0.15em] text-white/35 sm:text-[9px]">
                  System health
                </p>
                <div className="relative mx-auto mt-3 grid h-12 w-12 place-items-center rounded-full bg-white/[0.04] sm:mt-4 sm:h-[4.5rem] sm:w-[4.5rem]">
                  <div
                    className="absolute inset-0 rounded-full p-[3px]"
                    style={{
                      background:
                        "conic-gradient(hsl(var(--brand)) 0deg 316deg, rgba(255,255,255,0.08) 316deg 360deg)",
                    }}
                  >
                    <div className="h-full w-full rounded-full bg-[#121019]" />
                  </div>
                  <div className="relative text-center">
                    <p className="font-display text-[11px] font-extrabold text-white sm:text-base">Steady</p>
                    <p className="hidden text-[7px] text-white/30 sm:block">plan health</p>
                  </div>
                </div>
                <div className="relative mt-3 space-y-1.5 sm:mt-4 sm:space-y-2">
                  {[82, 66, 91].map((value, index) => (
                    <div key={value} className="h-1 overflow-hidden rounded-full bg-white/[0.06] sm:h-1.5">
                      <motion.div
                        initial={reduceMotion ? false : { scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true }}
                        transition={{
                          duration: reduceMotion ? 0 : 0.7,
                          delay: reduceMotion ? 0 : 0.45 + index * 0.1,
                          ease: entranceEase,
                        }}
                        className="h-full origin-left rounded-full bg-white/25"
                        style={{ width: `${value}%` }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative overflow-hidden rounded-[1.15rem] border border-white/[0.08] bg-gradient-to-br from-peach/[0.13] to-white/[0.025] p-2 sm:rounded-[1.55rem] sm:p-3.5">
                <p className="text-[7px] font-extrabold uppercase tracking-[0.15em] text-white/35 sm:text-[9px]">
                  Launch signal
                </p>
                <div className="mt-2.5 flex h-[2.8rem] items-end gap-1 sm:mt-4 sm:h-16 sm:gap-1.5">
                  {[28, 44, 36, 62, 54, 78, 92].map((height, index) => (
                    <motion.span
                      key={height}
                      initial={reduceMotion ? false : { scaleY: 0 }}
                      whileInView={{ scaleY: 1 }}
                      viewport={{ once: true }}
                      transition={{
                        duration: reduceMotion ? 0 : 0.5,
                        delay: reduceMotion ? 0 : 0.4 + index * 0.055,
                        ease: entranceEase,
                      }}
                      className="flex-1 origin-bottom rounded-t-full bg-gradient-to-t from-brand/35 to-peach/80"
                      style={{ height: `${height}%` }}
                    />
                  ))}
                </div>
                <p className="mt-2 truncate text-[8px] font-semibold text-white/45 sm:text-[10px]">
                  Momentum rising
                </p>
              </div>
            </div>
          </div>
        </div>

        <motion.div
          animate={ambientMotion ? { y: [0, -7, 0] } : undefined}
          transition={ambientMotion ? { duration: 5.4, repeat: Infinity, ease: "easeInOut" } : undefined}
          className="absolute -right-1 top-[2%] z-20 sm:right-0"
          style={{ transform: "translateZ(92px)" }}
        >
          <div className="rounded-2xl border border-white/15 bg-brand-gradient px-3.5 py-3 text-white shadow-[var(--shadow-brand)] sm:rounded-[1.35rem] sm:px-5 sm:py-4">
            <p className="font-display text-lg font-extrabold tracking-[-0.04em] sm:text-2xl">Weekly</p>
            <p className="text-[8px] font-semibold text-white/75 sm:text-[10px]">Review rhythm</p>
          </div>
        </motion.div>

        <motion.div
          animate={ambientMotion ? { y: [0, 7, 0] } : undefined}
          transition={
            ambientMotion
              ? { duration: 5.9, delay: 0.45, repeat: Infinity, ease: "easeInOut" }
              : undefined
          }
          className="absolute -bottom-[1%] left-0 z-20 sm:-bottom-[2%] sm:left-[1%]"
          style={{ transform: "translateZ(106px)" }}
        >
          <div className="flex items-center gap-2.5 rounded-2xl border border-white/80 bg-card/95 p-2.5 pr-3.5 shadow-[var(--shadow-card)] backdrop-blur-xl sm:gap-3.5 sm:rounded-[1.35rem] sm:p-3.5 sm:pr-5">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand sm:h-11 sm:w-11 sm:rounded-2xl">
              <PackageCheck size={18} strokeWidth={1.9} />
            </span>
            <span>
              <span className="block font-display text-lg font-extrabold tracking-[-0.04em] text-foreground sm:text-2xl">4 phases</span>
              <span className="block text-[8px] font-semibold text-muted-foreground sm:text-[10px]">One delivery flow</span>
            </span>
          </div>
        </motion.div>

        <motion.span
          animate={ambientMotion ? { scale: [1, 1.16, 1], opacity: [0.55, 1, 0.55] } : undefined}
          transition={ambientMotion ? { duration: 4.2, repeat: Infinity, ease: "easeInOut" } : undefined}
          className="absolute left-[2%] top-[19%] h-4 w-4 rounded-full border-[4px] border-[#0d0b13] bg-peach shadow-[0_0_26px_hsl(var(--peach)/0.9)] sm:h-5 sm:w-5 sm:border-[5px]"
          style={{ transform: "translateZ(72px)" }}
        />
      </motion.div>
    </motion.figure>
  );
};

export default StudioSystemScene;
