type LogoBadgeSize = "sm" | "lg";

interface LogoBadgeProps {
  size?: LogoBadgeSize;
}

const VARIANTS: Record<
  LogoBadgeSize,
  { wrapper: string; initials: string; label: string }
> = {
  sm: {
    wrapper: "h-14 w-14 border",
    initials: "text-xl",
    label: "text-[6px] tracking-[0.2em] mt-0.5",
  },
  lg: {
    wrapper: "h-48 w-48 sm:h-60 sm:w-60 border-2",
    initials: "text-5xl sm:text-6xl",
    label: "text-xs sm:text-sm tracking-[0.35em] mt-2",
  },
};

export function LogoBadge({ size = "lg" }: LogoBadgeProps) {
  const variant = VARIANTS[size];

  return (
    <div
      className={`${variant.wrapper} relative flex shrink-0 items-center justify-center rounded-full bg-ink text-cream`}
    >
      <div className="absolute inset-[8%] rounded-full border border-cream/40" />
      <div className="relative flex flex-col items-center px-3 text-center">
        <span className={`${variant.initials} font-heading leading-none`}>
          KG
        </span>
        <span
          className={`${variant.label} font-body font-semibold uppercase text-cream`}
        >
          Sports Therapy
        </span>
        {size === "lg" ? (
          <span className="mt-3 font-accent text-sm italic text-cream/90 sm:text-base">
            Move · Recover · Repeat
          </span>
        ) : null}
      </div>
    </div>
  );
}
