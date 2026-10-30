export default function Home() {
  return (
    <main className="min-h-screen px-4 py-10 sm:px-6 lg:px-10">
      <h1 className="font-display text-4xl font-extrabold sm:text-5xl lg:text-6xl">Ember</h1>
      <p className="mt-3 max-w-prose text-cream/70">
        Theme check. Resize the window: the cards below go 1, 2, then 4 columns.
      </p>
      <button className="mt-6 min-h-11 rounded-xl bg-ember px-6 font-bold text-noir transition hover:-translate-y-0.5 hover:shadow-glow-lg">
        Shop now
      </button>
      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((n) => (
          <div key={n} className="rounded-2xl border border-ember/15 bg-surface p-6 transition hover:-translate-y-1 hover:border-ember/60">
            Card {n}
          </div>
        ))}
      </div>
    </main>
  );
}