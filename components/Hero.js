import Moon from "./Moon";

export default function Hero() {
  return (
    <header className="relative flex flex-col items-center px-6 pt-16 text-center sm:pt-24">
      <Moon className="mb-8" />

      <h1 className="font-display text-5xl font-bold tracking-tight text-moon-100 moon-glow-text sm:text-7xl">
        Moon<span className="text-moon-300">Tales</span>
      </h1>

      <p className="mt-5 max-w-xl font-body text-lg text-moon-100/80 sm:text-xl">
        Turn your child&apos;s day into a magical bedtime story.
      </p>

      <p className="mt-3 flex items-center gap-2 font-body text-sm text-dream-glow/80">
        <span className="animate-twinkle">✦</span>
        Open a storybook under the stars
        <span className="animate-twinkle">✦</span>
      </p>
    </header>
  );
}
