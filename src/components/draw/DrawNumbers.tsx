"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

function useCountUp(target: number) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let frame = 0;
    const totalFrames = 18;
    const interval = setInterval(() => {
      frame += 1;
      const next = Math.round((target * frame) / totalFrames);
      setValue(next);
      if (frame >= totalFrames) {
        clearInterval(interval);
        setValue(target);
      }
    }, 30);

    return () => clearInterval(interval);
  }, [target]);

  return value;
}

function DrawNumber({ value }: { value: number }) {
  const displayValue = useCountUp(value);

  return (
    <motion.div
      className="flex h-12 w-12 items-center justify-center rounded-full border border-border/60 bg-surface-2/80 text-sm font-semibold shadow-[0_0_16px_rgba(167,139,250,0.45)]"
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 18 }}
    >
      {displayValue}
    </motion.div>
  );
}

export default function DrawNumbers({ numbers }: { numbers: number[] }) {
  return (
    <div className="flex flex-wrap gap-3">
      {numbers.map((number) => (
        <DrawNumber key={number} value={number} />
      ))}
    </div>
  );
}
