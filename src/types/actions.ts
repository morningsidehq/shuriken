export interface Action {
  id: number
  action_name: string
  status: string
  date_scheduled: string | null
  priority: string
  created_by: {
    email: string
  }
  user_group: {
    name: string
  }
  metadata: {
    type: string
  } | null
}
