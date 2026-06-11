# 🌙 MoonTales

> Turn your child's day into a magical bedtime story.

MoonTales is a **frontend-only** Next.js web app. Parents enter their child's
name, age, a story theme, and what happened during the day — and the app uses
the **OpenRouter API** (called directly from the browser) to generate a warm,
age-appropriate, personalized bedtime story.

## ✨ Features

- **Living night-sky atmosphere** — glowing CSS moon, twinkling stars, drifting
  clouds, rising particles, occasional shooting stars, and gentle mouse parallax
- **Five immersive worlds** — Fantasy, Comedy, Sci-Fi, Cozy-Spooky, and Adventure,
  each with its own icon, accent color, tagline, and hover/selection animation
- **Premium AI stories** — the child is the hero; age-aware language; real dialogue
  and emotional beats; returns a **Title**, **Story**, **Lesson Learned**, and a
  **Tomorrow's Adventure** teaser
- **Magical reveal sequence** — a 3–5s Framer Motion ritual ("the moon is collecting
  tonight's memories…") before the storybook opens
- **Storybook presentation** — warm parchment page, gilded glow, drop cap, decorative
  borders, and elegant typography
- **Read Aloud mode** — browser speech synthesis with play / pause / resume / stop
  and a reading-speed control
- **My Story Library** — every story is saved to LocalStorage; reopen, copy,
  regenerate, or delete from a slide-in drawer
- **Delightful details** — sparkle celebration when a story is born, magical empty
  states, and friendly themed error messages
- Fully responsive and first-class on mobile; respects `prefers-reduced-motion`

## 🚀 Getting started

```bash
# 1. Install dependencies
npm install

# 2. Add your OpenRouter API key
cp .env.local.example .env.local
#   then edit .env.local and paste your key:
#   NEXT_PUBLIC_OPENROUTER_API_KEY=sk-or-...

# 3. Run the dev server
npm run dev
```

Open http://localhost:3000 🌙

> Get an API key at https://openrouter.ai/keys

### Where to put the API key

- **Recommended:** `.env.local` → `NEXT_PUBLIC_OPENROUTER_API_KEY=...`
- **Quick test:** paste it into the clearly-marked placeholder in
  [`lib/openrouter.js`](lib/openrouter.js).

You can also change the model with `NEXT_PUBLIC_OPENROUTER_MODEL`
(default: `openai/gpt-oss-20b:free`).

> ⚠️ **Security note:** because this is frontend-only, the API key is exposed to
> the browser. Use a key with a low spend limit, and don't commit `.env.local`
> (it's already git-ignored).

## 🗂️ Project structure

```
app/
  layout.js          # fonts (Fredoka + Quicksand) + metadata
  page.js            # single-page app: state machine, reveal timing, library
  globals.css        # Tailwind + dreamy theme, parchment storybook, animations
components/
  StarsBackground.js # stars, clouds, particles, shooting stars, mouse parallax
  Moon.js            # pure-CSS glowing, breathing crescent moon
  Hero.js            # title + subtitle
  StoryForm.js       # inputs + the five immersive theme cards
  RevealSequence.js  # 4-phase Framer Motion "story is opening" ritual
  StoryBook.js       # parchment storybook: title, prose, lesson, tomorrow
  ReadAloudControls.js # speech-synthesis play/pause/resume/stop + speed
  StoryLibrary.js    # LocalStorage library drawer (reopen/copy/regen/delete)
  Celebration.js     # sparkle burst when a story is born
  ErrorBanner.js     # gentle, on-theme error messages
lib/
  themes.js          # theme identities (icon, accent, tagline) + prompt guidance
  openrouter.js      # prompt building, structured parsing, themed errors
  library.js         # LocalStorage CRUD for saved stories
  useSpeech.js       # SpeechSynthesis hook for Read Aloud mode
```

## 🛠️ Tech stack

Next.js (App Router) · React · Tailwind CSS · Framer Motion · Web Speech API ·
LocalStorage · OpenRouter · 100% frontend
