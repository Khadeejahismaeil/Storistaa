// lib/openrouter.js
// Frontend-only OpenRouter integration for MoonTales.
//
// ┌─────────────────────────────────────────────────────────────────────┐
// │  HOW TO ADD YOUR OPENROUTER API KEY                                   │
// │                                                                       │
// │  Preferred: create a file named `.env.local` in the project root      │
// │  and add:                                                             │
// │      NEXT_PUBLIC_OPENROUTER_API_KEY=sk-or-your-key-here               │
// │                                                                       │
// │  Or (quick test only): paste your key into the placeholder below.     │
// └─────────────────────────────────────────────────────────────────────┘

import { getTheme } from "./themes";

// 👇👇👇  PASTE YOUR OPENROUTER API KEY HERE (between the quotes)  👇👇👇
const OPENROUTER_API_KEY_PLACEHOLDER = "PASTE_YOUR_OPENROUTER_API_KEY_HERE";
// 👆👆👆 ----------------------------------------------------------- 👆👆👆

const API_KEY =
  process.env.NEXT_PUBLIC_OPENROUTER_API_KEY || OPENROUTER_API_KEY_PLACEHOLDER;

// Model is kept on the free gpt-oss-20b route. Override via env if desired.
const MODEL =
  process.env.NEXT_PUBLIC_OPENROUTER_MODEL || "openai/gpt-oss-20b:free";

const ENDPOINT = "https://openrouter.ai/api/v1/chat/completions";

// Friendly, on-theme error copy — never show raw technical errors to parents.
const FRIENDLY = {
  network:
    "The stars seem sleepy tonight. Please check your connection and try again in a moment.",
  rate: "Too many wishes at once. Let's wait for the stars to catch up, then try again.",
  auth: "The moon doesn't recognise tonight's secret word — please check your OpenRouter API key.",
  missingKey:
    "MoonTales needs an OpenRouter API key to dream up stories. Add it to .env.local to begin.",
  empty: "The storybook opened to a blank page. Let's wish upon it once more.",
  generic: "The stars seem sleepy tonight. Please try again in a moment.",
};

// Pick narrative complexity & length based on the child's age.
function ageGuidance(age) {
  const n = parseInt(age, 10);
  if (Number.isNaN(n)) {
    return "Use simple, warm language suitable for a young child.";
  }
  if (n <= 4) {
    return `The hero is a toddler (age ${n}). Use very simple words, short sentences, gentle repetition, and soothing imagery. Keep the story around 200-300 words.`;
  }
  if (n <= 7) {
    return `The hero is ${n} years old. Use simple, vivid language, an easy-to-follow plot, friendly characters, and a little playful dialogue. Aim for about 320-450 words.`;
  }
  if (n <= 10) {
    return `The hero is ${n} years old. You can use richer vocabulary, a more adventurous plot, and real dialogue with feeling — while staying gentle and bedtime-friendly. Aim for about 450-600 words.`;
  }
  return `The hero is ${n} years old. Use engaging, imaginative storytelling with a touch more depth and emotional nuance, while keeping it calm, kind, and bedtime-appropriate. Aim for about 500-650 words.`;
}

// Build the system + user prompts sent to the AI.
export function buildStoryPrompt({ childName, age, theme, events }) {
  const name = childName?.trim() || "the child";
  const t = getTheme(theme);

  const system = [
    "You are MoonTales, a master bedtime storyteller who writes warm, magical, deeply personal stories for parents to read to their children.",
    "You transform the small, real moments of a child's day into an extraordinary adventure where they are the hero.",
    "",
    "Craft every story so that it:",
    "- Makes the child the clear, brave, kind HERO of the tale (always use their real name).",
    "- Adapts vocabulary, sentence length, and themes precisely to the child's age.",
    "- Transforms the ordinary events of their day into something wondrous and imaginative.",
    "- Includes meaningful, age-appropriate dialogue that gives characters warmth and personality.",
    "- Has a genuine emotional heartbeat — a small moment of courage, kindness, wonder, or feeling.",
    "- Weaves in gentle humor when it fits.",
    "- Follows a clear arc: a cozy beginning, a gentle middle with a small challenge, and a satisfying end.",
    "- Always ends with comfort, safety, and the child drifting happily toward sleep.",
    "- Avoids anything scary, violent, sad for long, or otherwise inappropriate for bedtime.",
    "",
    "Write flowing prose in real paragraphs — no markdown headings, no bullet points, no asterisks.",
  ].join("\n");

  const user = [
    "Write tonight's bedtime story using these details:",
    "",
    `Child's name (the hero): ${name}`,
    `Child's age: ${age || "unknown"}`,
    `Theme: ${t.label}`,
    "",
    "What really happened in their day (transform these into the adventure):",
    events?.trim() || "A cozy, ordinary day at home.",
    "",
    `Theme guidance: ${t.promptGuide}`,
    `Age guidance: ${ageGuidance(age)}`,
    "",
    "Respond in EXACTLY this format, using these four labels, each on its own line:",
    "",
    "TITLE: <a short, enchanting title — no quotation marks>",
    "STORY:",
    "<the full bedtime story in flowing paragraphs>",
    "LESSON: <one gentle sentence describing the lesson learned>",
    "TOMORROW: <one or two sentences teasing tomorrow's adventure, sparking excited anticipation>",
    "",
    "Do not add anything outside these four sections.",
  ].join("\n");

  return { system, user };
}

// Tidy a captured section: strip stray markdown / quotes / whitespace.
function tidy(s) {
  return (s || "")
    .replace(/^\s*\*+\s*/, "")
    .replace(/\s*\*+\s*$/, "")
    .replace(/^#+\s*/, "")
    .replace(/^["“'']+|["”'']+$/g, "")
    .trim();
}

// Parse the labelled response into structured parts. Tolerant of a model that
// drifts from the format: falls back to treating everything as the story.
export function parseStructuredStory(raw, { childName, theme } = {}) {
  const clean = (raw || "").replace(/\r/g, "").trim();

  const grab = (label, nextLabels) => {
    const start = new RegExp(`${label}\\s*:`, "i").exec(clean);
    if (!start) return "";
    const from = start.index + start[0].length;
    let end = clean.length;
    for (const nl of nextLabels) {
      const m = new RegExp(`\\n\\s*${nl}\\s*:`, "i").exec(clean.slice(from));
      if (m) end = Math.min(end, from + m.index);
    }
    return clean.slice(from, end).trim();
  };

  let title = tidy(grab("TITLE", ["STORY", "LESSON", "TOMORROW"]));
  let story = grab("STORY", ["LESSON", "TOMORROW"]).trim();
  const lesson = tidy(grab("LESSON", ["TOMORROW"]));
  const tomorrow = tidy(grab("TOMORROW", []));

  // Fallback: model ignored the format entirely.
  if (!story) {
    story = clean;
  }
  if (!title) {
    const t = getTheme(theme);
    title = childName ? `${childName}'s ${t.label} Tale` : "Tonight's Tale";
  }

  return { title, story, lesson, tomorrow };
}

// Lightweight check used by the UI to warn if no key is configured.
export function hasApiKey() {
  return Boolean(API_KEY) && API_KEY !== "PASTE_YOUR_OPENROUTER_API_KEY_HERE";
}

// Main call: sends the inputs to OpenRouter and returns a structured story.
export async function generateStory({ childName, age, theme, events }) {
  if (!hasApiKey()) {
    throw new Error(FRIENDLY.missingKey);
  }

  const { system, user } = buildStoryPrompt({ childName, age, theme, events });

  let response;
  try {
    response = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + API_KEY,
        "Content-Type": "application/json",
        "HTTP-Referer":
          typeof window !== "undefined"
            ? window.location.origin
            : "https://moontales.app",
        "X-Title": "MoonTales",
      },
      body: JSON.stringify({
        model: MODEL,
        temperature: 0.9,
        max_tokens: 1500,
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
      }),
    });
  } catch (networkErr) {
    throw new Error(FRIENDLY.network);
  }

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      throw new Error(FRIENDLY.auth);
    }
    if (response.status === 429) {
      throw new Error(FRIENDLY.rate);
    }
    throw new Error(FRIENDLY.generic);
  }

  let data;
  try {
    data = await response.json();
  } catch (_) {
    throw new Error(FRIENDLY.generic);
  }

  const raw = data?.choices?.[0]?.message?.content?.trim();
  if (!raw) {
    throw new Error(FRIENDLY.empty);
  }

  return parseStructuredStory(raw, { childName, theme });
}
