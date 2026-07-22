export default function Loading() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 lg:py-16 animate-pulse">
      <div className="h-8 bg-neutral-200 rounded w-3/4 mb-4" />
      <div className="h-5 bg-neutral-200 rounded w-1/2 mb-8" />
      <div className="aspect-video bg-neutral-200 rounded-2xl mb-8" />
      <div className="space-y-3">
        <div className="h-4 bg-neutral-200 rounded w-full" />
        <div className="h-4 bg-neutral-200 rounded w-full" />
        <div className="h-4 bg-neutral-200 rounded w-5/6" />
      </div>
    </div>
  );
}
