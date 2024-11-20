export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      actions: {
        Row: {
          action_name: string
          action_type: string
          created_by: string | null
          date_created: string | null
          date_scheduled: string | null
          id: number
          metadata: Json | null
          priority: string | null
          record_id: string | null
          status: string | null
          user_group_id: number | null
        }
        Insert: {
          action_name: string
          action_type: string
          created_by?: string | null
          date_created?: string | null
          date_scheduled?: string | null
          id?: number
          metadata?: Json | null
          priority?: string | null
          record_id?: string | null
          status?: string | null
          user_group_id?: number | null
        }
        Update: {
          action_name?: string
          action_type?: string
          created_by?: string | null
          date_created?: string | null
          date_scheduled?: string | null
          id?: number
          metadata?: Json | null
          priority?: string | null
          record_id?: string | null
          status?: string | null
          user_group_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: 'actions_record_id_fkey'
            columns: ['record_id']
            isOneToOne: false
            referencedRelation: 'records'
            referencedColumns: ['nanoid']
          },
          {
            foreignKeyName: 'actions_user_group_id_fkey'
            columns: ['user_group_id']
            isOneToOne: false
            referencedRelation: 'user_groups'
            referencedColumns: ['id']
          },
        ]
      }
      agencies: {
        Row: {
          ansi: number | null
          email: string | null
          emergency_url: string | null
          fips_code: number | null
          home_url: string | null
          id: number
          name: string | null
          phone: string | null
          state: string | null
          type: string | null
          url_elected: string | null
        }
        Insert: {
          ansi?: number | null
          email?: string | null
          emergency_url?: string | null
          fips_code?: number | null
          home_url?: string | null
          id?: number
          name?: string | null
          phone?: string | null
          state?: string | null
          type?: string | null
          url_elected?: string | null
        }
        Update: {
          ansi?: number | null
          email?: string | null
          emergency_url?: string | null
          fips_code?: number | null
          home_url?: string | null
          id?: number
          name?: string | null
          phone?: string | null
          state?: string | null
          type?: string | null
          url_elected?: string | null
        }
        Relationships: []
      }
      emails: {
        Row: {
          attachment_count: number | null
          attachment_details: Json | null
          email_body_url: string | null
          has_attachments: boolean | null
          id: string
          message_id: string | null
          r2_folder_path: string | null
          received_at: string | null
          sender_email: string
          status: string | null
          subject: string | null
        }
        Insert: {
          attachment_count?: number | null
          attachment_details?: Json | null
          email_body_url?: string | null
          has_attachments?: boolean | null
          id?: string
          message_id?: string | null
          r2_folder_path?: string | null
          received_at?: string | null
          sender_email: string
          status?: string | null
          subject?: string | null
        }
        Update: {
          attachment_count?: number | null
          attachment_details?: Json | null
          email_body_url?: string | null
          has_attachments?: boolean | null
          id?: string
          message_id?: string | null
          r2_folder_path?: string | null
          received_at?: string | null
          sender_email?: string
          status?: string | null
          subject?: string | null
        }
        Relationships: []
      }
      press_releases: {
        Row: {
          agency_id: number | null
          content: string | null
          created_by_user_id: string | null
          date_created: string | null
          date_modified: string | null
          department: string | null
          description: string | null
          id: number
          name: string
          permalink_url: string | null
          press_contact_id: number | null
          record_sub_type_id: number | null
          record_type_id: number | null
          slug: string
          source_url: string | null
          status: string | null
        }
        Insert: {
          agency_id?: number | null
          content?: string | null
          created_by_user_id?: string | null
          date_created?: string | null
          date_modified?: string | null
          department?: string | null
          description?: string | null
          id?: number
          name: string
          permalink_url?: string | null
          press_contact_id?: number | null
          record_sub_type_id?: number | null
          record_type_id?: number | null
          slug: string
          source_url?: string | null
          status?: string | null
        }
        Update: {
          agency_id?: number | null
          content?: string | null
          created_by_user_id?: string | null
          date_created?: string | null
          date_modified?: string | null
          department?: string | null
          description?: string | null
          id?: number
          name?: string
          permalink_url?: string | null
          press_contact_id?: number | null
          record_sub_type_id?: number | null
          record_type_id?: number | null
          slug?: string
          source_url?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'press_releases_agency_id_fkey'
            columns: ['agency_id']
            isOneToOne: false
            referencedRelation: 'agencies'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'press_releases_record_sub_type_id_fkey'
            columns: ['record_sub_type_id']
            isOneToOne: false
            referencedRelation: 'record_sub_types'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'press_releases_record_type_id_fkey'
            columns: ['record_type_id']
            isOneToOne: false
            referencedRelation: 'record_types'
            referencedColumns: ['id']
          },
        ]
      }
      profiles: {
        Row: {
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          phone: string | null
          user_group: string | null
          user_role: number | null
        }
        Insert: {
          email?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          phone?: string | null
          user_group?: string | null
          user_role?: number | null
        }
        Update: {
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          user_group?: string | null
          user_role?: number | null
        }
        Relationships: [
          {
            foreignKeyName: 'profiles_user_group_fkey'
            columns: ['user_group']
            isOneToOne: false
            referencedRelation: 'user_groups'
            referencedColumns: ['user_group']
          },
        ]
      }
      raw_entities: {
        Row: {
          alias_matches: string[] | null
          created_at: string
          entity_name: string
          entity_type: string | null
          id: string
          record_date: string | null
          record_id: string
        }
        Insert: {
          alias_matches?: string[] | null
          created_at?: string
          entity_name: string
          entity_type?: string | null
          id?: string
          record_date?: string | null
          record_id: string
        }
        Update: {
          alias_matches?: string[] | null
          created_at?: string
          entity_name?: string
          entity_type?: string | null
          id?: string
          record_date?: string | null
          record_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'fk_record'
            columns: ['record_id']
            isOneToOne: false
            referencedRelation: 'records'
            referencedColumns: ['nanoid']
          },
          {
            foreignKeyName: 'raw_entities_record_id_fkey'
            columns: ['record_id']
            isOneToOne: false
            referencedRelation: 'records'
            referencedColumns: ['nanoid']
          },
        ]
      }
      record_sub_types: {
        Row: {
          description: string | null
          id: number
          name: string
          record_type_id: number | null
        }
        Insert: {
          description?: string | null
          id?: number
          name: string
          record_type_id?: number | null
        }
        Update: {
          description?: string | null
          id?: number
          name?: string
          record_type_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: 'record_sub_types_record_type_id_fkey'
            columns: ['record_type_id']
            isOneToOne: false
            referencedRelation: 'record_types'
            referencedColumns: ['id']
          },
        ]
      }
      record_types: {
        Row: {
          description: string | null
          id: number
          name: string
          role_id: number | null
        }
        Insert: {
          description?: string | null
          id?: number
          name: string
          role_id?: number | null
        }
        Update: {
          description?: string | null
          id?: number
          name?: string
          role_id?: number | null
        }
        Relationships: []
      }
      records: {
        Row: {
          additional_text_urls: string[] | null
          agency_id: number | null
          date_created: string | null
          date_uploaded: string | null
          description: string | null
          embedding: string | null
          error_message: string | null
          file_name: string | null
          import_batch_id: string | null
          is_public: boolean | null
          is_scanned: boolean | null
          nanoid: string
          object_html_url: string | null
          object_text_url: string | null
          object_upload_url: string | null
          raster: boolean | null
          record_metadata: Json | null
          record_type: number | null
          status: string | null
          user_group: string | null
        }
        Insert: {
          additional_text_urls?: string[] | null
          agency_id?: number | null
          date_created?: string | null
          date_uploaded?: string | null
          description?: string | null
          embedding?: string | null
          error_message?: string | null
          file_name?: string | null
          import_batch_id?: string | null
          is_public?: boolean | null
          is_scanned?: boolean | null
          nanoid: string
          object_html_url?: string | null
          object_text_url?: string | null
          object_upload_url?: string | null
          raster?: boolean | null
          record_metadata?: Json | null
          record_type?: number | null
          status?: string | null
          user_group?: string | null
        }
        Update: {
          additional_text_urls?: string[] | null
          agency_id?: number | null
          date_created?: string | null
          date_uploaded?: string | null
          description?: string | null
          embedding?: string | null
          error_message?: string | null
          file_name?: string | null
          import_batch_id?: string | null
          is_public?: boolean | null
          is_scanned?: boolean | null
          nanoid?: string
          object_html_url?: string | null
          object_text_url?: string | null
          object_upload_url?: string | null
          raster?: boolean | null
          record_metadata?: Json | null
          record_type?: number | null
          status?: string | null
          user_group?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'fk_record_type'
            columns: ['record_type']
            isOneToOne: false
            referencedRelation: 'record_types'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'records_agency_id_fkey'
            columns: ['agency_id']
            isOneToOne: false
            referencedRelation: 'agencies'
            referencedColumns: ['id']
          },
        ]
      }
      user_groups: {
        Row: {
          associated_agency: number | null
          id: number
          user_group: string | null
        }
        Insert: {
          associated_agency?: number | null
          id?: never
          user_group?: string | null
        }
        Update: {
          associated_agency?: number | null
          id?: never
          user_group?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'user_groups_associated_agency_fkey'
            columns: ['associated_agency']
            isOneToOne: false
            referencedRelation: 'agencies'
            referencedColumns: ['id']
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      binary_quantize:
        | {
            Args: {
              '': string
            }
            Returns: unknown
          }
        | {
            Args: {
              '': unknown
            }
            Returns: unknown
          }
      generate_custom_nanoid: {
        Args: {
          size?: number
        }
        Returns: string
      }
      get_auth_user_group: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_user_role: {
        Args: {
          user_id: string
        }
        Returns: number
      }
      halfvec_avg: {
        Args: {
          '': number[]
        }
        Returns: unknown
      }
      halfvec_out: {
        Args: {
          '': unknown
        }
        Returns: unknown
      }
      halfvec_send: {
        Args: {
          '': unknown
        }
        Returns: string
      }
      halfvec_typmod_in: {
        Args: {
          '': unknown[]
        }
        Returns: number
      }
      hnsw_bit_support: {
        Args: {
          '': unknown
        }
        Returns: unknown
      }
      hnsw_halfvec_support: {
        Args: {
          '': unknown
        }
        Returns: unknown
      }
      hnsw_sparsevec_support: {
        Args: {
          '': unknown
        }
        Returns: unknown
      }
      hnswhandler: {
        Args: {
          '': unknown
        }
        Returns: unknown
      }
      is_valid_url: {
        Args: {
          '': string
        }
        Returns: boolean
      }
      ivfflat_bit_support: {
        Args: {
          '': unknown
        }
        Returns: unknown
      }
      ivfflat_halfvec_support: {
        Args: {
          '': unknown
        }
        Returns: unknown
      }
      ivfflathandler: {
        Args: {
          '': unknown
        }
        Returns: unknown
      }
      l2_norm:
        | {
            Args: {
              '': unknown
            }
            Returns: number
          }
        | {
            Args: {
              '': unknown
            }
            Returns: number
          }
      l2_normalize:
        | {
            Args: {
              '': string
            }
            Returns: string
          }
        | {
            Args: {
              '': unknown
            }
            Returns: unknown
          }
        | {
            Args: {
              '': unknown
            }
            Returns: unknown
          }
      search_records: {
        Args: {
          query_embedding: string
          match_threshold: number
          match_count: number
        }
        Returns: {
          id: number
          title: string
          description: string
          similarity: number
        }[]
      }
      sparsevec_out: {
        Args: {
          '': unknown
        }
        Returns: unknown
      }
      sparsevec_send: {
        Args: {
          '': unknown
        }
        Returns: string
      }
      sparsevec_typmod_in: {
        Args: {
          '': unknown[]
        }
        Returns: number
      }
      update_user_role: {
        Args: {
          user_id: string
          new_role: number
        }
        Returns: undefined
      }
      vector_avg: {
        Args: {
          '': number[]
        }
        Returns: string
      }
      vector_dims:
        | {
            Args: {
              '': string
            }
            Returns: number
          }
        | {
            Args: {
              '': unknown
            }
            Returns: number
          }
      vector_norm: {
        Args: {
          '': string
        }
        Returns: number
      }
      vector_out: {
        Args: {
          '': string
        }
        Returns: unknown
      }
      vector_send: {
        Args: {
          '': string
        }
        Returns: string
      }
      vector_typmod_in: {
        Args: {
          '': unknown[]
        }
        Returns: number
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, 'public'>]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema['Tables'] & PublicSchema['Views'])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
        Database[PublicTableNameOrOptions['schema']]['Views'])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
      Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] &
        PublicSchema['Views'])
    ? (PublicSchema['Tables'] &
        PublicSchema['Views'])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema['Enums']
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema['Enums']
    ? PublicSchema['Enums'][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema['CompositeTypes']
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema['CompositeTypes']
    ? PublicSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never
