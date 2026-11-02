/** Infinite marquee of the stacks and platforms we ship with. */
const items: { name: string; className: string }[] = [
  { name: "React", className: "font-semibold tracking-tight" },
  { name: "Node.js", className: "font-medium" },
  { name: "Flutter", className: "font-light tracking-wide" },
  { name: "Python", className: "font-semibold italic" },
  { name: "AWS", className: "font-bold tracking-widest" },
  { name: "Figma", className: "font-medium" },
  { name: "TensorFlow", className: "font-light" },
  { name: "Google Ads", className: "font-semibold" },
  { name: "Meta Business", className: "font-medium italic" },
  { name: "Supabase", className: "font-semibold tracking-tight" },
];

const LogoStrip = ({ label = "Built with the stacks modern teams trust" }: { label?: string }) => (
  <div className="relative border-y border-border/80 bg-background/60 backdrop-blur">
    <p className="sr-only">{label}</p>
    <div className="max-w-7xl mx-auto overflow-hidden [mask-image:linear-gradient(to_right,transparent,#000_12%,#000_88%,transparent)]">
      <div className="flex w-max animate-marquee items-center gap-16 py-7 hover:[animation-play-state:paused] cursor-default select-none">
        {[...items, ...items].map((item, i) => (
          <span
            key={`${item.name}-${i}`}
            aria-hidden={i >= items.length}
            className={`text-lg md:text-xl text-foreground/45 whitespace-nowrap transition-colors hover:text-foreground cursor-default select-none ${item.className}`}
          >
            {item.name}
          </span>
        ))}
      </div>
    </div>
  </div>
);

export default LogoStrip;
