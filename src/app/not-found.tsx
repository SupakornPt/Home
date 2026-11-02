import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-background px-6 text-on-surface">
      <p className="text-headline-md font-semibold tracking-tight">Page not found</p>
      <Link
        href="/"
        className="text-label-sm font-medium text-secondary underline decoration-secondary/40 underline-offset-4"
      >
        Back to HOME
      </Link>
    </main>
  );
}
