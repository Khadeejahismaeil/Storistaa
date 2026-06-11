"use client";

import { useMemo } from "react";

// Deterministic pseudo-random so server & client markup match (no hydration warnings).
function seeded(i) {
  const x = Math.sin(i * 999.13) * 10000;
  return x - Math.floor(x);
}

export default function StarsBackground() {
  const stars = useMemo(
    () =>
      Array.from({ length: 70 }).map((_, i) => ({
        id: i,
        top: seeded(i + 1) * 100,
        left: seeded(i + 50) * 100,
        size: 1 + seeded(i + 100) * 2.5,
        delay: seeded(i + 150) * 4,
        duration: 2.5 + seeded(i + 200) * 3,
      })),
    []
  );

  const clouds = useMemo(
    () =>
      Array.from({ length: 4 }).map((_, i) => ({
        id: i,
        top: 10 + seeded(i + 7) * 70,
        delay: seeded(i + 11) * -40,
        duration: 50 + seeded(i + 13) * 50,
        scale: 0.7 + seeded(i + 17) * 0.9,
        opacity: 0.05 + seeded(i + 19) * 0.07,
      })),
    []
  );

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {/* Twinkling stars */}
      {stars.map((s) => (
        <span
          key={s.id}
          className="absolute rounded-full bg-moon-100 animate-twinkle"
          style={{
            top: `${s.top}%`,
            left: `${s.left}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.duration}s`,
            boxShadow: "0 0 6px rgba(255,248,231,0.9)",
          }}
        />
      ))}

      {/* Drifting clouds */}
      {clouds.map((c) => (
        <div
          key={c.id}
          className="absolute animate-drift"
          style={{
            top: `${c.top}%`,
            animationDelay: `${c.delay}s`,
            animationDuration: `${c.duration}s`,
          }}
        >
          <div
            className="h-16 w-44 rounded-full bg-dream-glow blur-2xl"
            style={{ transform: `scale(${c.scale})`, opacity: c.opacity }}
          />
        </div>
      ))}

      {/* A few floating sparkles */}
      {[...Array(8)].map((_, i) => (
        <span
          key={`sp-${i}`}
          className="absolute text-moon-200/70 animate-float"
          style={{
            top: `${seeded(i + 300) * 100}%`,
            left: `${seeded(i + 400) * 100}%`,
            fontSize: `${10 + seeded(i + 500) * 10}px`,
            animationDelay: `${seeded(i + 600) * 6}s`,
            animationDuration: `${5 + seeded(i + 700) * 5}s`,
          }}
        >
          ✦
        </span>
      ))}
    </div>
  );
}
