// Yönetim sayfaları için iskelet yükleme ekranı (layout içinde render edilir)
export default function AdminLoading(): JSX.Element {
  return (
    <div aria-busy="true" aria-live="polite" className="animate-pulse">
      <span className="sr-only">Loading…</span>
      <div className="mb-3 h-4 w-28 rounded-full bg-md-surface-container-high" />
      <div className="mb-10 h-9 w-64 rounded-full bg-md-surface-container-high" />
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="h-32 rounded-3xl bg-md-surface-container-high"
          />
        ))}
      </div>
      <div className="h-80 rounded-3xl bg-md-surface-container-high" />
    </div>
  );
}
