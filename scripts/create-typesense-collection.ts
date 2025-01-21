const schema = {
  name: 'records',
  fields: [
    { name: 'file_name', type: 'string' },
    { name: 'type', type: 'string' },
    { name: 'agencies.name', type: 'string' },
    { name: 'status', type: 'string' },
    { name: 'date_created', type: 'string' },
    { name: 'tags', type: 'string[]', optional: true },
    { name: 'entities', type: 'string[]', optional: true },
    { name: 'object_upload_url', type: 'string' },
  ],
  default_sorting_field: 'date_created',
}
