"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const PHASES = [
  "The moon is collecting tonight's memories…",
  "The stars are weaving a new adventure…",
  "The storybook is opening…",
];

// Full-screen, immersive reveal shown while the story is being generated.
// Phases advance on their own timer (~1.1s each) and hold on the final phase
// if generation takes a little longer. The whole overlay fades out (handled by
// the parent's AnimatePresence) once the story is ready.
export default function RevealSequence() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setPhase((p) => Math.min(p + 1, PHASES.length - 1));
    }, 1100);
    return () => clearInterval(id);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.5 } }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center px-6 text-center"
      style={{
        background:
          "radial-gradient(circle at 50% 40%, rgba(26,22,64,0.6), rgba(10,10,35,0.85))",
        backdropFilter: "blur(8px)",
      }}
    >
      {/* Glowing moon writing the story */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative mb-10 h-28 w-28"
      >
        <div className="absolute inset-0 animate-pulse-glow rounded-full bg-gradient-to-br from-moon-100 via-moon-200 to-moon-300 shadow-glow-moon" />
        <motion.span
          className="absolute inset-0 flex items-center justify-center text-5xl"
          animate={{ y: [0, -8, 0], rotate: [0, 4, -4, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          🌙
        </motion.span>
        {/* orbiting sparkles */}
        {["-right-2 -top-2", "-bottom-2 -left-3", "-right-4 bottom-2"].map(
          (pos, i) => (
            <span
              key={i}
              className={`absolute ${pos} animate-twinkle text-lg`}
              style={{ animationDelay: `${i * 0.6}s` }}
            >
              ✦
            </span>
          )
        )}
      </motion.div>

      <div className="h-16">
        <AnimatePresence mode="wait">
          <motion.p
            key={phase}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="font-display text-xl text-moon-100 moon-glow-text sm:text-2xl"
          >
            {PHASES[phase]}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Progress dots */}
      <div className="mt-6 flex gap-2.5">
        {PHASES.map((_, i) => (
          <motion.span
            key={i}
            className="h-2 w-2 rounded-full bg-moon-300"
            animate={{
              opacity: i <= phase ? 1 : 0.3,
              scale: i === phase ? [1, 1.4, 1] : 1,
            }}
            transition={{
              duration: i === phase ? 1 : 0.3,
              repeat: i === phase ? Infinity : 0,
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}
