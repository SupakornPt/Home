export function SiteFooter() {
  return (
    <footer className="w-full shrink-0 bg-surface-container-lowest px-margin-mobile py-4 md:px-margin-desktop md:py-5">
      <div className="mx-auto flex max-w-container-max flex-col items-center gap-3.5 text-center md:flex-row md:justify-between md:gap-6 md:text-left">
        <div className="flex flex-wrap items-baseline justify-center gap-3.5 md:justify-start">
          <div className="text-[15px] font-black tracking-tighter text-primary md:text-[16px]">
            HOME
          </div>
          <p className="caption text-on-surface-variant opacity-50 md:text-[13px]">
            Elevating living standards since 2024.
          </p>
        </div>
        <nav className="flex flex-wrap justify-center gap-7 md:gap-8">
          <a
            href="#"
            className="text-[11px] uppercase tracking-widest text-on-surface-variant transition hover:text-secondary md:text-[12px]"
          >
            Privacy
          </a>
          <a
            href="#"
            className="text-[11px] uppercase tracking-widest text-on-surface-variant transition hover:text-secondary md:text-[12px]"
          >
            Terms
          </a>
          <a
            href="#"
            className="text-[11px] uppercase tracking-widest text-on-surface-variant transition hover:text-secondary md:text-[12px]"
          >
            Support
          </a>
        </nav>
        <p className="text-[10px] text-on-surface-variant/50 md:text-[11px]">
          © 2026 HOME Real Estate.
        </p>
      </div>
    </footer>
  );
}
