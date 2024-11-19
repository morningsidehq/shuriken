export interface Action {
  id: number
  action_name: string
  status: string
  date_scheduled: string
  priority: string
  created_by: { email: string }
  user_group: { name: string }
  record_id: string
  metadata: { type: string }
}
