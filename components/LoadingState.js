const MESSAGES = [
  "The moon is writing your story…",
  "Gathering stardust and sweet dreams…",
  "Sprinkling a little magic on the pages…",
  "Tucking the words in gently…",
];

export default function LoadingState({ messageIndex = 0 }) {
  return (
    <section className="glass-card mx-auto mt-12 w-full max-w-2xl p-10 text-center animate-fade-up">
      <div className="relative mx-auto mb-8 h-24 w-24">
        {/* glowing moon writing */}
        <div className="absolute inset-0 animate-pulse-glow rounded-full bg-gradient-to-br from-moon-100 to-moon-300" />
        <span className="absolute inset-0 flex items-center justify-center text-4xl animate-float">
          🌙
        </span>
        {/* orbiting sparkles */}
        <span className="absolute -right-2 -top-2 text-xl animate-twinkle">✦</span>
        <span
          className="absolute -bottom-2 -left-2 text-lg animate-twinkle"
          style={{ animationDelay: "1s" }}
        >
          ✧
        </span>
      </div>

      <p className="font-display text-xl text-moon-100 moon-glow-text">
        {MESSAGES[messageIndex % MESSAGES.length]}
      </p>

      <div className="mt-6 flex justify-center gap-2">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-2.5 w-2.5 animate-twinkle rounded-full bg-moon-300"
            style={{ animationDelay: `${i * 0.3}s` }}
          />
        ))}
      </div>
    </section>
  );
}

export { MESSAGES };
