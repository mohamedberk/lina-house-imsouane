export default function Loading() {
  return (
    <div className="min-h-screen animate-pulse">
      <div className="h-[70vh] bg-neutral-200" />
      <div className="max-w-7xl mx-auto px-4 py-12 space-y-8">
        <div className="h-10 bg-neutral-200 rounded w-1/3" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-64 bg-neutral-200 rounded-2xl" />
          ))}
        </div>
      </div>
    </div>
  )
}
