"use client";

import { motion } from "framer-motion";
import { useEffect } from "react";

// A brief, sophisticated sparkle burst that plays once when a story is born,
// then calls onDone so the parent can unmount it.
const SPARKLES = Array.from({ length: 16 }).map((_, i) => {
  const angle = (i / 16) * Math.PI * 2;
  return {
    id: i,
    x: Math.cos(angle) * (90 + (i % 4) * 22),
    y: Math.sin(angle) * (90 + (i % 4) * 22),
    glyph: ["✦", "✧", "⭑", "✺"][i % 4],
    delay: (i % 6) * 0.02,
  };
});

export default function Celebration({ onDone }) {
  useEffect(() => {
    const id = setTimeout(() => onDone?.(), 1500);
    return () => clearTimeout(id);
  }, [onDone]);

  return (
    <div className="pointer-events-none fixed inset-0 z-[60] flex items-center justify-center">
      <div className="relative">
        {/* soft expanding ring */}
        <motion.div
          initial={{ scale: 0, opacity: 0.5 }}
          animate={{ scale: 4, opacity: 0 }}
          transition={{ duration: 1.1, ease: "easeOut" }}
          className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ boxShadow: "0 0 60px 20px rgba(255, 217, 122, 0.45)" }}
        />
        {SPARKLES.map((s) => (
          <motion.span
            key={s.id}
            initial={{ x: 0, y: 0, scale: 0, opacity: 0 }}
            animate={{
              x: s.x,
              y: s.y,
              scale: [0, 1.1, 0],
              opacity: [0, 1, 0],
            }}
            transition={{ duration: 1.2, delay: s.delay, ease: "easeOut" }}
            className="absolute left-0 top-0 text-xl text-moon-200"
            style={{ filter: "drop-shadow(0 0 6px rgba(255,217,122,0.9))" }}
          >
            {s.glyph}
          </motion.span>
        ))}
      </div>
    </div>
  );
}
