// Phase 0.1 placeholder. The real home page (pitch, game search, my games,
// friends' activity) is built in later phases — see docs/spec.md.
export default function HomePage() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center gap-3 px-4 py-16">
      <h1 className="font-heading text-4xl font-bold tracking-tight">Polymaths</h1>
      <p className="text-muted-foreground">
        Tick off everything there is to do in your favourite games. Coming soon.
      </p>
    </main>
  );
}
