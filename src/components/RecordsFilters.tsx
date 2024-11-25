'use client'
import { useState } from 'react'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'

type Props = {
  types: string[]
  agencies: string[]
  allTags: string[]
  onApplyFilters?: (filters: FilterState) => void
}

type FilterState = {
  types: string[]
  agencies: string[]
  tags: string[]
}

export default function RecordsFilters({
  types,
  agencies,
  allTags,
  onApplyFilters,
}: Props) {
  const [selectedFilters, setSelectedFilters] = useState<FilterState>({
    types: [],
    agencies: [],
    tags: [],
  })

  const handleFilterChange = (category: keyof FilterState, value: string) => {
    setSelectedFilters((prev) => {
      const current = prev[category]
      const updated = current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value]
      return { ...prev, [category]: updated }
    })
  }

  return (
    <div className="space-y-4 pt-8">
      <h3 className="font-semibold">Filters</h3>
      <Accordion type="multiple" className="w-full">
        <AccordionItem value="type">
          <AccordionTrigger>Record Types</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {types.map((type) => (
                <div key={type} className="flex items-center space-x-2">
                  <Checkbox
                    id={`type-${type}`}
                    checked={selectedFilters.types.includes(type)}
                    onCheckedChange={() => handleFilterChange('types', type)}
                  />
                  <Label htmlFor={`type-${type}`}>{type}</Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="agency">
          <AccordionTrigger>Agencies</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {agencies.map((agency) => (
                <div key={agency} className="flex items-center space-x-2">
                  <Checkbox
                    id={`agency-${agency}`}
                    checked={selectedFilters.agencies.includes(agency)}
                    onCheckedChange={() =>
                      handleFilterChange('agencies', agency)
                    }
                  />
                  <Label htmlFor={`agency-${agency}`}>{agency}</Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="tags">
          <AccordionTrigger>Tags</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {allTags.map((tag) => (
                <div key={tag} className="flex items-center space-x-2">
                  <Checkbox
                    id={`tag-${tag}`}
                    checked={selectedFilters.tags.includes(tag)}
                    onCheckedChange={() => handleFilterChange('tags', tag)}
                  />
                  <Label htmlFor={`tag-${tag}`}>{tag}</Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Button
        className="w-full"
        onClick={() => onApplyFilters?.(selectedFilters)}
      >
        Apply Filters
      </Button>
    </div>
  )
}
