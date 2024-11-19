import Image from 'next/image'

export default function DashboardLoading() {
  return (
    <div className="morningside-container py-8">
      <div className="morningside-card animate-pulse">
        <div className="mb-8 flex items-center justify-center">
          <Image
            src="/ms_constance_icon.png"
            alt="Constance Logo"
            width={200}
            height={200}
            priority
          />
        </div>
        <div className="mb-4 h-8 w-64 rounded bg-muted"></div>
        <div className="h-4 w-48 rounded bg-muted"></div>
      </div>
    </div>
  )
}
