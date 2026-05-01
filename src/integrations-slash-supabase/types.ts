export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      app_settings: {
        Row: {
          id: string
          is_secret: boolean
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          id?: string
          is_secret?: boolean
          key: string
          updated_at?: string
          value?: Json
        }
        Update: {
          id?: string
          is_secret?: boolean
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      docs: {
        Row: {
          body: string
          category: string
          id: string
          slug: string
          sort_order: number
          title: string
          updated_at: string
        }
        Insert: {
          body?: string
          category?: string
          id?: string
          slug: string
          sort_order?: number
          title: string
          updated_at?: string
        }
        Update: {
          body?: string
          category?: string
          id?: string
          slug?: string
          sort_order?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          plan_id: string | null
          plan_name: string
          price_cents: number
          quantity: number
        }
        Insert: {
          id?: string
          order_id: string
          plan_id?: string | null
          plan_name: string
          price_cents: number
          quantity?: number
        }
        Update: {
          id?: string
          order_id?: string
          plan_id?: string | null
          plan_name?: string
          price_cents?: number
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "plans"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string
          id: string
          status: string
          total_cents: number
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          status?: string
          total_cents?: number
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          status?: string
          total_cents?: number
          user_id?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount_cents: number
          id: string
          note: string | null
          paid_at: string
          server_id: string | null
          user_id: string
        }
        Insert: {
          amount_cents?: number
          id?: string
          note?: string | null
          paid_at?: string
          server_id?: string | null
          user_id: string
        }
        Update: {
          amount_cents?: number
          id?: string
          note?: string | null
          paid_at?: string
          server_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_server_id_fkey"
            columns: ["server_id"]
            isOneToOne: false
            referencedRelation: "servers"
            referencedColumns: ["id"]
          },
        ]
      }
      plans: {
        Row: {
          active: boolean | null
          category: string
          cpu_cores: number | null
          created_at: string
          description: string | null
          features: Json | null
          id: string
          name: string
          popular: boolean | null
          price_cents: number
          ram_gb: number | null
          sort_order: number | null
          storage_gb: number | null
        }
        Insert: {
          active?: boolean | null
          category: string
          cpu_cores?: number | null
          created_at?: string
          description?: string | null
          features?: Json | null
          id?: string
          name: string
          popular?: boolean | null
          price_cents?: number
          ram_gb?: number | null
          sort_order?: number | null
          storage_gb?: number | null
        }
        Update: {
          active?: boolean | null
          category?: string
          cpu_cores?: number | null
          created_at?: string
          description?: string | null
          features?: Json | null
          id?: string
          name?: string
          popular?: boolean | null
          price_cents?: number
          ram_gb?: number | null
          sort_order?: number | null
          storage_gb?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          discord_username: string | null
          display_name: string | null
          email: string | null
          id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          discord_username?: string | null
          display_name?: string | null
          email?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          discord_username?: string | null
          display_name?: string | null
          email?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      servers: {
        Row: {
          billing_cycle_months: number
          created_at: string
          expires_at: string | null
          id: string
          name: string
          panel_id: string | null
          panel_type: string | null
          plan_id: string | null
          status: string
          suspended: boolean
          user_id: string
        }
        Insert: {
          billing_cycle_months?: number
          created_at?: string
          expires_at?: string | null
          id?: string
          name: string
          panel_id?: string | null
          panel_type?: string | null
          plan_id?: string | null
          status?: string
          suspended?: boolean
          user_id: string
        }
        Update: {
          billing_cycle_months?: number
          created_at?: string
          expires_at?: string | null
          id?: string
          name?: string
          panel_id?: string | null
          panel_type?: string | null
          plan_id?: string | null
          status?: string
          suspended?: boolean
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "servers_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "plans"
            referencedColumns: ["id"]
          },
        ]
      }
      staff: {
        Row: {
          avatar_url: string | null
          bio: string | null
          category: string
          created_at: string
          discord: string | null
          emoji: string | null
          id: string
          name: string
          role: string
          sort_order: number | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          category?: string
          created_at?: string
          discord?: string | null
          emoji?: string | null
          id?: string
          name: string
          role: string
          sort_order?: number | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          category?: string
          created_at?: string
          discord?: string | null
          emoji?: string | null
          id?: string
          name?: string
          role?: string
          sort_order?: number | null
        }
        Relationships: []
      }
      uptime_checks: {
        Row: {
          check_date: string
          created_at: string
          id: string
          monitor_id: string
          response_ms: number | null
          status: string
        }
        Insert: {
          check_date: string
          created_at?: string
          id?: string
          monitor_id: string
          response_ms?: number | null
          status?: string
        }
        Update: {
          check_date?: string
          created_at?: string
          id?: string
          monitor_id?: string
          response_ms?: number | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "uptime_checks_monitor_id_fkey"
            columns: ["monitor_id"]
            isOneToOne: false
            referencedRelation: "uptime_monitors"
            referencedColumns: ["id"]
          },
        ]
      }
      uptime_monitors: {
        Row: {
          active: boolean | null
          created_at: string
          id: string
          name: string
          sort_order: number | null
          url: string
        }
        Insert: {
          active?: boolean | null
          created_at?: string
          id?: string
          name: string
          sort_order?: number | null
          url: string
        }
        Update: {
          active?: boolean | null
          created_at?: string
          id?: string
          name?: string
          sort_order?: number | null
          url?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
