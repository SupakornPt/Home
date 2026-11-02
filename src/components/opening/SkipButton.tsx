"use client";

type SkipButtonProps = {
  onPress: () => void;
};

export function SkipButton({ onPress }: SkipButtonProps) {
  return (
    <button
      type="button"
      aria-label="Skip opening video"
      onClick={onPress}
      className="liquid-glass-skip scale-down-click relative min-h-[52px] min-w-[148px] overflow-hidden rounded-full px-10 py-3.5 text-center text-[13px] font-semibold uppercase tracking-[0.22em] text-white transition duration-300 ease-out hover:border-white/50 hover:bg-gradient-to-br hover:from-white/40 hover:to-white/12 hover:shadow-[0_14px_48px_rgb(0,0,0,0.22)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80"
    >
      <span className="relative z-[1] drop-shadow-[0_1px_2px_rgb(0,0,0,0.45)]">
        Skip
      </span>
      <span
        aria-hidden
        className="pointer-events-none absolute -left-6 top-1/2 h-[140%] w-1/3 -translate-y-1/2 rotate-12 skew-x-12 bg-gradient-to-r from-white/25 via-white/5 to-transparent opacity-75"
      />
    </button>
  );
}
