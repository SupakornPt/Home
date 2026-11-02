import { cn } from "@/lib/cn";

export function MaterialIcon({
  name,
  className,
  "aria-hidden": ariaHidden = true,
}: {
  name: string;
  className?: string;
  "aria-hidden"?: boolean | "true" | "false";
}) {
  return (
    <span
      className={cn("material-symbols-outlined align-middle", className)}
      aria-hidden={ariaHidden}
    >
      {name}
    </span>
  );
}
