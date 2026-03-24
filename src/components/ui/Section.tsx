import type { HTMLAttributes } from "react";

import { cn } from "@/lib/cn";

type SectionProps = HTMLAttributes<HTMLDivElement> & {
  title?: string;
  subtitle?: string;
};

export default function Section({
  className,
  title,
  subtitle,
  children,
  ...props
}: SectionProps) {
  return (
    <section className={cn("space-y-6", className)} {...props}>
      {(title || subtitle) && (
        <header className="space-y-2">
          {title && (
            <h2 className="text-[28px] font-semibold text-primary">{title}</h2>
          )}
          {subtitle && (
            <p className="text-base text-text-secondary max-w-2xl">
              {subtitle}
            </p>
          )}
        </header>
      )}
      {children}
    </section>
  );
}
