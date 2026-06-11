// lib/themes.js
// Central definition of every story theme: visual identity (icon, accent,
// gradient, tagline) AND the storytelling guidance sent to the model.
// Used by both the UI (StoryForm cards) and the prompt builder (openrouter.js).

export const THEMES = [
  {
    id: "Fantasy",
    label: "Fantasy",
    icon: "🐉",
    tagline: "Dragons, magic, enchanted forests",
    accent: "#a78bfa",
    glow: "rgba(167, 139, 250, 0.45)",
    gradient: "from-violet-500/20 to-fuchsia-500/10",
    promptGuide:
      "Fill the world with gentle magic — glowing forests, kindly dragons, talking stars, fairy lanterns, and wonder around every corner. Enchantment should feel safe and warm.",
  },
  {
    id: "Comedy",
    label: "Comedy",
    icon: "🤹",
    tagline: "Silly adventures and funny surprises",
    accent: "#fbbf24",
    glow: "rgba(251, 191, 36, 0.45)",
    gradient: "from-amber-400/20 to-orange-400/10",
    promptGuide:
      "Make it playful and giggly with light, gentle humor — funny mix-ups, goofy characters, silly sound effects, and happy surprises that make a child smile. Keep the comedy kind, never mean.",
  },
  {
    id: "Sci-Fi",
    label: "Sci-Fi",
    icon: "🚀",
    tagline: "Future worlds, robots, and space journeys",
    accent: "#38bdf8",
    glow: "rgba(56, 189, 248, 0.45)",
    gradient: "from-sky-400/20 to-cyan-400/10",
    promptGuide:
      "Use friendly, dreamy science-fiction — soft-glowing spaceships, kind little robots, twinkling planets, and curious journeys through the stars. Wonder and discovery, never danger or cold machinery.",
  },
  {
    id: "Cozy Spooky",
    label: "Cozy Spooky",
    icon: "👻",
    tagline: "Friendly ghosts and moonlit mysteries",
    accent: "#5eead4",
    glow: "rgba(94, 234, 212, 0.45)",
    gradient: "from-teal-400/20 to-emerald-400/10",
    promptGuide:
      "Keep it COZY-SPOOKY, never frightening — friendly ghosts, giggling shadows, moonlit mysteries, magical whispers, and shadows that turn out to be funny. Every spooky moment must resolve into warmth, safety, and giggles. Nothing traumatic, dark, or genuinely scary.",
  },
  {
    id: "Adventure",
    label: "Adventure",
    icon: "🗺️",
    tagline: "Treasure hunts and heroic quests",
    accent: "#fb923c",
    glow: "rgba(251, 146, 60, 0.45)",
    gradient: "from-orange-400/20 to-rose-400/10",
    promptGuide:
      "Send the hero on a brave, heartwarming quest — hidden treasure, secret maps, friendly companions, and small acts of courage. Excitement should feel triumphant and safe, ending snug and sound.",
  },
];

export const THEME_MAP = Object.fromEntries(THEMES.map((t) => [t.id, t]));

export const DEFAULT_THEME = THEMES[0].id;

export function getTheme(id) {
  return THEME_MAP[id] || THEMES[0];
}
