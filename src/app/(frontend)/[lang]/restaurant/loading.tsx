export default function Loading() {
  return (
    <div className="min-h-screen animate-pulse">
      <div className="h-48 bg-neutral-200" />
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        <div className="h-8 bg-neutral-200 rounded w-1/4" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-72 bg-neutral-200 rounded-2xl" />
          ))}
        </div>
      </div>
    </div>
  )
}
