"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import StarsBackground from "@/components/StarsBackground";
import Hero from "@/components/Hero";
import StoryForm from "@/components/StoryForm";
import RevealSequence from "@/components/RevealSequence";
import StoryBook from "@/components/StoryBook";
import StoryLibrary from "@/components/StoryLibrary";
import ErrorBanner from "@/components/ErrorBanner";
import Celebration from "@/components/Celebration";
import { generateStory, hasApiKey } from "@/lib/openrouter";
import { loadLibrary, saveStory, deleteStory } from "@/lib/library";
import { DEFAULT_THEME } from "@/lib/themes";

const EMPTY = { childName: "", age: "", theme: DEFAULT_THEME, events: "" };
const MIN_REVEAL_MS = 3400; // keep the magical reveal in the 3–5s sweet spot

const wait = (ms) => new Promise((res) => setTimeout(res, ms));

export default function Home() {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | revealing | error
  const [errorMsg, setErrorMsg] = useState("");
  const [activeStory, setActiveStory] = useState(null); // { id, inputs, story }
  const [library, setLibrary] = useState([]);
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [celebrate, setCelebrate] = useState(false);

  const storyRef = useRef(null);
  const formRef = useRef(null);

  useEffect(() => {
    setLibrary(loadLibrary());
  }, []);

  const scrollTo = (ref) =>
    setTimeout(
      () => ref.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
      120
    );

  const handleChange = (key, value) => {
    setValues((v) => ({ ...v, [key]: value }));
    setErrors((e) => (e[key] ? { ...e, [key]: undefined } : e));
  };

  const validate = () => {
    const next = {};
    if (!values.childName.trim())
      next.childName = "Please enter your child's name.";
    const ageNum = parseInt(values.age, 10);
    if (!values.age.toString().trim()) {
      next.age = "Please enter an age.";
    } else if (Number.isNaN(ageNum) || ageNum < 1 || ageNum > 14) {
      next.age = "Enter an age between 1 and 14.";
    }
    if (!values.theme) next.theme = "Pick a story world.";
    if (!values.events.trim()) {
      next.events = "Tell us a little about their day.";
    } else if (values.events.trim().length < 4) {
      next.events = "Just a few more words about their day ✨";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  // Core generation flow: reveal + API run together, minimum 3.4s of magic.
  const runGeneration = async (inputs) => {
    setErrorMsg("");
    setStatus("revealing");
    try {
      const [story] = await Promise.all([
        generateStory(inputs),
        wait(MIN_REVEAL_MS),
      ]);
      const saved = saveStory({ inputs, story });
      setLibrary(loadLibrary());
      setActiveStory({ id: saved.id, inputs, story });
      setStatus("idle");
      setCelebrate(true);
      scrollTo(storyRef);
    } catch (err) {
      setStatus("error");
      setErrorMsg(
        err?.message || "The stars seem sleepy tonight. Please try again."
      );
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (status === "revealing") return;
    if (!validate()) return;
    runGeneration(values);
  };

  const handleRegenerate = () => {
    if (status === "revealing") return;
    const inputs = activeStory?.inputs || values;
    runGeneration(inputs);
  };

  const handleNewStory = () => {
    setActiveStory(null);
    setErrorMsg("");
    scrollTo(formRef);
  };

  // Library actions
  const reopen = (entry) => {
    setActiveStory({ id: entry.id, inputs: entry.inputs, story: entry.story });
    setLibraryOpen(false);
    scrollTo(storyRef);
  };
  const removeEntry = (id) => setLibrary(deleteStory(id));
  const regenerateFrom = (entry) => {
    setLibraryOpen(false);
    setValues(entry.inputs);
    runGeneration(entry.inputs);
  };

  return (
    <>
      <StarsBackground />

      {/* Floating library button */}
      <motion.button
        type="button"
        onClick={() => setLibraryOpen(true)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed right-4 top-4 z-30 flex items-center gap-2 rounded-full border border-white/15 bg-night-800/70 px-4 py-2 font-display text-sm text-moon-100 backdrop-blur-md transition hover:border-dream-glow/60 hover:shadow-glow"
      >
        <span>📚</span>
        <span className="hidden sm:inline">My Library</span>
        {library.length > 0 && (
          <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-moon-300 px-1.5 text-xs font-bold text-night-900">
            {library.length}
          </span>
        )}
      </motion.button>

      <main className="relative mx-auto flex min-h-screen w-full max-w-5xl flex-col px-4 pb-24">
        <Hero />

        {/* Setup hint if no API key configured */}
        {!hasApiKey() && (
          <div className="mx-auto mt-8 w-full max-w-2xl rounded-2xl border border-moon-300/30 bg-moon-300/10 px-5 py-4 text-center text-sm text-moon-100/90 backdrop-blur-md">
            <span className="font-display">✦ Setup needed:</span> add your
            OpenRouter API key to{" "}
            <code className="rounded bg-night-900/50 px-1.5 py-0.5">.env.local</code>{" "}
            to start dreaming up stories.
          </div>
        )}

        {/* Form OR story */}
        <AnimatePresence mode="wait">
          {activeStory ? (
            <div key="story" ref={storyRef}>
              <StoryBook
                key={activeStory.id}
                story={activeStory.story}
                childName={activeStory.inputs?.childName}
                theme={activeStory.inputs?.theme}
                onRegenerate={handleRegenerate}
                onNewStory={handleNewStory}
                loading={status === "revealing"}
              />
            </div>
          ) : (
            <div key="form" ref={formRef}>
              <StoryForm
                values={values}
                errors={errors}
                onChange={handleChange}
                onSubmit={handleSubmit}
                loading={status === "revealing"}
              />
              <ErrorBanner
                message={status === "error" ? errorMsg : ""}
                onDismiss={() => setStatus("idle")}
              />
              <p className="mx-auto mt-8 max-w-2xl text-center font-body text-sm italic text-moon-100/40">
                🌙 Tonight&apos;s story has not been written yet.
              </p>
            </div>
          )}
        </AnimatePresence>

        {/* error banner also when a story is currently shown */}
        {activeStory && (
          <ErrorBanner
            message={status === "error" ? errorMsg : ""}
            onDismiss={() => setStatus("idle")}
          />
        )}

        <footer className="mt-16 text-center font-body text-xs text-moon-100/40">
          Made with moonlight ✦ MoonTales · stories are AI-generated, please read
          along
        </footer>
      </main>

      {/* Magical reveal overlay */}
      <AnimatePresence>
        {status === "revealing" && <RevealSequence key="reveal" />}
      </AnimatePresence>

      {/* Celebration burst */}
      {celebrate && <Celebration onDone={() => setCelebrate(false)} />}

      {/* Library drawer */}
      <StoryLibrary
        open={libraryOpen}
        onClose={() => setLibraryOpen(false)}
        entries={library}
        onReopen={reopen}
        onDelete={removeEntry}
        onRegenerate={regenerateFrom}
      />
    </>
  );
}
