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
      profiles: {
        Row: {
          id: string
          user_id: string
          name: string
          age: number
          gender: 'male' | 'female' | 'other'
          looking_for: 'male' | 'female' | 'both'
          bio: string | null
          avatar_url: string | null
          photos: string[]
          interests: string[]
          location: string | null
          occupation: string | null
          height: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          age: number
          gender: 'male' | 'female' | 'other'
          looking_for: 'male' | 'female' | 'both'
          bio?: string | null
          avatar_url?: string | null
          photos?: string[]
          interests?: string[]
          location?: string | null
          occupation?: string | null
          height?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          name?: string
          age?: number
          gender?: 'male' | 'female' | 'other'
          looking_for?: 'male' | 'female' | 'both'
          bio?: string | null
          avatar_url?: string | null
          photos?: string[]
          interests?: string[]
          location?: string | null
          occupation?: string | null
          height?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      swipes: {
        Row: {
          id: string
          swiper_id: string
          swiped_id: string
          direction: 'like' | 'pass'
          created_at: string
        }
        Insert: {
          id?: string
          swiper_id: string
          swiped_id: string
          direction: 'like' | 'pass'
          created_at?: string
        }
        Update: Record<string, never>
        Relationships: []
      }
      matches: {
        Row: {
          id: string
          user1_id: string
          user2_id: string
          created_at: string
          last_message_at: string | null
        }
        Insert: {
          id?: string
          user1_id: string
          user2_id: string
          created_at?: string
          last_message_at?: string | null
        }
        Update: {
          last_message_at?: string | null
        }
        Relationships: []
      }
      messages: {
        Row: {
          id: string
          match_id: string
          sender_id: string
          content: string
          is_read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          match_id: string
          sender_id: string
          content: string
          is_read?: boolean
          created_at?: string
        }
        Update: {
          is_read?: boolean
        }
        Relationships: []
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

export type Profile = Database['public']['Tables']['profiles']['Row']
export type Swipe = Database['public']['Tables']['swipes']['Row']
export type Match = Database['public']['Tables']['matches']['Row']
export type Message = Database['public']['Tables']['messages']['Row']
