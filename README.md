# 🌙 MoonTales

> Turn your child's day into a magical bedtime story.

MoonTales is a **frontend-only** Next.js web app. Parents enter their child's
name, age, a story theme, and what happened during the day — and the app uses
the **OpenRouter API** (called directly from the browser) to generate a warm,
age-appropriate, personalized bedtime story.

## ✨ Features

- Dreamy night-sky UI: glowing CSS moon, twinkling stars, drifting clouds, sparkles
- Four themes: **Fantasy**, **Comedy**, **Sci-fi**, and a gentle **Cozy-Spooky** mode
- Age-aware storytelling (length & vocabulary adapt to the child's age)
- Cozy "the moon is writing your story…" loading animation
- Glowing storybook output card with **Copy**, **Regenerate**, and **Clear** actions
- Form validation + friendly error handling, fully responsive

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
(default: `openai/gpt-4o-mini`).

> ⚠️ **Security note:** because this is frontend-only, the API key is exposed to
> the browser. Use a key with a low spend limit, and don't commit `.env.local`
> (it's already git-ignored).

## 🗂️ Project structure

```
app/
  layout.js          # fonts (Fredoka + Quicksand) + metadata
  page.js            # main single-page app: state, validation, orchestration
  globals.css        # Tailwind + dreamy theme, cards, buttons, animations
components/
  StarsBackground.js # twinkling stars, drifting clouds, sparkles
  Moon.js            # pure-CSS glowing crescent moon
  Hero.js            # title + subtitle
  StoryForm.js       # inputs: name, age, theme, day events
  LoadingState.js    # "the moon is writing your story…" animation
  StoryOutput.js     # glowing storybook card + Copy/Regenerate/Clear
  ErrorBanner.js     # friendly error messages
lib/
  openrouter.js      # prompt building + OpenRouter fetch + error handling
```

## 🛠️ Tech stack

Next.js (App Router) · React · Tailwind CSS · OpenRouter · 100% frontend
