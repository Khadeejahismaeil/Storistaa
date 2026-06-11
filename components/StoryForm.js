"use client";

const THEMES = [
  { value: "Fantasy", label: "Fantasy", icon: "🧚" },
  { value: "Comedy", label: "Comedy", icon: "😄" },
  { value: "Sci-fi", label: "Sci-fi", icon: "🚀" },
  { value: "Soft horror / spooky", label: "Cozy-Spooky", icon: "👻" },
];

export default function StoryForm({
  values,
  errors,
  onChange,
  onSubmit,
  loading,
}) {
  const set = (key) => (e) => onChange(key, e.target.value);

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="glass-card mx-auto mt-12 w-full max-w-2xl p-6 animate-fade-up sm:p-9"
    >
      <h2 className="mb-6 text-center font-display text-2xl font-semibold text-moon-100">
        Tell us about your little one
      </h2>

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
      <div className="mt-5">
        <span className="field-label">Story theme</span>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {THEMES.map((t) => {
            const active = values.theme === t.value;
            return (
              <button
                key={t.value}
                type="button"
                onClick={() => onChange("theme", t.value)}
                aria-pressed={active}
                className={[
                  "flex flex-col items-center gap-1 rounded-2xl border px-3 py-4 transition-all duration-300",
                  active
                    ? "border-moon-300/80 bg-moon-300/10 shadow-glow scale-[1.03]"
                    : "border-white/10 bg-white/5 hover:border-dream-glow/50 hover:bg-white/10",
                ].join(" ")}
              >
                <span className="text-2xl">{t.icon}</span>
                <span className="font-display text-xs font-medium text-moon-100">
                  {t.label}
                </span>
              </button>
            );
          })}
        </div>
        {errors.theme && (
          <p className="mt-1.5 text-sm text-rose-300/90">{errors.theme}</p>
        )}
      </div>

      {/* Events / plot */}
      <div className="mt-5">
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
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-night-900/40 border-t-night-900" />
              Writing…
            </>
          ) : (
            <>✨ Generate Story</>
          )}
        </button>
      </div>
    </form>
  );
}
