"use client";

import { useEffect, useMemo, useRef, useState } from "react";

// Deterministic pseudo-random so server & client markup match (no hydration
// warnings). Rounded to 5 decimals so Node and the browser, which differ in
// Math.sin's last digits, produce byte-identical inline styles.
function seeded(i) {
  const x = Math.sin(i * 999.13) * 10000;
  return Math.round((x - Math.floor(x)) * 1e5) / 1e5;
}

export default function StarsBackground() {
  const starLayerRef = useRef(null);
  const cloudLayerRef = useRef(null);
  const [shooting, setShooting] = useState([]);

  const stars = useMemo(
    () =>
      Array.from({ length: 80 }).map((_, i) => ({
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
        top: 8 + seeded(i + 7) * 70,
        delay: seeded(i + 11) * -40,
        duration: 55 + seeded(i + 13) * 55,
        scale: 0.7 + seeded(i + 17) * 0.9,
        opacity: 0.05 + seeded(i + 19) * 0.06,
      })),
    []
  );

  const particles = useMemo(
    () =>
      Array.from({ length: 18 }).map((_, i) => ({
        id: i,
        left: seeded(i + 220) * 100,
        bottom: seeded(i + 260) * 30,
        size: 1.5 + seeded(i + 300) * 2.5,
        delay: seeded(i + 340) * 16,
        duration: 14 + seeded(i + 380) * 14,
      })),
    []
  );

  // --- Mouse parallax: shift the star & cloud layers gently ---
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    let tx = 0;
    let ty = 0;

    const onMove = (e) => {
      const nx = e.clientX / window.innerWidth - 0.5;
      const ny = e.clientY / window.innerHeight - 0.5;
      tx = nx;
      ty = ny;
      if (!frame) frame = requestAnimationFrame(apply);
    };
    const apply = () => {
      frame = 0;
      if (starLayerRef.current) {
        starLayerRef.current.style.transform = `translate3d(${tx * 18}px, ${ty * 18}px, 0)`;
      }
      if (cloudLayerRef.current) {
        cloudLayerRef.current.style.transform = `translate3d(${tx * 38}px, ${ty * 28}px, 0)`;
      }
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  // --- Occasional shooting stars (client-only, after mount) ---
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let timer;
    const spawn = () => {
      const id = Math.random().toString(36).slice(2);
      const star = {
        id,
        top: 5 + Math.random() * 45,
        left: 10 + Math.random() * 70,
        rotate: 20 + Math.random() * 25,
        duration: 0.9 + Math.random() * 0.6,
      };
      setShooting((prev) => [...prev, star]);
      setTimeout(() => {
        setShooting((prev) => prev.filter((s) => s.id !== id));
      }, star.duration * 1000 + 200);
      timer = setTimeout(spawn, 6000 + Math.random() * 9000);
    };
    timer = setTimeout(spawn, 3500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {/* Drifting cloud layer (more parallax) */}
      <div ref={cloudLayerRef} className="absolute inset-0 will-change-transform">
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
      </div>

      {/* Twinkling star layer (subtle parallax) */}
      <div ref={starLayerRef} className="absolute inset-0 will-change-transform">
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
      </div>

      {/* Slow rising magical particles */}
      {particles.map((p) => (
        <span
          key={`p-${p.id}`}
          className="absolute rounded-full bg-moon-200 animate-rise"
          style={{
            left: `${p.left}%`,
            bottom: `${p.bottom}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            boxShadow: "0 0 8px rgba(255,238,191,0.8)",
          }}
        />
      ))}

      {/* Shooting stars */}
      {shooting.map((s) => (
        <span
          key={s.id}
          className="absolute h-px w-24 sm:w-40"
          style={{
            top: `${s.top}%`,
            left: `${s.left}%`,
            transform: `rotate(${s.rotate}deg)`,
            background:
              "linear-gradient(90deg, rgba(255,248,231,0) 0%, rgba(255,248,231,0.9) 60%, #fff 100%)",
            borderRadius: "9999px",
            filter: "drop-shadow(0 0 6px rgba(255,248,231,0.9))",
            animation: `shoot ${s.duration}s ease-in forwards`,
          }}
        />
      ))}
    </div>
  );
}
