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
      ai_platform_citations: {
        Row: {
          citation_context: string | null
          citation_date: string
          citation_url: string
          click_through_rate: number | null
          content_title: string
          created_at: string
          id: string
          platform: string
          tenant_id: string
          updated_at: string
          visibility_score: number | null
        }
        Insert: {
          citation_context?: string | null
          citation_date: string
          citation_url: string
          click_through_rate?: number | null
          content_title: string
          created_at?: string
          id?: string
          platform: string
          tenant_id: string
          updated_at?: string
          visibility_score?: number | null
        }
        Update: {
          citation_context?: string | null
          citation_date?: string
          citation_url?: string
          click_through_rate?: number | null
          content_title?: string
          created_at?: string
          id?: string
          platform?: string
          tenant_id?: string
          updated_at?: string
          visibility_score?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_platform_citations_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      automate_frameworks: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          steps: Json
          tenant_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          steps?: Json
          tenant_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          steps?: Json
          tenant_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "automate_frameworks_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      automate_progress: {
        Row: {
          completed_at: string | null
          completed_by: string | null
          completion_percentage: number | null
          created_at: string | null
          framework_id: string
          id: string
          notes: string | null
          status: string | null
          step_code: string
          step_index: number
          tenant_id: string
          updated_at: string | null
        }
        Insert: {
          completed_at?: string | null
          completed_by?: string | null
          completion_percentage?: number | null
          created_at?: string | null
          framework_id: string
          id?: string
          notes?: string | null
          status?: string | null
          step_code: string
          step_index: number
          tenant_id: string
          updated_at?: string | null
        }
        Update: {
          completed_at?: string | null
          completed_by?: string | null
          completion_percentage?: number | null
          created_at?: string | null
          framework_id?: string
          id?: string
          notes?: string | null
          status?: string | null
          step_code?: string
          step_index?: number
          tenant_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "automate_progress_framework_id_fkey"
            columns: ["framework_id"]
            isOneToOne: false
            referencedRelation: "automate_frameworks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "automate_progress_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      content_pieces: {
        Row: {
          comment_count: number | null
          content_body: string | null
          content_type: string
          created_at: string
          created_by: string | null
          engagement_rate: number | null
          id: string
          like_count: number | null
          published_at: string | null
          seo_score: number | null
          share_count: number | null
          status: string
          tenant_id: string
          title: string
          updated_at: string
          view_count: number | null
        }
        Insert: {
          comment_count?: number | null
          content_body?: string | null
          content_type?: string
          created_at?: string
          created_by?: string | null
          engagement_rate?: number | null
          id?: string
          like_count?: number | null
          published_at?: string | null
          seo_score?: number | null
          share_count?: number | null
          status?: string
          tenant_id: string
          title: string
          updated_at?: string
          view_count?: number | null
        }
        Update: {
          comment_count?: number | null
          content_body?: string | null
          content_type?: string
          created_at?: string
          created_by?: string | null
          engagement_rate?: number | null
          id?: string
          like_count?: number | null
          published_at?: string | null
          seo_score?: number | null
          share_count?: number | null
          status?: string
          tenant_id?: string
          title?: string
          updated_at?: string
          view_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "content_pieces_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      podcast_syndications: {
        Row: {
          created_at: string
          created_by: string | null
          download_count: number | null
          engagement_score: number | null
          episode_title: string
          id: string
          listen_count: number | null
          platform: string
          podcast_title: string
          published_date: string | null
          syndication_url: string | null
          tenant_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          download_count?: number | null
          engagement_score?: number | null
          episode_title: string
          id?: string
          listen_count?: number | null
          platform: string
          podcast_title: string
          published_date?: string | null
          syndication_url?: string | null
          tenant_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          download_count?: number | null
          engagement_score?: number | null
          episode_title?: string
          id?: string
          listen_count?: number | null
          platform?: string
          podcast_title?: string
          published_date?: string | null
          syndication_url?: string | null
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "podcast_syndications_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      pr_campaigns: {
        Row: {
          budget: number | null
          created_at: string
          created_by: string | null
          description: string | null
          end_date: string | null
          engagement_rate: number | null
          id: string
          impression_count: number | null
          reach_count: number | null
          start_date: string | null
          status: string
          target_audience: string | null
          tenant_id: string
          title: string
          updated_at: string
        }
        Insert: {
          budget?: number | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          end_date?: string | null
          engagement_rate?: number | null
          id?: string
          impression_count?: number | null
          reach_count?: number | null
          start_date?: string | null
          status?: string
          target_audience?: string | null
          tenant_id: string
          title: string
          updated_at?: string
        }
        Update: {
          budget?: number | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          end_date?: string | null
          engagement_rate?: number | null
          id?: string
          impression_count?: number | null
          reach_count?: number | null
          start_date?: string | null
          status?: string
          target_audience?: string | null
          tenant_id?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "pr_campaigns_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      press_releases: {
        Row: {
          content: string
          created_at: string
          created_by: string | null
          distribution_channels: string[] | null
          id: string
          media_value: number | null
          pickup_count: number | null
          reach_estimate: number | null
          release_date: string | null
          sentiment_score: number | null
          status: string
          tenant_id: string
          title: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          created_by?: string | null
          distribution_channels?: string[] | null
          id?: string
          media_value?: number | null
          pickup_count?: number | null
          reach_estimate?: number | null
          release_date?: string | null
          sentiment_score?: number | null
          status?: string
          tenant_id: string
          title: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          created_by?: string | null
          distribution_channels?: string[] | null
          id?: string
          media_value?: number | null
          pickup_count?: number | null
          reach_estimate?: number | null
          release_date?: string | null
          sentiment_score?: number | null
          status?: string
          tenant_id?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "press_releases_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      seo_keywords: {
        Row: {
          competition_level: string | null
          cpc: number | null
          created_at: string
          created_by: string | null
          current_url: string | null
          id: string
          keyword: string
          ranking_position: number | null
          search_volume: number | null
          target_url: string | null
          tenant_id: string
          traffic_potential: number | null
          updated_at: string
        }
        Insert: {
          competition_level?: string | null
          cpc?: number | null
          created_at?: string
          created_by?: string | null
          current_url?: string | null
          id?: string
          keyword: string
          ranking_position?: number | null
          search_volume?: number | null
          target_url?: string | null
          tenant_id: string
          traffic_potential?: number | null
          updated_at?: string
        }
        Update: {
          competition_level?: string | null
          cpc?: number | null
          created_at?: string
          created_by?: string | null
          current_url?: string | null
          id?: string
          keyword?: string
          ranking_position?: number | null
          search_volume?: number | null
          target_url?: string | null
          tenant_id?: string
          traffic_potential?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "seo_keywords_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      tenants: {
        Row: {
          branding: Json | null
          created_at: string | null
          id: string
          name: string
          parent_agency_id: string | null
          settings: Json | null
          slug: string
          subscription_tier: string | null
          tenant_type: string
          updated_at: string | null
        }
        Insert: {
          branding?: Json | null
          created_at?: string | null
          id?: string
          name: string
          parent_agency_id?: string | null
          settings?: Json | null
          slug: string
          subscription_tier?: string | null
          tenant_type: string
          updated_at?: string | null
        }
        Update: {
          branding?: Json | null
          created_at?: string | null
          id?: string
          name?: string
          parent_agency_id?: string | null
          settings?: Json | null
          slug?: string
          subscription_tier?: string | null
          tenant_type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tenants_parent_agency_id_fkey"
            columns: ["parent_agency_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          created_at: string | null
          email: string
          full_name: string
          id: string
          permissions: Json | null
          role: string
          tenant_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          full_name: string
          id: string
          permissions?: Json | null
          role: string
          tenant_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          full_name?: string
          id?: string
          permissions?: Json | null
          role?: string
          tenant_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_profiles_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_default_automate_framework: {
        Args: { tenant_id: string }
        Returns: string
      }
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_current_user_tenant_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_user_tenant_ids: {
        Args: { user_uuid: string }
        Returns: {
          tenant_id: string
        }[]
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
