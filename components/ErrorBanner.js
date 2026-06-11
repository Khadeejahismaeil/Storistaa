export default function ErrorBanner({ message, onDismiss }) {
  if (!message) return null;
  return (
    <div
      role="alert"
      className="mx-auto mt-8 w-full max-w-2xl animate-fade-up rounded-2xl border border-rose-400/30 bg-rose-500/10 px-5 py-4 text-rose-100 backdrop-blur-md"
    >
      <div className="flex items-start gap-3">
        <span className="text-xl">🌧️</span>
        <div className="flex-1">
          <p className="font-display text-sm font-semibold">Oh no, a little hiccup</p>
          <p className="mt-0.5 font-body text-sm text-rose-100/90">{message}</p>
        </div>
        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            className="rounded-full px-2 text-rose-100/70 transition hover:text-rose-100"
            aria-label="Dismiss"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}
