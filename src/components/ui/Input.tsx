import type { InputHTMLAttributes } from "react";

import { cn } from "@/lib/cn";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  hasError?: boolean;
};

export default function Input({ className, hasError, ...props }: InputProps) {
  return (
    <input
      className={cn("input", hasError && "input-error", className)}
      {...props}
    />
  );
}
