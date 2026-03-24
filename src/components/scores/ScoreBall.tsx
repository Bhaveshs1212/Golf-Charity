"use client";

import { motion } from "framer-motion";

export default function ScoreBall({ value }: { value: number }) {
  return (
    <motion.div
      className="flex h-12 w-12 items-center justify-center rounded-full border border-border/60 bg-surface-3/70 text-sm font-semibold"
      initial={{ scale: 0.7, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 320, damping: 18 }}
    >
      {value}
    </motion.div>
  );
}
