"use client";

import { AnimatePresence, motion } from "framer-motion";

// Gentle, on-theme error message. The message text itself is already written
// in MoonTales' friendly voice (see lib/openrouter.js).
export default function ErrorBanner({ message, onDismiss }) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          role="alert"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="mx-auto mt-8 w-full max-w-2xl rounded-2xl border border-dream-glow/30 bg-dream-violet/10 px-5 py-4 text-moon-100 backdrop-blur-md"
        >
          <div className="flex items-start gap-3">
            <span className="text-xl">🌌</span>
            <div className="flex-1">
              <p className="font-display text-sm font-semibold text-moon-200">
                A little hush before the story
              </p>
              <p className="mt-0.5 font-body text-sm text-moon-100/85">
                {message}
              </p>
            </div>
            {onDismiss && (
              <button
                type="button"
                onClick={onDismiss}
                className="rounded-full px-2 text-moon-100/60 transition hover:text-moon-100"
                aria-label="Dismiss"
              >
                ✕
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
