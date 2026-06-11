"use client";

import { useEffect, useRef, useState } from "react";
import StarsBackground from "@/components/StarsBackground";
import Hero from "@/components/Hero";
import StoryForm from "@/components/StoryForm";
import LoadingState, { MESSAGES } from "@/components/LoadingState";
import StoryOutput from "@/components/StoryOutput";
import ErrorBanner from "@/components/ErrorBanner";
import { generateStory, hasApiKey } from "@/lib/openrouter";

const EMPTY = { childName: "", age: "", theme: "Fantasy", events: "" };

export default function Home() {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [story, setStory] = useState("");
  const [apiError, setApiError] = useState("");
  const [storyName, setStoryName] = useState("");
  const [loadingMsg, setLoadingMsg] = useState(0);

  const outputRef = useRef(null);

  // Rotate the dreamy loading messages.
  useEffect(() => {
    if (!loading) return;
    const id = setInterval(
      () => setLoadingMsg((m) => (m + 1) % MESSAGES.length),
      2200
    );
    return () => clearInterval(id);
  }, [loading]);

  const handleChange = (key, value) => {
    setValues((v) => ({ ...v, [key]: value }));
    setErrors((e) => (e[key] ? { ...e, [key]: undefined } : e));
  };

  const validate = () => {
    const next = {};
    if (!values.childName.trim()) next.childName = "Please enter your child's name.";
    const ageNum = parseInt(values.age, 10);
    if (!values.age.toString().trim()) {
      next.age = "Please enter an age.";
    } else if (Number.isNaN(ageNum) || ageNum < 1 || ageNum > 14) {
      next.age = "Enter an age between 1 and 14.";
    }
    if (!values.theme) next.theme = "Pick a story theme.";
    if (!values.events.trim()) {
      next.events = "Tell us a little about their day.";
    } else if (values.events.trim().length < 4) {
      next.events = "Just a few more words about their day ✨";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const runGeneration = async () => {
    setApiError("");
    setLoading(true);
    setLoadingMsg(0);
    try {
      const result = await generateStory(values);
      setStory(result);
      setStoryName(values.childName.trim());
      // Smooth-scroll to the story once it arrives.
      setTimeout(() => {
        outputRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } catch (err) {
      setApiError(err?.message || "Something went wrong. Please try again.");
      setStory("");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    runGeneration();
  };

  const handleRegenerate = () => {
    if (loading) return;
    runGeneration();
  };

  const handleClear = () => {
    setValues(EMPTY);
    setErrors({});
    setStory("");
    setApiError("");
    setStoryName("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <StarsBackground />

      <main className="relative mx-auto flex min-h-screen w-full max-w-5xl flex-col px-4 pb-24">
        <Hero />

        {/* Friendly hint if no API key is configured yet. */}
        {!hasApiKey() && (
          <div className="mx-auto mt-8 w-full max-w-2xl rounded-2xl border border-moon-300/30 bg-moon-300/10 px-5 py-4 text-center text-sm text-moon-100/90 backdrop-blur-md">
            <span className="font-display">✦ Setup needed:</span> add your
            OpenRouter API key to <code className="rounded bg-night-900/50 px-1.5 py-0.5">.env.local</code>{" "}
            (or <code className="rounded bg-night-900/50 px-1.5 py-0.5">lib/openrouter.js</code>) to start generating stories.
          </div>
        )}

        <StoryForm
          values={values}
          errors={errors}
          onChange={handleChange}
          onSubmit={handleSubmit}
          loading={loading}
        />

        <ErrorBanner message={apiError} onDismiss={() => setApiError("")} />

        <div ref={outputRef}>
          {loading && <LoadingState messageIndex={loadingMsg} />}

          {!loading && story && (
            <StoryOutput
              story={story}
              childName={storyName}
              onRegenerate={handleRegenerate}
              onClear={handleClear}
              loading={loading}
            />
          )}
        </div>

        <footer className="mt-16 text-center font-body text-xs text-moon-100/40">
          Made with moonlight ✦ MoonTales · stories are AI-generated, please read along
        </footer>
      </main>
    </>
  );
}
