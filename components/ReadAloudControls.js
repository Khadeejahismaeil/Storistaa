"use client";

import { useSpeech } from "@/lib/useSpeech";

const SPEEDS = [
  { label: "Slow", value: 0.8 },
  { label: "Normal", value: 1 },
  { label: "Lively", value: 1.2 },
];

// Premium "Read Aloud" bar: play / pause / resume / stop + speed control.
// `getText` returns the full narration string (built lazily so we don't
// recompute on every render).
export default function ReadAloudControls({ getText }) {
  const { supported, status, rate, speak, pause, resume, stop, setRate } =
    useSpeech();

  if (!supported) {
    return (
      <p className="text-center font-body text-xs text-moon-100/45">
        Read-aloud isn&apos;t supported in this browser.
      </p>
    );
  }

  const playing = status === "playing";
  const paused = status === "paused";

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex flex-wrap items-center justify-center gap-2.5">
        {!playing && !paused && (
          <button
            type="button"
            onClick={() => speak(getText())}
            className="btn-ghost"
          >
            ▶︎ Read aloud
          </button>
        )}
        {playing && (
          <button type="button" onClick={pause} className="btn-ghost">
            ⏸ Pause
          </button>
        )}
        {paused && (
          <button type="button" onClick={resume} className="btn-ghost">
            ▶︎ Resume
          </button>
        )}
        {(playing || paused) && (
          <button type="button" onClick={stop} className="btn-ghost">
            ⏹ Stop
          </button>
        )}

        {/* live "now narrating" indicator */}
        {playing && (
          <span className="flex items-center gap-1 pl-1 text-moon-300">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="h-3 w-1 animate-twinkle rounded-full bg-moon-300"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </span>
        )}
      </div>

      {/* Speed control */}
      <div className="flex items-center gap-2">
        <span className="font-body text-xs text-moon-100/50">Speed</span>
        {SPEEDS.map((s) => {
          const active = Math.abs(rate - s.value) < 0.01;
          return (
            <button
              key={s.value}
              type="button"
              onClick={() => setRate(s.value)}
              className={[
                "rounded-full px-3 py-1 font-body text-xs transition-all duration-200",
                active
                  ? "bg-moon-300 text-night-900"
                  : "border border-white/15 text-moon-100/70 hover:border-dream-glow/50 hover:text-moon-100",
              ].join(" ")}
            >
              {s.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
