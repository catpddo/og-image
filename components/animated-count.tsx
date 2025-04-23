"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const AnimatedCount = ({
  value,
  padding = 2,
  duration = 0.8,
}: {
  value: number;
  padding?: number | undefined;
  duration?: number | undefined;
}) => {
  const [displayValues, setDisplayValues] = useState(
    value.toString().padStart(padding, "0").split("")
  );

  useEffect(() => {
    const debouncer = setTimeout(() => {
      if (value != null) {
        setDisplayValues(value.toString().padStart(padding, "0").split(""));
      }
    }, 50);

    return () => clearTimeout(debouncer);
  }, [value]);

  return (
    <AnimatePresence mode="popLayout">
      {displayValues.map((n, i) => (
        <motion.span
          className="inline-block tabular-nums"
          key={n + i}
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -12, opacity: 0 }}
          transition={{ type: "spring", bounce: 0.35, duration: duration }}
          style={{
            filter: "blur(0px)",
          }}
        >
          {n}
        </motion.span>
      ))}
    </AnimatePresence>
  );
};

export default AnimatedCount;
