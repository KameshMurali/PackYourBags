// A slow, endless ticker. The list is rendered twice and shifted by exactly half,
// so the loop is seamless. Pauses on hover; reduced-motion users get a static, wrapped row.
export function MarqueeStrip({
  label,
  items,
}: {
  label: React.ReactNode;
  items: Array<{ flag: string; name: string; detail: string }>;
}) {
  return (
    <div className="relative flex items-stretch overflow-hidden bg-sunset text-night">
      <div className="relative z-10 flex max-w-[45%] shrink-0 items-center bg-night px-4 text-[0.68rem] font-extrabold uppercase leading-tight tracking-[0.18em] text-sun sm:px-6">
        {label}
      </div>
      <div className="group relative flex-1 overflow-hidden py-4">
        <ul className="animate-marquee flex w-max gap-10 pr-10 group-hover:[animation-play-state:paused] motion-reduce:w-full motion-reduce:flex-wrap">
          {[...items, ...items].map((item, i) => (
            <li
              key={`${item.name}-${i}`}
              aria-hidden={i >= items.length}
              className="flex items-center gap-2.5 whitespace-nowrap font-display text-lg font-bold"
            >
              <span className="text-2xl leading-none">{item.flag}</span>
              {item.name}
              <span className="rounded-full bg-night/10 px-2.5 py-0.5 text-xs font-bold">{item.detail}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
