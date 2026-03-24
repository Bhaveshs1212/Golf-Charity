"use client";

import { motion } from "framer-motion";

export default function Modal({
  open,
  title,
  children,
}: {
  open: boolean;
  title: string;
  children: React.ReactNode;
}) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6">
      <motion.div
        className="card w-full max-w-lg p-6"
        initial={{ opacity: 0, scale: 0.9, filter: "blur(6px)" }}
        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      >
        <h3 className="text-[22px] font-semibold text-text-primary">{title}</h3>
        <div className="mt-4 text-sm text-text-secondary">{children}</div>
      </motion.div>
    </div>
  );
}
