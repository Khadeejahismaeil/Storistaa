"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// A small wrapper around the browser SpeechSynthesis API tuned for reading
// stories aloud: play / pause / resume / stop, plus a live reading-speed
// control. Includes the well-known Chrome keep-alive workaround so long
// narrations don't silently stop after ~15s.
export function useSpeech() {
  const [supported, setSupported] = useState(false);
  const [status, setStatus] = useState("idle"); // idle | playing | paused
  const [rate, setRateState] = useState(1);

  const textRef = useRef("");
  const rateRef = useRef(1);
  const keepAlive = useRef(null);

  useEffect(() => {
    setSupported(
      typeof window !== "undefined" && "speechSynthesis" in window
    );
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      clearInterval(keepAlive.current);
    };
  }, []);

  const stopKeepAlive = () => clearInterval(keepAlive.current);

  const startKeepAlive = () => {
    clearInterval(keepAlive.current);
    keepAlive.current = setInterval(() => {
      const synth = window.speechSynthesis;
      if (synth.speaking && !synth.paused) {
        synth.pause();
        synth.resume();
      }
    }, 9000);
  };

  const speak = useCallback((text) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const synth = window.speechSynthesis;
    synth.cancel();

    const content = (text ?? textRef.current ?? "").toString();
    if (!content.trim()) return;
    textRef.current = content;

    const utter = new SpeechSynthesisUtterance(content);
    utter.rate = rateRef.current;
    utter.pitch = 1.0;
    utter.lang = "en-US";
    utter.onend = () => {
      setStatus("idle");
      stopKeepAlive();
    };
    utter.onerror = () => {
      setStatus("idle");
      stopKeepAlive();
    };

    synth.speak(utter);
    setStatus("playing");
    startKeepAlive();
  }, []);

  const pause = useCallback(() => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.pause();
    stopKeepAlive();
    setStatus("paused");
  }, []);

  const resume = useCallback(() => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.resume();
    startKeepAlive();
    setStatus("playing");
  }, []);

  const stop = useCallback(() => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    stopKeepAlive();
    setStatus("idle");
  }, []);

  // Changing speed restarts narration at the new rate (best UX for a slider).
  const setRate = useCallback(
    (value) => {
      const v = Math.min(1.5, Math.max(0.6, Number(value) || 1));
      rateRef.current = v;
      setRateState(v);
      if (status === "playing") {
        speak(textRef.current);
      }
    },
    [status, speak]
  );

  return { supported, status, rate, speak, pause, resume, stop, setRate };
}
