import type { HTMLAttributes } from "react";

import { cn } from "@/lib/cn";

type BadgeVariant = "active" | "inactive" | "pending" | "jackpot" | "paid";

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant;
};

const variantClass: Record<BadgeVariant, string> = {
  active: "badge badge-active",
  inactive: "badge badge-inactive",
  pending: "badge badge-pending",
  jackpot: "badge badge-jackpot",
  paid: "badge badge-paid",
};

export default function Badge({
  className,
  variant = "active",
  ...props
}: BadgeProps) {
  return <span className={cn(variantClass[variant], className)} {...props} />;
}
