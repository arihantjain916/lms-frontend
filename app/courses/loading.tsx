export default function Loading() {
  return (
    <main className="container min-h-[70vh] py-12">
      <div className="h-44 animate-pulse rounded-2xl bg-muted" />
      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div
            key={item}
            className="h-96 animate-pulse rounded-xl bg-muted/70"
          />
        ))}
      </div>
    </main>
  );
}
