'use client'

/**
 * ActionFilters Component
 * Sidebar component for filtering actions.
 * Uses shadcn/ui Accordion for collapsible filter sections.
 *
 * Features:
 * - Search functionality
 * - Status filtering
 * - Type filtering
 * - Date range selection
 * - Priority filtering
 *
 * @component
 * @param {Object} props
 * @param {Filters} props.filters - Current filter state
 * @param {Function} props.setFilters - Filter state setter
 * @param {Function} props.onApplyFilters - Callback when filters are applied
 */

import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'

/**
 * Filter type definition
 * @typedef {Object} Filters
 * @property {string} type - Action type filter
 * @property {string} status - Status filter
 * @property {string} priority - Priority filter
 * @property {string} assignedTo - Assignment filter
 */
type Filters = {
  type: string
  status: string
  priority: string
  assignedTo: string
}

interface ActionFiltersProps {
  filters: Filters
  setFilters: React.Dispatch<React.SetStateAction<Filters>>
  onApplyFilters: () => void
}

export default function ActionFilters({
  filters,
  setFilters,
  onApplyFilters,
}: ActionFiltersProps) {
  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search actions..." className="pl-8" />
      </div>

      <Accordion type="multiple" className="w-full">
        <AccordionItem value="status">
          <AccordionTrigger>Status</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="active" />
                <Label htmlFor="active">Active</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="completed" />
                <Label htmlFor="completed">Completed</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="pending" />
                <Label htmlFor="pending">Pending</Label>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="type">
          <AccordionTrigger>Type</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="automated" />
                <Label htmlFor="automated">Automated</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="manual" />
                <Label htmlFor="manual">Manual</Label>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="date">
          <AccordionTrigger>Date Range</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="start-date">Start Date</Label>
                <Input type="date" id="start-date" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end-date">End Date</Label>
                <Input type="date" id="end-date" />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="priority">
          <AccordionTrigger>Priority</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="high"
                  checked={filters.priority === 'high'}
                  onCheckedChange={() =>
                    setFilters({ ...filters, priority: 'high' })
                  }
                />
                <Label htmlFor="high">High</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="medium"
                  checked={filters.priority === 'medium'}
                  onCheckedChange={() =>
                    setFilters({ ...filters, priority: 'medium' })
                  }
                />
                <Label htmlFor="medium">Medium</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="low"
                  checked={filters.priority === 'low'}
                  onCheckedChange={() =>
                    setFilters({ ...filters, priority: 'low' })
                  }
                />
                <Label htmlFor="low">Low</Label>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Button className="w-full" onClick={onApplyFilters}>
        Apply Filters
      </Button>
    </div>
  )
}
