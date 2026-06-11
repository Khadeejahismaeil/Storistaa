"use client";

import { motion } from "framer-motion";
import { THEMES } from "@/lib/themes";

export default function StoryForm({
  values,
  errors,
  onChange,
  onSubmit,
  loading,
}) {
  const set = (key) => (e) => onChange(key, e.target.value);

  return (
    <motion.form
      onSubmit={onSubmit}
      noValidate
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="glass-card mx-auto mt-12 w-full max-w-2xl p-6 sm:p-9"
    >
      <h2 className="mb-1 text-center font-display text-2xl font-semibold text-moon-100">
        Tonight&apos;s storyteller is ready
      </h2>
      <p className="mb-7 text-center font-body text-sm text-moon-100/60">
        Tell us about your little one and their day ✦
      </p>

      <div className="grid gap-5 sm:grid-cols-2">
        {/* Child name */}
        <div>
          <label htmlFor="childName" className="field-label">
            Child&apos;s name
          </label>
          <input
            id="childName"
            type="text"
            className="field-input"
            placeholder="e.g. Luna"
            value={values.childName}
            onChange={set("childName")}
            maxLength={40}
            autoComplete="off"
          />
          {errors.childName && (
            <p className="mt-1.5 text-sm text-rose-300/90">{errors.childName}</p>
          )}
        </div>

        {/* Age */}
        <div>
          <label htmlFor="age" className="field-label">
            Age
          </label>
          <input
            id="age"
            type="number"
            inputMode="numeric"
            min="1"
            max="14"
            className="field-input"
            placeholder="e.g. 5"
            value={values.age}
            onChange={set("age")}
          />
          {errors.age && (
            <p className="mt-1.5 text-sm text-rose-300/90">{errors.age}</p>
          )}
        </div>
      </div>

      {/* Theme selector */}
      <div className="mt-6">
        <span className="field-label">Choose tonight&apos;s world</span>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {THEMES.map((t) => {
            const active = values.theme === t.id;
            return (
              <motion.button
                key={t.id}
                type="button"
                onClick={() => onChange("theme", t.id)}
                aria-pressed={active}
                whileHover={{ y: -4, scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 22 }}
                className="group relative flex min-h-[112px] flex-col items-center gap-1.5 overflow-hidden rounded-2xl border px-3 py-4 text-center transition-colors duration-300"
                style={{
                  borderColor: active ? t.accent : "rgba(255,255,255,0.1)",
                  background: active
                    ? `linear-gradient(160deg, ${t.accent}22, transparent)`
                    : "rgba(255,255,255,0.04)",
                  boxShadow: active ? `0 0 28px ${t.glow}` : "none",
                }}
              >
                {/* glow wash on hover */}
                <span
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{
                    background: `radial-gradient(120% 80% at 50% 0%, ${t.accent}22, transparent 70%)`,
                  }}
                />
                <motion.span
                  className="text-3xl"
                  animate={active ? { scale: [1, 1.18, 1] } : { scale: 1 }}
                  transition={{ duration: 0.45 }}
                >
                  {t.icon}
                </motion.span>
                <span className="font-display text-sm font-semibold text-moon-100">
                  {t.label}
                </span>
                <span className="font-body text-[11px] leading-tight text-moon-100/55">
                  {t.tagline}
                </span>
                {active && (
                  <motion.span
                    layoutId="theme-check"
                    className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-bold text-night-900"
                    style={{ background: t.accent }}
                  >
                    ✓
                  </motion.span>
                )}
              </motion.button>
            );
          })}
        </div>
        {errors.theme && (
          <p className="mt-1.5 text-sm text-rose-300/90">{errors.theme}</p>
        )}
      </div>

      {/* Events / plot */}
      <div className="mt-6">
        <label htmlFor="events" className="field-label">
          What happened in their day?
        </label>
        <textarea
          id="events"
          rows={4}
          className="field-input resize-none"
          placeholder="We went to the park, found a tiny snail, ate spaghetti, and were a little scared of the dark closet…"
          value={values.events}
          onChange={set("events")}
          maxLength={1000}
        />
        <div className="mt-1 flex items-center justify-between">
          {errors.events ? (
            <p className="text-sm text-rose-300/90">{errors.events}</p>
          ) : (
            <span className="text-xs text-moon-100/40">
              The more little details, the more magical the story ✦
            </span>
          )}
          <span className="text-xs text-moon-100/40">
            {values.events.length}/1000
          </span>
        </div>
      </div>

      <div className="mt-8 flex justify-center">
        <motion.button
          type="submit"
          className="btn-primary"
          disabled={loading}
          whileHover={{ scale: loading ? 1 : 1.04 }}
          whileTap={{ scale: loading ? 1 : 0.97 }}
        >
          {loading ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-night-900/40 border-t-night-900" />
              Writing…
            </>
          ) : (
            <>✨ Weave tonight&apos;s story</>
          )}
        </motion.button>
      </div>
    </motion.form>
  );
}
