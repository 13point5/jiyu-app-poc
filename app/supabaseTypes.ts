export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      block_types: {
        Row: {
          created_at: string
          id: number
          name: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          name?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          name?: string | null
        }
        Relationships: []
      }
      blocks: {
        Row: {
          board_id: number
          created_at: string
          data: Json
          id: number
          type: number
        }
        Insert: {
          board_id: number
          created_at?: string
          data: Json
          id?: number
          type: number
        }
        Update: {
          board_id?: number
          created_at?: string
          data?: Json
          id?: number
          type?: number
        }
        Relationships: [
          {
            foreignKeyName: "blocks_board_id_fkey"
            columns: ["board_id"]
            referencedRelation: "boards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blocks_type_fkey"
            columns: ["type"]
            referencedRelation: "block_types"
            referencedColumns: ["id"]
          }
        ]
      }
      boards: {
        Row: {
          created_at: string
          created_by: string
          id: number
          name: string
        }
        Insert: {
          created_at?: string
          created_by?: string
          id?: number
          name?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          id?: number
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "boards_created_by_fkey"
            columns: ["created_by"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          full_name: string | null
          id: string
          updated_at: string | null
          username: string | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
