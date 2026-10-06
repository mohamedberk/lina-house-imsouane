export default function Loading() {
  return (
    <div className="min-h-screen animate-pulse pt-32">
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <div className="h-8 bg-neutral-200 rounded w-1/4" />
        <div className="h-12 bg-neutral-200 rounded w-3/4" />
        <div className="aspect-video bg-neutral-200 rounded-2xl" />
        <div className="space-y-3">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-4 bg-neutral-200 rounded w-full" />
          ))}
        </div>
      </div>
    </div>
  )
}
