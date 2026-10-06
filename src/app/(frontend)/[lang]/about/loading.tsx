export default function Loading() {
  return (
    <div className="min-h-screen animate-pulse">
      <div className="h-[50vh] bg-neutral-200" />
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-4">
        <div className="h-10 bg-neutral-200 rounded w-2/3" />
        <div className="h-4 bg-neutral-200 rounded w-1/4" />
        <div className="space-y-3 pt-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-4 bg-neutral-200 rounded w-full" />
          ))}
        </div>
      </div>
    </div>
  )
}
