import Header from '@/components/Header'
import ActionsProvider from '@/components/actions/ActionsProvider'

export default function ActionsPage() {
  return (
    <div className="flex w-full flex-1 flex-col items-center gap-8">
      <Header />
      <div className="container py-8">
        <h1 className="mb-8 text-center text-4xl font-bold">Actions</h1>
        <ActionsProvider />
      </div>
    </div>
  )
}
