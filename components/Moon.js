// A pure-CSS glowing crescent moon with soft craters.
export default function Moon({ className = "" }) {
  return (
    <div className={`relative ${className}`} aria-hidden="true">
      <div className="animate-float">
        <div className="relative h-28 w-28 animate-pulse-glow rounded-full bg-gradient-to-br from-moon-100 via-moon-200 to-moon-300 shadow-glow-moon sm:h-36 sm:w-36">
          {/* craters */}
          <span className="absolute left-6 top-7 h-4 w-4 rounded-full bg-moon-300/70" />
          <span className="absolute left-14 top-16 h-6 w-6 rounded-full bg-moon-300/60" />
          <span className="absolute left-20 top-6 h-3 w-3 rounded-full bg-moon-300/70" />
          <span className="absolute left-8 top-20 h-3 w-3 rounded-full bg-moon-300/60" />
          {/* little orbiting star */}
          <span className="absolute -right-3 -top-3 text-2xl text-moon-100 animate-twinkle">
            ✦
          </span>
        </div>
      </div>
    </div>
  );
}
