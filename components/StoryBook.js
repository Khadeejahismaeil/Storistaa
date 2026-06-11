"use client";

import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { getTheme } from "@/lib/themes";
import ReadAloudControls from "./ReadAloudControls";

// Split a story body into paragraphs for nicer spacing.
function toParagraphs(text) {
  return (text || "")
    .split(/\n{1,}/)
    .map((p) => p.trim())
    .filter(Boolean);
}

export default function StoryBook({
  story, // { title, story, lesson, tomorrow }
  childName,
  theme,
  onRegenerate,
  onNewStory,
  loading,
}) {
  const [copied, setCopied] = useState(false);
  const t = getTheme(theme);
  const paragraphs = useMemo(() => toParagraphs(story.story), [story.story]);

  const plainText = useMemo(() => {
    return [
      story.title,
      "",
      story.story,
      story.lesson ? `\nLesson learned: ${story.lesson}` : "",
      story.tomorrow ? `\nTomorrow's adventure: ${story.tomorrow}` : "",
    ]
      .filter(Boolean)
      .join("\n");
  }, [story]);

  const narration = useMemo(() => {
    return [
      story.title + ".",
      story.story,
      story.lesson ? `Tonight's lesson: ${story.lesson}` : "",
      story.tomorrow ? `And tomorrow: ${story.tomorrow}` : "",
    ]
      .filter(Boolean)
      .join(" ");
  }, [story]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(plainText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (_) {
      /* clipboard blocked — fail quietly */
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 30, scale: 0.97, rotateX: 6 }}
      animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
      transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
      style={{ perspective: 1200 }}
      className="mx-auto mt-10 w-full max-w-2xl"
    >
      <div className="storybook-frame">
        <div className="parchment px-6 py-9 sm:px-12 sm:py-12">
          {/* Theme + recipient ribbon */}
          <div className="mb-6 flex flex-col items-center gap-2">
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-body text-[11px] font-semibold uppercase tracking-[0.2em]"
              style={{ background: `${t.accent}22`, color: "#7a5a2b" }}
            >
              {t.icon} {t.label}
            </span>
            <p className="font-body text-xs uppercase tracking-[0.3em] text-[#9a7a4a]">
              A MoonTale for {childName || "you"}
            </p>
          </div>

          {/* Title */}
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.5 }}
            className="text-center font-display text-3xl font-bold leading-tight text-[#5b3d1d] sm:text-4xl"
          >
            {story.title}
          </motion.h2>
          <div className="mx-auto my-5 flex items-center justify-center gap-3 text-[#b08a4a]">
            <span className="h-px w-12 bg-[#c9a86a]" />
            <span>✦</span>
            <span className="h-px w-12 bg-[#c9a86a]" />
          </div>

          {/* Story body */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="story-prose"
          >
            {paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </motion.div>

          {/* Lesson + Tomorrow */}
          {(story.lesson || story.tomorrow) && (
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {story.lesson && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.55, duration: 0.5 }}
                  className="story-callout"
                >
                  <p className="story-callout-label">🌙 Lesson Learned</p>
                  <p className="mt-1.5 font-body text-[0.95rem] leading-relaxed text-[#4a3826]">
                    {story.lesson}
                  </p>
                </motion.div>
              )}
              {story.tomorrow && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.65, duration: 0.5 }}
                  className="story-callout"
                  style={{ borderStyle: "dashed" }}
                >
                  <p className="story-callout-label">✨ Tomorrow&apos;s Adventure</p>
                  <p className="mt-1.5 font-body text-[0.95rem] italic leading-relaxed text-[#4a3826]">
                    {story.tomorrow}
                  </p>
                </motion.div>
              )}
            </div>
          )}

          {/* closing */}
          <div className="mt-9 flex flex-col items-center gap-1 border-t border-[#c9a86a]/40 pt-6">
            <span className="text-2xl">🌙</span>
            <p className="font-display text-sm text-[#8a6a3a]">Sweet dreams ✨</p>
          </div>
        </div>
      </div>

      {/* Read aloud */}
      <div className="glass-card mt-5 p-5">
        <ReadAloudControls getText={() => narration} />
      </div>

      {/* Actions */}
      <div className="mt-5 flex flex-wrap justify-center gap-3">
        <button type="button" onClick={handleCopy} className="btn-ghost">
          {copied ? "✓ Copied!" : "📋 Copy story"}
        </button>
        <button
          type="button"
          onClick={onRegenerate}
          className="btn-ghost"
          disabled={loading}
        >
          🔄 Regenerate
        </button>
        <button type="button" onClick={onNewStory} className="btn-ghost">
          ✨ New story
        </button>
      </div>
      <p className="mt-4 text-center font-body text-xs text-moon-100/40">
        Saved to your library ✦
      </p>
    </motion.section>
  );
}
