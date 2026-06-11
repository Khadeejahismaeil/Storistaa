"use client";

import { AnimatePresence, motion } from "framer-motion";
import { getTheme } from "@/lib/themes";

function formatDate(ts) {
  try {
    return new Date(ts).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch (_) {
    return "";
  }
}

function entryToText(entry) {
  const s = entry.story || {};
  return [
    s.title,
    "",
    s.story,
    s.lesson ? `\nLesson learned: ${s.lesson}` : "",
    s.tomorrow ? `\nTomorrow's adventure: ${s.tomorrow}` : "",
  ]
    .filter(Boolean)
    .join("\n");
}

export default function StoryLibrary({
  open,
  onClose,
  entries,
  onReopen,
  onDelete,
  onRegenerate,
}) {
  const copy = async (entry) => {
    try {
      await navigator.clipboard.writeText(entryToText(entry));
    } catch (_) {
      /* ignore */
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-night-900/70 backdrop-blur-sm"
          />

          {/* drawer */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-white/10 bg-night-800/95 backdrop-blur-xl"
          >
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
              <div>
                <h2 className="font-display text-xl font-semibold text-moon-100">
                  My Story Library
                </h2>
                <p className="font-body text-xs text-moon-100/50">
                  {entries.length}{" "}
                  {entries.length === 1 ? "bedtime tale" : "bedtime tales"} saved
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close library"
                className="rounded-full border border-white/15 px-3 py-1.5 text-moon-100/70 transition hover:border-dream-glow/50 hover:text-moon-100"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-5">
              {entries.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center px-6 text-center">
                  <span className="mb-4 text-5xl animate-float">📚</span>
                  <p className="font-display text-lg text-moon-100/90">
                    Your bookshelf is waiting for its first adventure.
                  </p>
                  <p className="mt-2 font-body text-sm text-moon-100/50">
                    Every story you create will be tucked in here.
                  </p>
                </div>
              ) : (
                <ul className="space-y-3">
                  {entries.map((entry) => {
                    const t = getTheme(entry.theme);
                    return (
                      <motion.li
                        key={entry.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: 40 }}
                        className="glass-card overflow-hidden p-4"
                      >
                        <button
                          type="button"
                          onClick={() => onReopen(entry)}
                          className="block w-full text-left"
                        >
                          <div className="flex items-start gap-3">
                            <span
                              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xl"
                              style={{ background: `${t.accent}22` }}
                            >
                              {t.icon}
                            </span>
                            <div className="min-w-0 flex-1">
                              <p className="truncate font-display text-base font-semibold text-moon-100">
                                {entry.story?.title || "Untitled tale"}
                              </p>
                              <p className="mt-0.5 font-body text-xs text-moon-100/55">
                                {entry.childName || "—"} · {t.label} ·{" "}
                                {formatDate(entry.savedAt)}
                              </p>
                            </div>
                          </div>
                        </button>

                        <div className="mt-3 flex flex-wrap gap-2 border-t border-white/10 pt-3">
                          <button
                            type="button"
                            onClick={() => onReopen(entry)}
                            className="rounded-full border border-white/15 px-3 py-1 font-body text-xs text-moon-100/80 transition hover:border-dream-glow/50 hover:text-moon-100"
                          >
                            Open
                          </button>
                          <button
                            type="button"
                            onClick={() => copy(entry)}
                            className="rounded-full border border-white/15 px-3 py-1 font-body text-xs text-moon-100/80 transition hover:border-dream-glow/50 hover:text-moon-100"
                          >
                            Copy
                          </button>
                          <button
                            type="button"
                            onClick={() => onRegenerate(entry)}
                            className="rounded-full border border-white/15 px-3 py-1 font-body text-xs text-moon-100/80 transition hover:border-dream-glow/50 hover:text-moon-100"
                          >
                            Regenerate
                          </button>
                          <button
                            type="button"
                            onClick={() => onDelete(entry.id)}
                            className="ml-auto rounded-full border border-rose-400/25 px-3 py-1 font-body text-xs text-rose-200/80 transition hover:border-rose-400/60 hover:text-rose-100"
                          >
                            Delete
                          </button>
                        </div>
                      </motion.li>
                    );
                  })}
                </ul>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
