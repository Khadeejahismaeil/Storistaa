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

// 👇👇👇  PASTE YOUR OPENROUTER API KEY HERE (between the quotes)  👇👇👇
const OPENROUTER_API_KEY_PLACEHOLDER = "PASTE_YOUR_OPENROUTER_API_KEY_HERE";
// 👆👆👆 ----------------------------------------------------------- 👆👆👆

const API_KEY =
  process.env.NEXT_PUBLIC_OPENROUTER_API_KEY || OPENROUTER_API_KEY_PLACEHOLDER;

const MODEL =
  process.env.NEXT_PUBLIC_OPENROUTER_MODEL || "openai/gpt-4o-mini";

const ENDPOINT = "https://openrouter.ai/api/v1/chat/completions";

// Theme-specific guidance so each style feels distinct but always cozy.
const THEME_GUIDE = {
  Fantasy:
    "Fill the story with gentle magic: glowing forests, kind dragons, talking stars, fairy lanterns, and wonder around every corner.",
  Comedy:
    "Make it playful and silly with light, giggly humor — funny mix-ups, goofy characters, and happy surprises that make a child smile.",
  "Sci-fi":
    "Use friendly, dreamy science fiction: soft-glowing spaceships, kind little robots, twinkling planets, and curious space adventures — wonder, not danger.",
  "Soft horror / spooky":
    "Keep it COZY-SPOOKY, never frightening. Think friendly ghosts, giggling shadows, mysterious moonlight, magical whispers, and shadows that turn out to be funny. Absolutely nothing traumatic, violent, or genuinely scary — every spooky moment should resolve into warmth and giggles.",
};

// Pick narrative complexity & length based on the child's age.
function ageGuidance(age) {
  const n = parseInt(age, 10);
  if (Number.isNaN(n)) {
    return "Use simple, warm language suitable for a young child.";
  }
  if (n <= 4) {
    return "The child is a toddler (age " + n + "). Use very simple words, short sentences, gentle repetition, and lots of soothing imagery. Keep it short (about 200-300 words).";
  }
  if (n <= 7) {
    return "The child is " + n + " years old. Use simple, vivid language, a clear and easy-to-follow plot, and friendly characters. Aim for about 300-450 words.";
  }
  if (n <= 10) {
    return "The child is " + n + " years old. You can use slightly richer vocabulary and a more adventurous plot, while staying gentle and bedtime-friendly. Aim for about 450-600 words.";
  }
  return "The child is " + n + " years old. Use engaging, imaginative storytelling with a touch more depth, while keeping it calm, kind, and bedtime-appropriate. Aim for about 500-650 words.";
}

// Build the prompt sent to the AI.
export function buildStoryPrompt({ childName, age, theme, events }) {
  const name = childName?.trim() || "the child";
  const themeGuide = THEME_GUIDE[theme] || THEME_GUIDE.Fantasy;

  const system = [
    "You are MoonTales, a gentle bedtime storyteller for parents to read to their children.",
    "You transform a child's real day into a magical, personalized bedtime story.",
    "",
    "Always follow these rules:",
    "- Feel warm, magical, soothing, and bedtime-friendly.",
    "- Be strictly age-appropriate for the child's age.",
    "- Turn the ordinary events of the child's day into imaginative, wondrous moments.",
    "- Keep the child as the brave, kind main character — use their real name.",
    "- Avoid anything scary, violent, sad for long, or otherwise inappropriate.",
    "- Build to a calm, comforting, sweet ending that helps the child drift to sleep.",
    "- Weave in a gentle moral or lesson when it fits naturally — never preachy.",
    "- Write flowing prose (no markdown headings, no bullet lists). A short, charming title on the first line is welcome.",
  ].join("\n");

  const user = [
    "Please write a bedtime story with these details:",
    "",
    "Child's name: " + name,
    "Child's age: " + (age || "unknown"),
    "Theme/style: " + theme,
    "",
    "What happened in the child's day (turn these real events into magic):",
    (events?.trim() || "A normal cozy day at home."),
    "",
    "Style guidance: " + themeGuide,
    "",
    "Age guidance: " + ageGuidance(age),
    "",
    "Now write the complete bedtime story, ending on a soft, comforting note.",
  ].join("\n");

  return { system, user };
}

// Lightweight check used by the UI to warn if no key is configured.
export function hasApiKey() {
  return Boolean(API_KEY) && API_KEY !== "PASTE_YOUR_OPENROUTER_API_KEY_HERE";
}

// Main call: sends the inputs to OpenRouter and returns the story text.
export async function generateStory({ childName, age, theme, events }) {
  if (!hasApiKey()) {
    throw new Error(
      "No OpenRouter API key found. Add NEXT_PUBLIC_OPENROUTER_API_KEY to .env.local (or paste it into lib/openrouter.js)."
    );
  }

  const { system, user } = buildStoryPrompt({ childName, age, theme, events });

  let response;
  try {
    response = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + API_KEY,
        "Content-Type": "application/json",
        // OpenRouter recommends these for attribution (optional).
        "HTTP-Referer":
          typeof window !== "undefined" ? window.location.origin : "https://moontales.app",
        "X-Title": "MoonTales",
      },
      body: JSON.stringify({
        model: MODEL,
        temperature: 0.9,
        max_tokens: 1200,
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
      }),
    });
  } catch (networkErr) {
    throw new Error(
      "Couldn't reach OpenRouter. Please check your internet connection and try again."
    );
  }

  if (!response.ok) {
    let detail = "";
    try {
      const errBody = await response.json();
      detail = errBody?.error?.message || errBody?.message || "";
    } catch (_) {
      /* ignore parse errors */
    }
    if (response.status === 401) {
      throw new Error("Your OpenRouter API key was rejected (401). Please double-check it.");
    }
    if (response.status === 429) {
      throw new Error("Too many requests or out of credits (429). Please wait a moment and try again.");
    }
    throw new Error(
      "The story couldn't be generated (error " + response.status + ")." +
        (detail ? " " + detail : "")
    );
  }

  let data;
  try {
    data = await response.json();
  } catch (_) {
    throw new Error("Received an unexpected response from OpenRouter. Please try again.");
  }

  const story = data?.choices?.[0]?.message?.content?.trim();
  if (!story) {
    throw new Error("The story came back empty. Please try generating again.");
  }

  return story;
}
