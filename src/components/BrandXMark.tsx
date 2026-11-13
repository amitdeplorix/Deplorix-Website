import { cn } from "@/lib/utils";

const BrandXMark = ({ className }: { className?: string }) => (
  <div className={cn("pointer-events-none relative aspect-square", className)} aria-hidden="true">
    <span className="absolute left-1/2 top-1/2 h-[13%] w-[84%] -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-full bg-gradient-to-r from-transparent via-brand to-peach/80" />
    <span className="absolute left-1/2 top-1/2 h-[13%] w-[84%] -translate-x-1/2 -translate-y-1/2 -rotate-45 rounded-full bg-gradient-to-r from-transparent via-brand to-brand/25" />
    <span className="absolute left-[8%] top-1/2 h-3 w-3 -translate-y-1/2 rounded-full border border-brand/40 bg-background/80 shadow-[0_0_28px_hsl(var(--brand)/0.7)]" />
    <span className="absolute right-[8%] top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full bg-peach shadow-[0_0_24px_hsl(var(--peach)/0.8)]" />
    <span className="absolute left-1/2 top-[8%] h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-brand/70" />
  </div>
);

export default BrandXMark;
