import type { HTMLAttributes } from "react";

import { cn } from "@/lib/cn";

type StatChipProps = HTMLAttributes<HTMLDivElement> & {
  label: string;
  value: string;
};

export default function StatChip({
  label,
  value,
  className,
  ...props
}: StatChipProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-1 rounded-2xl border border-border/70 bg-surface-2/80 px-4 py-3",
        className,
      )}
      {...props}
    >
      <span className="text-xs uppercase tracking-[0.2em] text-text-muted">
        {label}
      </span>
      <span className="text-lg font-semibold text-text-primary">{value}</span>
    </div>
  );
}
