export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      ai_citation_queries: {
        Row: {
          avg_confidence_score: number | null
          avg_sentiment_score: number | null
          created_at: string | null
          created_by: string | null
          execution_count: number | null
          frequency: string | null
          id: string
          last_executed_at: string | null
          next_execution_at: string | null
          platforms: string[] | null
          query_text: string
          status: string | null
          target_keywords: string[] | null
          tenant_id: string
          total_citations_found: number | null
          updated_at: string | null
        }
        Insert: {
          avg_confidence_score?: number | null
          avg_sentiment_score?: number | null
          created_at?: string | null
          created_by?: string | null
          execution_count?: number | null
          frequency?: string | null
          id?: string
          last_executed_at?: string | null
          next_execution_at?: string | null
          platforms?: string[] | null
          query_text: string
          status?: string | null
          target_keywords?: string[] | null
          tenant_id: string
          total_citations_found?: number | null
          updated_at?: string | null
        }
        Update: {
          avg_confidence_score?: number | null
          avg_sentiment_score?: number | null
          created_at?: string | null
          created_by?: string | null
          execution_count?: number | null
          frequency?: string | null
          id?: string
          last_executed_at?: string | null
          next_execution_at?: string | null
          platforms?: string[] | null
          query_text?: string
          status?: string | null
          target_keywords?: string[] | null
          tenant_id?: string
          total_citations_found?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_citation_queries_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_citation_queries_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_citation_results: {
        Row: {
          citations_found: string[] | null
          confidence_score: number | null
          context_relevance: number | null
          created_at: string | null
          id: string
          model_used: string | null
          platform: string
          query_id: string | null
          query_text: string
          query_timestamp: string
          response_text: string | null
          response_time_ms: number | null
          sentiment_score: number | null
          tenant_id: string
        }
        Insert: {
          citations_found?: string[] | null
          confidence_score?: number | null
          context_relevance?: number | null
          created_at?: string | null
          id?: string
          model_used?: string | null
          platform: string
          query_id?: string | null
          query_text: string
          query_timestamp: string
          response_text?: string | null
          response_time_ms?: number | null
          sentiment_score?: number | null
          tenant_id: string
        }
        Update: {
          citations_found?: string[] | null
          confidence_score?: number | null
          context_relevance?: number | null
          created_at?: string | null
          id?: string
          model_used?: string | null
          platform?: string
          query_id?: string | null
          query_text?: string
          query_timestamp?: string
          response_text?: string | null
          response_time_ms?: number | null
          sentiment_score?: number | null
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_citation_results_query_id_fkey"
            columns: ["query_id"]
            isOneToOne: false
            referencedRelation: "ai_citation_queries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_citation_results_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
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
      automate_audit_scores: {
        Row: {
          action_required: boolean | null
          category: string
          created_at: string
          id: string
          notes: string | null
          priority_level: string | null
          question: string
          score: number | null
          step_progress_id: string | null
          subcategory: string
          tenant_id: string
          updated_at: string
        }
        Insert: {
          action_required?: boolean | null
          category: string
          created_at?: string
          id?: string
          notes?: string | null
          priority_level?: string | null
          question: string
          score?: number | null
          step_progress_id?: string | null
          subcategory: string
          tenant_id: string
          updated_at?: string
        }
        Update: {
          action_required?: boolean | null
          category?: string
          created_at?: string
          id?: string
          notes?: string | null
          priority_level?: string | null
          question?: string
          score?: number | null
          step_progress_id?: string | null
          subcategory?: string
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "automate_audit_scores_step_progress_id_fkey"
            columns: ["step_progress_id"]
            isOneToOne: false
            referencedRelation: "automate_step_progress"
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
      automate_methodology_campaigns: {
        Row: {
          campaign_id: string | null
          completed_at: string | null
          created_at: string
          id: string
          methodology_name: string
          overall_progress: number | null
          started_at: string | null
          status: string | null
          tenant_id: string
          updated_at: string
        }
        Insert: {
          campaign_id?: string | null
          completed_at?: string | null
          created_at?: string
          id?: string
          methodology_name?: string
          overall_progress?: number | null
          started_at?: string | null
          status?: string | null
          tenant_id: string
          updated_at?: string
        }
        Update: {
          campaign_id?: string | null
          completed_at?: string | null
          created_at?: string
          id?: string
          methodology_name?: string
          overall_progress?: number | null
          started_at?: string | null
          status?: string | null
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "automate_methodology_campaigns_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
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
      automate_step_progress: {
        Row: {
          action_items: Json | null
          audit_scores: Json | null
          completed_at: string | null
          completion_percentage: number | null
          created_at: string
          id: string
          methodology_campaign_id: string | null
          notes: string | null
          started_at: string | null
          status: string | null
          step_code: string
          step_index: number
          step_name: string
          tenant_id: string
          updated_at: string
        }
        Insert: {
          action_items?: Json | null
          audit_scores?: Json | null
          completed_at?: string | null
          completion_percentage?: number | null
          created_at?: string
          id?: string
          methodology_campaign_id?: string | null
          notes?: string | null
          started_at?: string | null
          status?: string | null
          step_code: string
          step_index: number
          step_name: string
          tenant_id: string
          updated_at?: string
        }
        Update: {
          action_items?: Json | null
          audit_scores?: Json | null
          completed_at?: string | null
          completion_percentage?: number | null
          created_at?: string
          id?: string
          methodology_campaign_id?: string | null
          notes?: string | null
          started_at?: string | null
          status?: string | null
          step_code?: string
          step_index?: number
          step_name?: string
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "automate_step_progress_methodology_campaign_id_fkey"
            columns: ["methodology_campaign_id"]
            isOneToOne: false
            referencedRelation: "automate_methodology_campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      campaign_journalist_relationships: {
        Row: {
          actual_response_time_hours: number | null
          authority_score_at_selection: number | null
          campaign_id: string | null
          created_at: string | null
          id: string
          journalist_id: string | null
          notes: string | null
          outcome: string | null
          outreach_date: string | null
          predicted_success_rate: number | null
          relationship_score_at_selection: number | null
          response_date: string | null
          status: string | null
          tenant_id: string | null
          updated_at: string | null
        }
        Insert: {
          actual_response_time_hours?: number | null
          authority_score_at_selection?: number | null
          campaign_id?: string | null
          created_at?: string | null
          id?: string
          journalist_id?: string | null
          notes?: string | null
          outcome?: string | null
          outreach_date?: string | null
          predicted_success_rate?: number | null
          relationship_score_at_selection?: number | null
          response_date?: string | null
          status?: string | null
          tenant_id?: string | null
          updated_at?: string | null
        }
        Update: {
          actual_response_time_hours?: number | null
          authority_score_at_selection?: number | null
          campaign_id?: string | null
          created_at?: string | null
          id?: string
          journalist_id?: string | null
          notes?: string | null
          outcome?: string | null
          outreach_date?: string | null
          predicted_success_rate?: number | null
          relationship_score_at_selection?: number | null
          response_date?: string | null
          status?: string | null
          tenant_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "campaign_journalist_relationships_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campaign_journalist_relationships_journalist_id_fkey"
            columns: ["journalist_id"]
            isOneToOne: false
            referencedRelation: "journalist_contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campaign_journalist_relationships_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      campaigns: {
        Row: {
          ai_intelligence: Json | null
          budget: number | null
          campaign_type: string
          created_at: string
          created_by: string | null
          description: string | null
          end_date: string | null
          goals: Json | null
          id: string
          name: string
          start_date: string | null
          status: string
          target_audience: Json | null
          tenant_id: string
          updated_at: string
        }
        Insert: {
          ai_intelligence?: Json | null
          budget?: number | null
          campaign_type: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          end_date?: string | null
          goals?: Json | null
          id?: string
          name: string
          start_date?: string | null
          status?: string
          target_audience?: Json | null
          tenant_id: string
          updated_at?: string
        }
        Update: {
          ai_intelligence?: Json | null
          budget?: number | null
          campaign_type?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          end_date?: string | null
          goals?: Json | null
          id?: string
          name?: string
          start_date?: string | null
          status?: string
          target_audience?: Json | null
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "campaigns_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      citation_analytics: {
        Row: {
          avg_confidence_score: number | null
          avg_sentiment_score: number | null
          citations_found: number | null
          created_at: string | null
          date_recorded: string
          id: string
          negative_mentions: number | null
          neutral_mentions: number | null
          platform: string
          positive_mentions: number | null
          tenant_id: string
          total_queries: number | null
          updated_at: string | null
        }
        Insert: {
          avg_confidence_score?: number | null
          avg_sentiment_score?: number | null
          citations_found?: number | null
          created_at?: string | null
          date_recorded: string
          id?: string
          negative_mentions?: number | null
          neutral_mentions?: number | null
          platform: string
          positive_mentions?: number | null
          tenant_id: string
          total_queries?: number | null
          updated_at?: string | null
        }
        Update: {
          avg_confidence_score?: number | null
          avg_sentiment_score?: number | null
          citations_found?: number | null
          created_at?: string | null
          date_recorded?: string
          id?: string
          negative_mentions?: number | null
          neutral_mentions?: number | null
          platform?: string
          positive_mentions?: number | null
          tenant_id?: string
          total_queries?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "citation_analytics_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      content_pieces: {
        Row: {
          campaign_id: string | null
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
          campaign_id?: string | null
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
          campaign_id?: string | null
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
            foreignKeyName: "content_pieces_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_pieces_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      cross_platform_intelligence: {
        Row: {
          ai_learning_data: Json | null
          campaign_response_history: Json | null
          created_at: string | null
          cross_platform_insights: Json | null
          id: string
          journalist_first_activity: Json | null
          journalist_id: string | null
          last_updated: string | null
          outreach_success_patterns: Json | null
          pravado_interactions: Json | null
          proactive_recommendations: Json | null
          query_patterns: Json | null
          source_preferences: Json | null
          unified_relationship_score: number | null
        }
        Insert: {
          ai_learning_data?: Json | null
          campaign_response_history?: Json | null
          created_at?: string | null
          cross_platform_insights?: Json | null
          id?: string
          journalist_first_activity?: Json | null
          journalist_id?: string | null
          last_updated?: string | null
          outreach_success_patterns?: Json | null
          pravado_interactions?: Json | null
          proactive_recommendations?: Json | null
          query_patterns?: Json | null
          source_preferences?: Json | null
          unified_relationship_score?: number | null
        }
        Update: {
          ai_learning_data?: Json | null
          campaign_response_history?: Json | null
          created_at?: string | null
          cross_platform_insights?: Json | null
          id?: string
          journalist_first_activity?: Json | null
          journalist_id?: string | null
          last_updated?: string | null
          outreach_success_patterns?: Json | null
          pravado_interactions?: Json | null
          proactive_recommendations?: Json | null
          query_patterns?: Json | null
          source_preferences?: Json | null
          unified_relationship_score?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "cross_platform_intelligence_journalist_id_fkey"
            columns: ["journalist_id"]
            isOneToOne: false
            referencedRelation: "journalist_contacts"
            referencedColumns: ["id"]
          },
        ]
      }
      discovery_targets: {
        Row: {
          created_at: string | null
          discovery_query: string | null
          id: string
          metadata: Json | null
          source_url: string
          status: string | null
        }
        Insert: {
          created_at?: string | null
          discovery_query?: string | null
          id?: string
          metadata?: Json | null
          source_url: string
          status?: string | null
        }
        Update: {
          created_at?: string | null
          discovery_query?: string | null
          id?: string
          metadata?: Json | null
          source_url?: string
          status?: string | null
        }
        Relationships: []
      }
      email_deliverability_tracking: {
        Row: {
          bounce_code: string | null
          bounce_reason: string | null
          bounce_type: string | null
          clicked: boolean | null
          created_at: string | null
          delivery_provider: string | null
          delivery_status: string
          delivery_timestamp: string | null
          email_address: string
          forwarded: boolean | null
          id: string
          journalist_id: string | null
          message_id: string | null
          opened: boolean | null
          outreach_session_id: string | null
          replied: boolean | null
          smtp_response: string | null
          tenant_id: string
        }
        Insert: {
          bounce_code?: string | null
          bounce_reason?: string | null
          bounce_type?: string | null
          clicked?: boolean | null
          created_at?: string | null
          delivery_provider?: string | null
          delivery_status: string
          delivery_timestamp?: string | null
          email_address: string
          forwarded?: boolean | null
          id?: string
          journalist_id?: string | null
          message_id?: string | null
          opened?: boolean | null
          outreach_session_id?: string | null
          replied?: boolean | null
          smtp_response?: string | null
          tenant_id: string
        }
        Update: {
          bounce_code?: string | null
          bounce_reason?: string | null
          bounce_type?: string | null
          clicked?: boolean | null
          created_at?: string | null
          delivery_provider?: string | null
          delivery_status?: string
          delivery_timestamp?: string | null
          email_address?: string
          forwarded?: boolean | null
          id?: string
          journalist_id?: string | null
          message_id?: string | null
          opened?: boolean | null
          outreach_session_id?: string | null
          replied?: boolean | null
          smtp_response?: string | null
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "email_deliverability_tracking_journalist_id_fkey"
            columns: ["journalist_id"]
            isOneToOne: false
            referencedRelation: "journalist_contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_deliverability_tracking_outreach_session_id_fkey"
            columns: ["outreach_session_id"]
            isOneToOne: false
            referencedRelation: "journalist_outreach_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      email_outreach: {
        Row: {
          campaign_name: string
          created_at: string | null
          created_by: string | null
          email_body: string
          id: string
          open_rate: number | null
          response_rate: number | null
          scheduled_date: string | null
          sent_count: number | null
          status: string | null
          subject_line: string
          target_audience: Json | null
          tenant_id: string
          updated_at: string | null
        }
        Insert: {
          campaign_name: string
          created_at?: string | null
          created_by?: string | null
          email_body: string
          id?: string
          open_rate?: number | null
          response_rate?: number | null
          scheduled_date?: string | null
          sent_count?: number | null
          status?: string | null
          subject_line: string
          target_audience?: Json | null
          tenant_id: string
          updated_at?: string | null
        }
        Update: {
          campaign_name?: string
          created_at?: string | null
          created_by?: string | null
          email_body?: string
          id?: string
          open_rate?: number | null
          response_rate?: number | null
          scheduled_date?: string | null
          sent_count?: number | null
          status?: string | null
          subject_line?: string
          target_audience?: Json | null
          tenant_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "email_outreach_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      haro_analytics: {
        Row: {
          average_match_confidence: number | null
          coverage_secured: number | null
          created_at: string | null
          date_period: string
          id: string
          journalist_replies: number | null
          requests_matched: number | null
          responses_submitted: number | null
          roi_score: number | null
          success_rate: number | null
          tenant_id: string | null
          total_coverage_value: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          average_match_confidence?: number | null
          coverage_secured?: number | null
          created_at?: string | null
          date_period: string
          id?: string
          journalist_replies?: number | null
          requests_matched?: number | null
          responses_submitted?: number | null
          roi_score?: number | null
          success_rate?: number | null
          tenant_id?: string | null
          total_coverage_value?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          average_match_confidence?: number | null
          coverage_secured?: number | null
          created_at?: string | null
          date_period?: string
          id?: string
          journalist_replies?: number | null
          requests_matched?: number | null
          responses_submitted?: number | null
          roi_score?: number | null
          success_rate?: number | null
          tenant_id?: string | null
          total_coverage_value?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "haro_analytics_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      haro_matches: {
        Row: {
          ai_generated_response: string | null
          coverage_date: string | null
          coverage_secured: boolean | null
          coverage_url: string | null
          coverage_value: number | null
          created_at: string | null
          final_response: string | null
          haro_request_id: string | null
          id: string
          journalist_replied: boolean | null
          journalist_reply_at: string | null
          match_confidence: number | null
          match_reasons: string[] | null
          response_status: string | null
          submitted: boolean | null
          submitted_at: string | null
          tenant_id: string | null
          updated_at: string | null
          user_edited_response: string | null
          user_expertise_profile_id: string | null
          user_id: string | null
        }
        Insert: {
          ai_generated_response?: string | null
          coverage_date?: string | null
          coverage_secured?: boolean | null
          coverage_url?: string | null
          coverage_value?: number | null
          created_at?: string | null
          final_response?: string | null
          haro_request_id?: string | null
          id?: string
          journalist_replied?: boolean | null
          journalist_reply_at?: string | null
          match_confidence?: number | null
          match_reasons?: string[] | null
          response_status?: string | null
          submitted?: boolean | null
          submitted_at?: string | null
          tenant_id?: string | null
          updated_at?: string | null
          user_edited_response?: string | null
          user_expertise_profile_id?: string | null
          user_id?: string | null
        }
        Update: {
          ai_generated_response?: string | null
          coverage_date?: string | null
          coverage_secured?: boolean | null
          coverage_url?: string | null
          coverage_value?: number | null
          created_at?: string | null
          final_response?: string | null
          haro_request_id?: string | null
          id?: string
          journalist_replied?: boolean | null
          journalist_reply_at?: string | null
          match_confidence?: number | null
          match_reasons?: string[] | null
          response_status?: string | null
          submitted?: boolean | null
          submitted_at?: string | null
          tenant_id?: string | null
          updated_at?: string | null
          user_edited_response?: string | null
          user_expertise_profile_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "haro_matches_haro_request_id_fkey"
            columns: ["haro_request_id"]
            isOneToOne: false
            referencedRelation: "haro_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "haro_matches_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "haro_matches_user_expertise_profile_id_fkey"
            columns: ["user_expertise_profile_id"]
            isOneToOne: false
            referencedRelation: "user_expertise_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      haro_requests: {
        Row: {
          category: string | null
          created_at: string | null
          deadline: string | null
          description: string
          difficulty_score: number | null
          expires_at: string | null
          external_id: string | null
          id: string
          industry_tags: string[] | null
          is_active: boolean | null
          journalist_email: string | null
          journalist_name: string | null
          keywords: string[] | null
          opportunity_score: number | null
          outlet: string | null
          requirements: string | null
          source_url: string | null
          subject: string
          tenant_id: string | null
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          deadline?: string | null
          description: string
          difficulty_score?: number | null
          expires_at?: string | null
          external_id?: string | null
          id?: string
          industry_tags?: string[] | null
          is_active?: boolean | null
          journalist_email?: string | null
          journalist_name?: string | null
          keywords?: string[] | null
          opportunity_score?: number | null
          outlet?: string | null
          requirements?: string | null
          source_url?: string | null
          subject: string
          tenant_id?: string | null
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          deadline?: string | null
          description?: string
          difficulty_score?: number | null
          expires_at?: string | null
          external_id?: string | null
          id?: string
          industry_tags?: string[] | null
          is_active?: boolean | null
          journalist_email?: string | null
          journalist_name?: string | null
          keywords?: string[] | null
          opportunity_score?: number | null
          outlet?: string | null
          requirements?: string | null
          source_url?: string | null
          subject?: string
          tenant_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "haro_requests_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      journalist_contacts: {
        Row: {
          authority_score: number | null
          avg_response_time_hours: number | null
          beat: string
          beat_expertise_level: string | null
          beat_secondary: string[] | null
          bio: string | null
          campaign_source: string | null
          circulation_size: number | null
          click_through_rate: number | null
          communication_style_preferences: Json | null
          confidence_score: number | null
          contact_restrictions: Json | null
          content_preferences: Json | null
          content_restrictions: string[] | null
          conversion_rate: number | null
          country: string | null
          created_at: string | null
          creator_platform: string[] | null
          current_title: string | null
          data_quality_score: number | null
          data_sources: string[] | null
          declined_pitches: number | null
          discovery_method: string | null
          dynamic_tier: string | null
          email: string
          embargo_preferences: Json | null
          engagement_rate: number | null
          enrichment_date: string | null
          enrichment_sources: string[] | null
          enrichment_status: string | null
          exclusivity_requirements: string[] | null
          expertise_score: number | null
          first_name: string
          follow_up_preferences: Json | null
          id: string
          intelligence: Json | null
          interaction_count: number | null
          interaction_quality_score: number | null
          is_active: boolean | null
          journalist_first_profile_data: Json | null
          journalist_first_user_id: string | null
          language: string | null
          last_contacted: string | null
          last_enrichment_at: string | null
          last_name: string
          last_response_at: string | null
          last_verified_at: string | null
          linkedin_url: string | null
          location: string | null
          media_category: string | null
          media_type: string | null
          notes: string | null
          open_rate: number | null
          optimal_pitch_timing: Json | null
          outlet: string
          outlet_authority_rank: number | null
          outlet_monthly_reach: number | null
          phone: string | null
          pitch_preferences: Json | null
          pitch_success_probability: number | null
          preferences: Json | null
          preferred_contact_method: string | null
          preferred_contact_time: Json | null
          preferred_pitch_length: string | null
          profile_image_url: string | null
          query_posting_preferences: Json | null
          relationship_score: number | null
          relevance_score: number | null
          response_rate: number | null
          response_time_patterns: Json | null
          seasonal_availability: Json | null
          sentiment_score: number | null
          source: string | null
          source_interaction_history: Json | null
          source_url: string | null
          static_tags: Json | null
          static_tier: string | null
          story_performance_data: Json | null
          successful_pitch_examples: Json | null
          successful_pitches: number | null
          tenant_id: string
          tier_calculation_date: string | null
          tier_context: Json | null
          timezone: string | null
          title: string | null
          total_interactions: number | null
          twitter_handle: string | null
          typical_lead_time_days: number | null
          updated_at: string | null
          verification_status: string | null
        }
        Insert: {
          authority_score?: number | null
          avg_response_time_hours?: number | null
          beat: string
          beat_expertise_level?: string | null
          beat_secondary?: string[] | null
          bio?: string | null
          campaign_source?: string | null
          circulation_size?: number | null
          click_through_rate?: number | null
          communication_style_preferences?: Json | null
          confidence_score?: number | null
          contact_restrictions?: Json | null
          content_preferences?: Json | null
          content_restrictions?: string[] | null
          conversion_rate?: number | null
          country?: string | null
          created_at?: string | null
          creator_platform?: string[] | null
          current_title?: string | null
          data_quality_score?: number | null
          data_sources?: string[] | null
          declined_pitches?: number | null
          discovery_method?: string | null
          dynamic_tier?: string | null
          email: string
          embargo_preferences?: Json | null
          engagement_rate?: number | null
          enrichment_date?: string | null
          enrichment_sources?: string[] | null
          enrichment_status?: string | null
          exclusivity_requirements?: string[] | null
          expertise_score?: number | null
          first_name: string
          follow_up_preferences?: Json | null
          id?: string
          intelligence?: Json | null
          interaction_count?: number | null
          interaction_quality_score?: number | null
          is_active?: boolean | null
          journalist_first_profile_data?: Json | null
          journalist_first_user_id?: string | null
          language?: string | null
          last_contacted?: string | null
          last_enrichment_at?: string | null
          last_name: string
          last_response_at?: string | null
          last_verified_at?: string | null
          linkedin_url?: string | null
          location?: string | null
          media_category?: string | null
          media_type?: string | null
          notes?: string | null
          open_rate?: number | null
          optimal_pitch_timing?: Json | null
          outlet: string
          outlet_authority_rank?: number | null
          outlet_monthly_reach?: number | null
          phone?: string | null
          pitch_preferences?: Json | null
          pitch_success_probability?: number | null
          preferences?: Json | null
          preferred_contact_method?: string | null
          preferred_contact_time?: Json | null
          preferred_pitch_length?: string | null
          profile_image_url?: string | null
          query_posting_preferences?: Json | null
          relationship_score?: number | null
          relevance_score?: number | null
          response_rate?: number | null
          response_time_patterns?: Json | null
          seasonal_availability?: Json | null
          sentiment_score?: number | null
          source?: string | null
          source_interaction_history?: Json | null
          source_url?: string | null
          static_tags?: Json | null
          static_tier?: string | null
          story_performance_data?: Json | null
          successful_pitch_examples?: Json | null
          successful_pitches?: number | null
          tenant_id: string
          tier_calculation_date?: string | null
          tier_context?: Json | null
          timezone?: string | null
          title?: string | null
          total_interactions?: number | null
          twitter_handle?: string | null
          typical_lead_time_days?: number | null
          updated_at?: string | null
          verification_status?: string | null
        }
        Update: {
          authority_score?: number | null
          avg_response_time_hours?: number | null
          beat?: string
          beat_expertise_level?: string | null
          beat_secondary?: string[] | null
          bio?: string | null
          campaign_source?: string | null
          circulation_size?: number | null
          click_through_rate?: number | null
          communication_style_preferences?: Json | null
          confidence_score?: number | null
          contact_restrictions?: Json | null
          content_preferences?: Json | null
          content_restrictions?: string[] | null
          conversion_rate?: number | null
          country?: string | null
          created_at?: string | null
          creator_platform?: string[] | null
          current_title?: string | null
          data_quality_score?: number | null
          data_sources?: string[] | null
          declined_pitches?: number | null
          discovery_method?: string | null
          dynamic_tier?: string | null
          email?: string
          embargo_preferences?: Json | null
          engagement_rate?: number | null
          enrichment_date?: string | null
          enrichment_sources?: string[] | null
          enrichment_status?: string | null
          exclusivity_requirements?: string[] | null
          expertise_score?: number | null
          first_name?: string
          follow_up_preferences?: Json | null
          id?: string
          intelligence?: Json | null
          interaction_count?: number | null
          interaction_quality_score?: number | null
          is_active?: boolean | null
          journalist_first_profile_data?: Json | null
          journalist_first_user_id?: string | null
          language?: string | null
          last_contacted?: string | null
          last_enrichment_at?: string | null
          last_name?: string
          last_response_at?: string | null
          last_verified_at?: string | null
          linkedin_url?: string | null
          location?: string | null
          media_category?: string | null
          media_type?: string | null
          notes?: string | null
          open_rate?: number | null
          optimal_pitch_timing?: Json | null
          outlet?: string
          outlet_authority_rank?: number | null
          outlet_monthly_reach?: number | null
          phone?: string | null
          pitch_preferences?: Json | null
          pitch_success_probability?: number | null
          preferences?: Json | null
          preferred_contact_method?: string | null
          preferred_contact_time?: Json | null
          preferred_pitch_length?: string | null
          profile_image_url?: string | null
          query_posting_preferences?: Json | null
          relationship_score?: number | null
          relevance_score?: number | null
          response_rate?: number | null
          response_time_patterns?: Json | null
          seasonal_availability?: Json | null
          sentiment_score?: number | null
          source?: string | null
          source_interaction_history?: Json | null
          source_url?: string | null
          static_tags?: Json | null
          static_tier?: string | null
          story_performance_data?: Json | null
          successful_pitch_examples?: Json | null
          successful_pitches?: number | null
          tenant_id?: string
          tier_calculation_date?: string | null
          tier_context?: Json | null
          timezone?: string | null
          title?: string | null
          total_interactions?: number | null
          twitter_handle?: string | null
          typical_lead_time_days?: number | null
          updated_at?: string | null
          verification_status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "journalist_contacts_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      journalist_contacts_backup_20250718: {
        Row: {
          beat: string | null
          bio: string | null
          campaign_source: string | null
          circulation_size: number | null
          country: string | null
          created_at: string | null
          email: string | null
          enrichment_date: string | null
          enrichment_status: string | null
          first_name: string | null
          id: string | null
          intelligence: Json | null
          interaction_count: number | null
          is_active: boolean | null
          language: string | null
          last_contacted: string | null
          last_name: string | null
          linkedin_url: string | null
          location: string | null
          media_type: string | null
          notes: string | null
          outlet: string | null
          phone: string | null
          preferences: Json | null
          relationship_score: number | null
          source: string | null
          static_tags: Json | null
          tenant_id: string | null
          title: string | null
          twitter_handle: string | null
          updated_at: string | null
        }
        Insert: {
          beat?: string | null
          bio?: string | null
          campaign_source?: string | null
          circulation_size?: number | null
          country?: string | null
          created_at?: string | null
          email?: string | null
          enrichment_date?: string | null
          enrichment_status?: string | null
          first_name?: string | null
          id?: string | null
          intelligence?: Json | null
          interaction_count?: number | null
          is_active?: boolean | null
          language?: string | null
          last_contacted?: string | null
          last_name?: string | null
          linkedin_url?: string | null
          location?: string | null
          media_type?: string | null
          notes?: string | null
          outlet?: string | null
          phone?: string | null
          preferences?: Json | null
          relationship_score?: number | null
          source?: string | null
          static_tags?: Json | null
          tenant_id?: string | null
          title?: string | null
          twitter_handle?: string | null
          updated_at?: string | null
        }
        Update: {
          beat?: string | null
          bio?: string | null
          campaign_source?: string | null
          circulation_size?: number | null
          country?: string | null
          created_at?: string | null
          email?: string | null
          enrichment_date?: string | null
          enrichment_status?: string | null
          first_name?: string | null
          id?: string | null
          intelligence?: Json | null
          interaction_count?: number | null
          is_active?: boolean | null
          language?: string | null
          last_contacted?: string | null
          last_name?: string | null
          linkedin_url?: string | null
          location?: string | null
          media_type?: string | null
          notes?: string | null
          outlet?: string | null
          phone?: string | null
          preferences?: Json | null
          relationship_score?: number | null
          source?: string | null
          static_tags?: Json | null
          tenant_id?: string | null
          title?: string | null
          twitter_handle?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      journalist_outreach: {
        Row: {
          campaign_id: string | null
          created_at: string | null
          created_by: string | null
          follow_up_scheduled: string | null
          id: string
          journalist_id: string | null
          message: string
          notes: string | null
          opened_at: string | null
          outreach_type: string
          press_release_id: string | null
          replied_at: string | null
          reply_sentiment: string | null
          sent_at: string | null
          status: string | null
          subject: string
          tenant_id: string
        }
        Insert: {
          campaign_id?: string | null
          created_at?: string | null
          created_by?: string | null
          follow_up_scheduled?: string | null
          id?: string
          journalist_id?: string | null
          message: string
          notes?: string | null
          opened_at?: string | null
          outreach_type: string
          press_release_id?: string | null
          replied_at?: string | null
          reply_sentiment?: string | null
          sent_at?: string | null
          status?: string | null
          subject: string
          tenant_id: string
        }
        Update: {
          campaign_id?: string | null
          created_at?: string | null
          created_by?: string | null
          follow_up_scheduled?: string | null
          id?: string
          journalist_id?: string | null
          message?: string
          notes?: string | null
          opened_at?: string | null
          outreach_type?: string
          press_release_id?: string | null
          replied_at?: string | null
          reply_sentiment?: string | null
          sent_at?: string | null
          status?: string | null
          subject?: string
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "journalist_outreach_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "journalist_outreach_journalist_id_fkey"
            columns: ["journalist_id"]
            isOneToOne: false
            referencedRelation: "journalist_contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "journalist_outreach_press_release_id_fkey"
            columns: ["press_release_id"]
            isOneToOne: false
            referencedRelation: "press_releases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "journalist_outreach_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      journalist_outreach_sessions: {
        Row: {
          ai_insights: Json | null
          campaign_id: string | null
          created_at: string | null
          delivered_at: string | null
          follow_up_recommendations: Json | null
          id: string
          journalist_id: string | null
          opened_at: string | null
          optimal_timing: Json | null
          outcome: string | null
          pitch_content: string
          pitch_title: string
          relevance_score: number | null
          responded_at: string | null
          response_content: string | null
          response_sentiment: string | null
          sent_at: string | null
          session_type: string | null
          status: string | null
          success_probability: number | null
          tenant_id: string
          updated_at: string | null
        }
        Insert: {
          ai_insights?: Json | null
          campaign_id?: string | null
          created_at?: string | null
          delivered_at?: string | null
          follow_up_recommendations?: Json | null
          id?: string
          journalist_id?: string | null
          opened_at?: string | null
          optimal_timing?: Json | null
          outcome?: string | null
          pitch_content: string
          pitch_title: string
          relevance_score?: number | null
          responded_at?: string | null
          response_content?: string | null
          response_sentiment?: string | null
          sent_at?: string | null
          session_type?: string | null
          status?: string | null
          success_probability?: number | null
          tenant_id: string
          updated_at?: string | null
        }
        Update: {
          ai_insights?: Json | null
          campaign_id?: string | null
          created_at?: string | null
          delivered_at?: string | null
          follow_up_recommendations?: Json | null
          id?: string
          journalist_id?: string | null
          opened_at?: string | null
          optimal_timing?: Json | null
          outcome?: string | null
          pitch_content?: string
          pitch_title?: string
          relevance_score?: number | null
          responded_at?: string | null
          response_content?: string | null
          response_sentiment?: string | null
          sent_at?: string | null
          session_type?: string | null
          status?: string | null
          success_probability?: number | null
          tenant_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "journalist_outreach_sessions_journalist_id_fkey"
            columns: ["journalist_id"]
            isOneToOne: false
            referencedRelation: "journalist_contacts"
            referencedColumns: ["id"]
          },
        ]
      }
      legal_compliance_tracking: {
        Row: {
          can_spam_compliance: boolean | null
          communication_frequency: string | null
          consent_date: string | null
          consent_evidence: Json | null
          consent_ip_address: unknown | null
          consent_method: string | null
          consent_status: string
          consent_type: string
          content_preferences: string[] | null
          created_at: string | null
          do_not_contact_reason: string | null
          gdpr_compliance: boolean | null
          id: string
          journalist_id: string | null
          last_updated: string | null
          regional_compliance: Json | null
          tenant_id: string
          unsubscribe_date: string | null
          unsubscribe_honored: boolean | null
          unsubscribe_method: string | null
        }
        Insert: {
          can_spam_compliance?: boolean | null
          communication_frequency?: string | null
          consent_date?: string | null
          consent_evidence?: Json | null
          consent_ip_address?: unknown | null
          consent_method?: string | null
          consent_status?: string
          consent_type: string
          content_preferences?: string[] | null
          created_at?: string | null
          do_not_contact_reason?: string | null
          gdpr_compliance?: boolean | null
          id?: string
          journalist_id?: string | null
          last_updated?: string | null
          regional_compliance?: Json | null
          tenant_id: string
          unsubscribe_date?: string | null
          unsubscribe_honored?: boolean | null
          unsubscribe_method?: string | null
        }
        Update: {
          can_spam_compliance?: boolean | null
          communication_frequency?: string | null
          consent_date?: string | null
          consent_evidence?: Json | null
          consent_ip_address?: unknown | null
          consent_method?: string | null
          consent_status?: string
          consent_type?: string
          content_preferences?: string[] | null
          created_at?: string | null
          do_not_contact_reason?: string | null
          gdpr_compliance?: boolean | null
          id?: string
          journalist_id?: string | null
          last_updated?: string | null
          regional_compliance?: Json | null
          tenant_id?: string
          unsubscribe_date?: string | null
          unsubscribe_honored?: boolean | null
          unsubscribe_method?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "legal_compliance_tracking_journalist_id_fkey"
            columns: ["journalist_id"]
            isOneToOne: false
            referencedRelation: "journalist_contacts"
            referencedColumns: ["id"]
          },
        ]
      }
      media_coverage: {
        Row: {
          article_title: string
          article_url: string | null
          created_at: string | null
          engagement_score: number | null
          id: string
          is_featured: boolean | null
          journalist_id: string | null
          media_value: number | null
          mentions_count: number | null
          outlet_id: string | null
          press_release_id: string | null
          publication_date: string | null
          reach_estimate: number | null
          sentiment_score: number | null
          share_count: number | null
          tenant_id: string
          updated_at: string | null
        }
        Insert: {
          article_title: string
          article_url?: string | null
          created_at?: string | null
          engagement_score?: number | null
          id?: string
          is_featured?: boolean | null
          journalist_id?: string | null
          media_value?: number | null
          mentions_count?: number | null
          outlet_id?: string | null
          press_release_id?: string | null
          publication_date?: string | null
          reach_estimate?: number | null
          sentiment_score?: number | null
          share_count?: number | null
          tenant_id: string
          updated_at?: string | null
        }
        Update: {
          article_title?: string
          article_url?: string | null
          created_at?: string | null
          engagement_score?: number | null
          id?: string
          is_featured?: boolean | null
          journalist_id?: string | null
          media_value?: number | null
          mentions_count?: number | null
          outlet_id?: string | null
          press_release_id?: string | null
          publication_date?: string | null
          reach_estimate?: number | null
          sentiment_score?: number | null
          share_count?: number | null
          tenant_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "media_coverage_journalist_id_fkey"
            columns: ["journalist_id"]
            isOneToOne: false
            referencedRelation: "journalist_contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "media_coverage_outlet_id_fkey"
            columns: ["outlet_id"]
            isOneToOne: false
            referencedRelation: "media_outlets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "media_coverage_press_release_id_fkey"
            columns: ["press_release_id"]
            isOneToOne: false
            referencedRelation: "press_releases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "media_coverage_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      media_outlets: {
        Row: {
          category: string
          circulation: number | null
          created_at: string | null
          domain_authority: number | null
          geographic_focus: string[] | null
          id: string
          industry_focus: string[] | null
          is_active: boolean | null
          is_premium: boolean | null
          name: string
          submission_email: string | null
          submission_guidelines: string | null
          tenant_id: string
          turnaround_time: string | null
          updated_at: string | null
          website: string | null
        }
        Insert: {
          category: string
          circulation?: number | null
          created_at?: string | null
          domain_authority?: number | null
          geographic_focus?: string[] | null
          id?: string
          industry_focus?: string[] | null
          is_active?: boolean | null
          is_premium?: boolean | null
          name: string
          submission_email?: string | null
          submission_guidelines?: string | null
          tenant_id: string
          turnaround_time?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          category?: string
          circulation?: number | null
          created_at?: string | null
          domain_authority?: number | null
          geographic_focus?: string[] | null
          id?: string
          industry_focus?: string[] | null
          is_active?: boolean | null
          is_premium?: boolean | null
          name?: string
          submission_email?: string | null
          submission_guidelines?: string | null
          tenant_id?: string
          turnaround_time?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "media_outlets_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      media_relationships: {
        Row: {
          created_at: string | null
          id: string
          journalist_id: string | null
          last_interaction: string | null
          notes: string | null
          outlet_id: string | null
          relationship_type: string
          strength_score: number | null
          tenant_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          journalist_id?: string | null
          last_interaction?: string | null
          notes?: string | null
          outlet_id?: string | null
          relationship_type: string
          strength_score?: number | null
          tenant_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          journalist_id?: string | null
          last_interaction?: string | null
          notes?: string | null
          outlet_id?: string | null
          relationship_type?: string
          strength_score?: number | null
          tenant_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "media_relationships_journalist_id_fkey"
            columns: ["journalist_id"]
            isOneToOne: false
            referencedRelation: "journalist_contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "media_relationships_outlet_id_fkey"
            columns: ["outlet_id"]
            isOneToOne: false
            referencedRelation: "media_outlets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "media_relationships_tenant_id_fkey"
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
      scraper_raw_profiles: {
        Row: {
          ai_processed_at: string | null
          bio: string | null
          campaign_source: string | null
          converted_to_contact: boolean | null
          created_at: string | null
          email: string | null
          full_name: string | null
          geo_focus: string | null
          id: string
          industry_tags: string[] | null
          media_type: string | null
          organization: string | null
          processed: boolean | null
          processed_at: string | null
          profile_url: string
          qa_notes: string | null
          qa_status: string | null
          role: string | null
          source: string
          summary: string | null
          tags: string[] | null
        }
        Insert: {
          ai_processed_at?: string | null
          bio?: string | null
          campaign_source?: string | null
          converted_to_contact?: boolean | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          geo_focus?: string | null
          id?: string
          industry_tags?: string[] | null
          media_type?: string | null
          organization?: string | null
          processed?: boolean | null
          processed_at?: string | null
          profile_url: string
          qa_notes?: string | null
          qa_status?: string | null
          role?: string | null
          source: string
          summary?: string | null
          tags?: string[] | null
        }
        Update: {
          ai_processed_at?: string | null
          bio?: string | null
          campaign_source?: string | null
          converted_to_contact?: boolean | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          geo_focus?: string | null
          id?: string
          industry_tags?: string[] | null
          media_type?: string | null
          organization?: string | null
          processed?: boolean | null
          processed_at?: string | null
          profile_url?: string
          qa_notes?: string | null
          qa_status?: string | null
          role?: string | null
          source?: string
          summary?: string | null
          tags?: string[] | null
        }
        Relationships: []
      }
      scraper_raw_profiles_backup_20250718: {
        Row: {
          ai_processed_at: string | null
          bio: string | null
          campaign_source: string | null
          converted_to_contact: boolean | null
          created_at: string | null
          email: string | null
          full_name: string | null
          geo_focus: string | null
          id: string | null
          industry_tags: string[] | null
          media_type: string | null
          organization: string | null
          processed: boolean | null
          processed_at: string | null
          profile_url: string | null
          qa_notes: string | null
          qa_status: string | null
          role: string | null
          source: string | null
          summary: string | null
          tags: string[] | null
        }
        Insert: {
          ai_processed_at?: string | null
          bio?: string | null
          campaign_source?: string | null
          converted_to_contact?: boolean | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          geo_focus?: string | null
          id?: string | null
          industry_tags?: string[] | null
          media_type?: string | null
          organization?: string | null
          processed?: boolean | null
          processed_at?: string | null
          profile_url?: string | null
          qa_notes?: string | null
          qa_status?: string | null
          role?: string | null
          source?: string | null
          summary?: string | null
          tags?: string[] | null
        }
        Update: {
          ai_processed_at?: string | null
          bio?: string | null
          campaign_source?: string | null
          converted_to_contact?: boolean | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          geo_focus?: string | null
          id?: string | null
          industry_tags?: string[] | null
          media_type?: string | null
          organization?: string | null
          processed?: boolean | null
          processed_at?: string | null
          profile_url?: string | null
          qa_notes?: string | null
          qa_status?: string | null
          role?: string | null
          source?: string | null
          summary?: string | null
          tags?: string[] | null
        }
        Relationships: []
      }
      seo_keywords: {
        Row: {
          campaign_id: string | null
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
          campaign_id?: string | null
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
          campaign_id?: string | null
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
            foreignKeyName: "seo_keywords_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "seo_keywords_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      source_catalog: {
        Row: {
          contact_count: number | null
          discovered_at: string | null
          discovered_by: string | null
          domain: string
          id: number
          last_scraped: string | null
          outlet_type: string | null
          patterns: string[] | null
          region: string | null
          sample_urls: string[] | null
          status: string | null
        }
        Insert: {
          contact_count?: number | null
          discovered_at?: string | null
          discovered_by?: string | null
          domain: string
          id?: number
          last_scraped?: string | null
          outlet_type?: string | null
          patterns?: string[] | null
          region?: string | null
          sample_urls?: string[] | null
          status?: string | null
        }
        Update: {
          contact_count?: number | null
          discovered_at?: string | null
          discovered_by?: string | null
          domain?: string
          id?: number
          last_scraped?: string | null
          outlet_type?: string | null
          patterns?: string[] | null
          region?: string | null
          sample_urls?: string[] | null
          status?: string | null
        }
        Relationships: []
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
      user_expertise_profiles: {
        Row: {
          bio: string | null
          company: string | null
          contact_email: string | null
          created_at: string | null
          credentials: string | null
          expertise_areas: string[] | null
          full_name: string
          id: string
          industries: string[] | null
          is_active: boolean | null
          keywords: string[] | null
          matching_threshold: number | null
          notification_preferences: Json | null
          tenant_id: string | null
          title: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          bio?: string | null
          company?: string | null
          contact_email?: string | null
          created_at?: string | null
          credentials?: string | null
          expertise_areas?: string[] | null
          full_name: string
          id?: string
          industries?: string[] | null
          is_active?: boolean | null
          keywords?: string[] | null
          matching_threshold?: number | null
          notification_preferences?: Json | null
          tenant_id?: string | null
          title?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          bio?: string | null
          company?: string | null
          contact_email?: string | null
          created_at?: string | null
          credentials?: string | null
          expertise_areas?: string[] | null
          full_name?: string
          id?: string
          industries?: string[] | null
          is_active?: boolean | null
          keywords?: string[] | null
          matching_threshold?: number | null
          notification_preferences?: Json | null
          tenant_id?: string | null
          title?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_expertise_profiles_tenant_id_fkey"
            columns: ["tenant_id"]
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
    Enums: {},
  },
} as const
