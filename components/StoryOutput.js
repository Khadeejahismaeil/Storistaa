"use client";

import { useMemo, useState } from "react";

export default function StoryOutput({ story, childName, onRegenerate, onClear, loading }) {
  const [copied, setCopied] = useState(false);

  // Split off an optional first-line title from the body.
  const { title, body } = useMemo(() => {
    const lines = story.split("\n");
    const first = lines[0]?.trim() || "";
    const looksLikeTitle =
      first.length > 0 && first.length <= 60 && !/[.!?]$/.test(first);
    if (looksLikeTitle && lines.length > 1) {
      return { title: first.replace(/^#+\s*/, ""), body: lines.slice(1).join("\n").trim() };
    }
    return { title: "", body: story };
  }, [story]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(story);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (_) {
      // Clipboard may be blocked; fail quietly.
    }
  };

  return (
    <section className="glass-card mx-auto mt-12 w-full max-w-2xl overflow-hidden animate-fade-up">
      {/* Storybook header */}
      <div className="relative border-b border-white/10 bg-gradient-to-r from-dream-purple/30 via-dream-violet/20 to-dream-purple/30 px-7 py-6 text-center">
        <span className="absolute left-5 top-5 animate-twinkle text-moon-200">✦</span>
        <span className="absolute right-5 top-5 animate-twinkle text-moon-200">✧</span>
        <p className="font-body text-xs uppercase tracking-[0.3em] text-moon-200/70">
          A MoonTale for {childName || "you"}
        </p>
        {title && (
          <h2 className="mt-2 font-display text-2xl font-semibold text-moon-100 moon-glow-text sm:text-3xl">
            {title}
          </h2>
        )}
      </div>

      {/* Story body */}
      <div className="px-7 py-8 sm:px-10">
        <div className="story-prose">{body}</div>

        <div className="mt-8 flex flex-col items-center gap-2 border-t border-white/10 pt-6">
          <span className="text-2xl">🌙</span>
          <p className="font-display text-sm text-moon-200/70">Sweet dreams ✨</p>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap justify-center gap-3 border-t border-white/10 bg-night-900/30 px-7 py-5">
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
        <button type="button" onClick={onClear} className="btn-ghost">
          🧹 Clear form
        </button>
      </div>
    </section>
  );
}
