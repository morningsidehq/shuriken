'use client'

import { SemanticSearch } from '../../../components/semantic-search'

export default function SearchPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-8 text-3xl font-bold">Semantic Search</h1>
      <SemanticSearch />
    </div>
  )
}
