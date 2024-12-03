'use client'

/**
 * Analytics Page Component
 *
 * This component provides an interactive analytics dashboard for entity timeline visualization.
 * It allows users to search for entities and displays their occurrences over time in a scatter plot.
 */

import { useState, useRef } from 'react'
import { Card } from '@/components/ui/card'
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'

// Type definitions for entity data structures
interface Entity {
  entity_name: string // Name of the entity
  entity_type: string // Type classification of the entity
  record_date: string // Date when the entity was recorded
  record_id: string // Unique identifier for the record
}

interface TimelineData {
  occurrences: Entity[] // Array of entity occurrences
}

// Color palette for entity visualization
const entityColors = [
  '#FF6B6B', // coral red
  '#4ECDC4', // turquoise
  '#45B7D1', // sky blue
  '#96CEB4', // sage green
  '#9B59B6', // purple
  '#F39C12', // orange
  '#2ECC71', // emerald green
  '#E74C3C', // red
  '#3498DB', // blue
  '#F1C40F', // yellow
]

// Interfaces for chart data structure
interface ChartDataPoint {
  x: number // Unix timestamp for x-axis
  y: number // Y-axis value (always 1 for scatter plot)
  documentId: string // Reference to source document
  entityName: string // Name of the entity
}

interface GroupedData {
  [key: string]: {
    data: ChartDataPoint[]
    color: string
  }
}

export default function AnalyticsPage() {
  // State management for search functionality
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<string[]>([])
  const [selectedEntities, setSelectedEntities] = useState<Set<string>>(
    new Set(),
  )
  const [timelineData, setTimelineData] = useState<TimelineData>({
    occurrences: [],
  })
  const [showSearchResults, setShowSearchResults] = useState(false)
  const searchTimeout = useRef<ReturnType<typeof setTimeout>>()
  const [error, setError] = useState<string | null>(null)
  const [entityColorMap, setEntityColorMap] = useState<Map<string, string>>(
    new Map(),
  )

  /**
   * Handles entity search with debouncing
   * @param query - Search query string
   */
  const handleSearch = async (query: string) => {
    if (query.length < 2) {
      setSearchResults([])
      setShowSearchResults(false)
      return
    }

    try {
      const response = await fetch(
        `/api/entity-analytics/search?q=${encodeURIComponent(query)}`,
      )
      if (!response.ok) throw new Error('Search failed')
      const entities = await response.json()
      setSearchResults(entities)
      setShowSearchResults(true)
      setError(null)
    } catch (error) {
      console.error('Search error:', error)
      setError('Failed to search entities')
    }
  }

  /**
   * Handles entity selection and color assignment
   * @param entityName - Name of the selected entity
   */
  const selectEntity = async (entityName: string) => {
    if (selectedEntities.has(entityName)) return

    const newSelectedEntities = new Set(selectedEntities)
    newSelectedEntities.add(entityName)

    // Assign and store color for the new entity
    const newColorMap = new Map(entityColorMap)
    newColorMap.set(
      entityName,
      entityColors[newColorMap.size % entityColors.length],
    )

    setEntityColorMap(newColorMap)
    setSelectedEntities(newSelectedEntities)
    setSearchQuery('')
    setShowSearchResults(false)
    await updateTimeline(newSelectedEntities)
  }

  /**
   * Updates timeline data for selected entities
   * @param entities - Set of selected entity names
   */
  const updateTimeline = async (entities: Set<string>) => {
    if (entities.size === 0) {
      setTimelineData({ occurrences: [] })
      return
    }

    try {
      const response = await fetch(
        `/api/entity-analytics/timeline?entities=${Array.from(entities)
          .map((e) => encodeURIComponent(e))
          .join(',')}`,
      )
      if (!response.ok) throw new Error('Failed to fetch timeline')
      const data = await response.json()
      setTimelineData(data)
      setError(null)
    } catch (error) {
      console.error('Timeline error:', error)
      setError('Failed to update timeline')
    }
  }

  /**
   * Processes and formats data for chart visualization
   * @returns Array of tuples containing entity name, data points, and color
   */
  const getChartData = (): [string, ChartDataPoint[], string][] => {
    if (!timelineData.occurrences.length) return []

    const groupedData = timelineData.occurrences.reduce<GroupedData>(
      (acc, occurrence) => {
        if (!acc[occurrence.entity_name]) {
          acc[occurrence.entity_name] = {
            data: [],
            color: entityColorMap.get(occurrence.entity_name) || '#000000',
          }
        }
        acc[occurrence.entity_name].data.push({
          x: new Date(occurrence.record_date).getTime(),
          y: 1,
          documentId: occurrence.record_id,
          entityName: occurrence.entity_name,
        })
        return acc
      },
      {},
    )

    return Object.entries(groupedData).map(
      ([entityName, { data, color }]): [string, ChartDataPoint[], string] => [
        entityName,
        data,
        color,
      ],
    )
  }

  /**
   * Custom tooltip component for the scatter plot
   * @param props - Tooltip props including active state and payload data
   */
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="rounded-lg border bg-white p-4 shadow-lg">
          <p className="font-medium">{data.entityName}</p>
          <p>Date: {new Date(data.x).toLocaleDateString()}</p>
          <p>Document: {data.documentId}</p>
        </div>
      )
    }
    return null
  }

  // Main component render
  return (
    <div className="container mx-auto py-6">
      {/* Error display section */}
      {error && (
        <div className="mb-6 rounded border border-red-400 bg-red-100 p-4 text-red-700">
          {error}
        </div>
      )}

      <div className="mb-6">
        <h1 className="text-2xl font-bold">Entity Analytics</h1>
      </div>

      {/* Entity search section */}
      <Card className="m-3 border-border">
        <div className="p-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="relative">
              <label className="mb-2 block text-sm font-medium">
                Search Entity
              </label>
              <Command
                shouldFilter={false}
                className="rounded-md border shadow-md"
              >
                <CommandInput
                  value={searchQuery}
                  onValueChange={(value) => {
                    setSearchQuery(value)
                    clearTimeout(searchTimeout.current)
                    searchTimeout.current = setTimeout(() => {
                      handleSearch(value)
                    }, 300)
                  }}
                  placeholder="Start typing an entity name..."
                />
                {showSearchResults && (
                  <CommandList>
                    {searchResults.length > 0 ? (
                      <CommandGroup>
                        {searchResults.map((entity) => (
                          <CommandItem
                            key={entity}
                            onSelect={() => selectEntity(entity)}
                          >
                            {entity}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    ) : (
                      <CommandEmpty>No results found.</CommandEmpty>
                    )}
                  </CommandList>
                )}
              </Command>
            </div>
          </div>
        </div>
      </Card>

      {/* Timeline visualization section */}
      <Card className="m-3 border-border">
        <div className="p-4">
          <h3 className="mb-4 text-lg font-semibold">Entity Timeline</h3>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart
                margin={{
                  top: 20,
                  right: 20,
                  bottom: 20,
                  left: 20,
                }}
              >
                <XAxis
                  type="number"
                  dataKey="x"
                  name="Date"
                  domain={['auto', 'auto']}
                  tickFormatter={(unixTime) =>
                    new Date(unixTime).toLocaleDateString()
                  }
                />
                <YAxis type="number" dataKey="y" hide />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                {getChartData().map(([entityName, data, color]) => (
                  <Scatter
                    key={entityName}
                    name={entityName}
                    data={data}
                    fill={color}
                  />
                ))}
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>
      </Card>

      {/* Document occurrences table section */}
      <Card className="m-3 border-border">
        <div className="p-4">
          <h3 className="mb-4 text-lg font-semibold">Document Occurrences</h3>
          {/* Table implementation */}
        </div>
      </Card>
    </div>
  )
}
