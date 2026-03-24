"use client";

import { motion } from "framer-motion";

export default function Toast({ message }: { message: string }) {
  return (
    <motion.div
      className="fixed bottom-6 right-6 rounded-2xl border border-border/70 bg-surface-2/90 px-4 py-3 text-sm text-text-primary"
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
    >
      {message}
    </motion.div>
  );
}
