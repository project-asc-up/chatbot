import Image from "next/image";

import { cn } from "@/lib/cn";

export function FacultyLogo({
  className,
  size = 44,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <span
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-[color:var(--color-border)] bg-white",
        className,
      )}
      style={{ width: size, height: size }}
    >
      <Image
        src="/up-logo.png"
        alt="University of Pretoria logo"
        fill
        sizes={`${size}px`}
        className="object-contain p-1.5"
      />
    </span>
  );
}
