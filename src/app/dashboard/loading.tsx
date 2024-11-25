import Image from 'next/image'

export default function DashboardLoading() {
  return (
    <div className="container py-10">
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="h-10 w-40 animate-pulse rounded-lg bg-muted" />
        <div className="h-5 w-64 animate-pulse rounded-lg bg-muted" />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="flex h-32 animate-pulse flex-col items-center justify-center rounded-lg border bg-muted"
          />
        ))}
      </div>
    </div>
  )
}
