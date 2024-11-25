'use client'

import { Action } from '@/types/actions'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Pencil, Trash2 } from 'lucide-react'

interface ActionsTableProps {
  actions: Action[]
  onDelete: (id: number) => void
  onEdit: (id: number) => void
  isLoading?: boolean
}

export default function ActionsTable({
  actions,
  onDelete,
  onEdit,
  isLoading = false,
}: ActionsTableProps) {
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'completed':
        return 'default'
      case 'in_progress':
        return 'secondary'
      case 'pending':
        return 'outline'
      default:
        return 'default'
    }
  }

  const getPriorityVariant = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'destructive'
      case 'medium':
        return 'secondary'
      case 'low':
        return 'secondary'
      default:
        return 'default'
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary" />
      </div>
    )
  }

  if (actions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <p className="text-lg text-muted-foreground">
          No actions found. Try adding a new one!
        </p>
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Priority</TableHead>
          <TableHead>Scheduled</TableHead>
          <TableHead>Created By</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {actions.map((action) => (
          <TableRow key={action.id}>
            <TableCell>{action.action_name}</TableCell>
            <TableCell>{action.metadata?.type ?? '-'}</TableCell>
            <TableCell>
              <Badge variant={getStatusVariant(action.status)}>
                {action.status.replace('_', ' ')}
              </Badge>
            </TableCell>
            <TableCell>
              <Badge variant={getPriorityVariant(action.priority)}>
                {action.priority}
              </Badge>
            </TableCell>
            <TableCell>
              {action.date_scheduled
                ? new Date(action.date_scheduled).toLocaleDateString()
                : '-'}
            </TableCell>
            <TableCell>{action.created_by.email}</TableCell>
            <TableCell className="text-right">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(action.id)}
                className="mr-2"
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(action.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
