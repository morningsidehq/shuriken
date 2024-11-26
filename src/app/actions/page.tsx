import ActionsProvider from '@/components/actions/ActionsProvider'

export default function ActionsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="container flex-1 py-8">
        <h1 className="mb-8 scroll-m-20 text-center text-4xl font-extrabold tracking-tight lg:text-5xl">
          Actions
        </h1>
        <ActionsProvider />
      </div>
    </div>
  )
}
