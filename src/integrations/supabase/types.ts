export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5";
  };
  public: {
    Tables: {
      achievements: {
        Row: {
          code: string;
          criteria: Json;
          description: string;
          icon: string;
          sort_order: number;
          title: string;
        };
        Insert: {
          code: string;
          criteria?: Json;
          description: string;
          icon?: string;
          sort_order?: number;
          title: string;
        };
        Update: {
          code?: string;
          criteria?: Json;
          description?: string;
          icon?: string;
          sort_order?: number;
          title?: string;
        };
        Relationships: [];
      };
      bookmarks: {
        Row: {
          created_at: string;
          id: string;
          item_id: string;
          item_type: string;
          metadata: Json;
          subtitle: string | null;
          title: string;
          url: string | null;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          item_id: string;
          item_type: string;
          metadata?: Json;
          subtitle?: string | null;
          title: string;
          url?: string | null;
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          item_id?: string;
          item_type?: string;
          metadata?: Json;
          subtitle?: string | null;
          title?: string;
          url?: string | null;
          user_id?: string;
        };
        Relationships: [];
      };
      chat_messages: {
        Row: {
          content: string;
          created_at: string;
          id: string;
          role: string;
          thread_id: string;
          user_id: string;
        };
        Insert: {
          content: string;
          created_at?: string;
          id?: string;
          role: string;
          thread_id: string;
          user_id: string;
        };
        Update: {
          content?: string;
          created_at?: string;
          id?: string;
          role?: string;
          thread_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "chat_messages_thread_id_fkey";
            columns: ["thread_id"];
            isOneToOne: false;
            referencedRelation: "chat_threads";
            referencedColumns: ["id"];
          },
        ];
      };
      chat_threads: {
        Row: {
          created_at: string;
          id: string;
          scope: string;
          title: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          scope?: string;
          title?: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          scope?: string;
          title?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      code_review_comments: {
        Row: {
          body: string;
          created_at: string;
          id: string;
          review_id: string;
          user_id: string;
        };
        Insert: {
          body: string;
          created_at?: string;
          id?: string;
          review_id: string;
          user_id: string;
        };
        Update: {
          body?: string;
          created_at?: string;
          id?: string;
          review_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "code_review_comments_review_id_fkey";
            columns: ["review_id"];
            isOneToOne: false;
            referencedRelation: "code_reviews";
            referencedColumns: ["id"];
          },
        ];
      };
      code_reviews: {
        Row: {
          ai_feedback: string | null;
          ai_score: number | null;
          code: string;
          created_at: string;
          description: string | null;
          id: string;
          language: string;
          title: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          ai_feedback?: string | null;
          ai_score?: number | null;
          code: string;
          created_at?: string;
          description?: string | null;
          id?: string;
          language?: string;
          title: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          ai_feedback?: string | null;
          ai_score?: number | null;
          code?: string;
          created_at?: string;
          description?: string | null;
          id?: string;
          language?: string;
          title?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      comments: {
        Row: {
          author_id: string;
          body: string;
          created_at: string;
          id: string;
          post_id: string;
        };
        Insert: {
          author_id: string;
          body: string;
          created_at?: string;
          id?: string;
          post_id: string;
        };
        Update: {
          author_id?: string;
          body?: string;
          created_at?: string;
          id?: string;
          post_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "comments_post_id_fkey";
            columns: ["post_id"];
            isOneToOne: false;
            referencedRelation: "community_posts";
            referencedColumns: ["id"];
          },
        ];
      };
      community_posts: {
        Row: {
          author_id: string;
          body: string;
          comment_count: number;
          created_at: string;
          id: string;
          like_count: number;
          room: string;
          title: string;
          updated_at: string;
        };
        Insert: {
          author_id: string;
          body: string;
          comment_count?: number;
          created_at?: string;
          id?: string;
          like_count?: number;
          room: string;
          title: string;
          updated_at?: string;
        };
        Update: {
          author_id?: string;
          body?: string;
          comment_count?: number;
          created_at?: string;
          id?: string;
          like_count?: number;
          room?: string;
          title?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      interview_answers: {
        Row: {
          answer_text: string;
          created_at: string;
          difficulty: string | null;
          expected_topics: string[];
          id: string;
          interview_id: string;
          q_index: number;
          question: string;
          user_id: string;
        };
        Insert: {
          answer_text?: string;
          created_at?: string;
          difficulty?: string | null;
          expected_topics?: string[];
          id?: string;
          interview_id: string;
          q_index: number;
          question: string;
          user_id: string;
        };
        Update: {
          answer_text?: string;
          created_at?: string;
          difficulty?: string | null;
          expected_topics?: string[];
          id?: string;
          interview_id?: string;
          q_index?: number;
          question?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "interview_answers_interview_id_fkey";
            columns: ["interview_id"];
            isOneToOne: false;
            referencedRelation: "interviews";
            referencedColumns: ["id"];
          },
        ];
      };
      interview_feedback: {
        Row: {
          answer_id: string;
          better_answer: string | null;
          communication_score: number;
          confidence_score: number;
          created_at: string;
          id: string;
          overall_score: number;
          problem_solving_score: number;
          strengths: Json;
          suggestions: Json;
          technical_score: number;
          user_id: string;
          weaknesses: Json;
        };
        Insert: {
          answer_id: string;
          better_answer?: string | null;
          communication_score: number;
          confidence_score: number;
          created_at?: string;
          id?: string;
          overall_score: number;
          problem_solving_score: number;
          strengths?: Json;
          suggestions?: Json;
          technical_score: number;
          user_id: string;
          weaknesses?: Json;
        };
        Update: {
          answer_id?: string;
          better_answer?: string | null;
          communication_score?: number;
          confidence_score?: number;
          created_at?: string;
          id?: string;
          overall_score?: number;
          problem_solving_score?: number;
          strengths?: Json;
          suggestions?: Json;
          technical_score?: number;
          user_id?: string;
          weaknesses?: Json;
        };
        Relationships: [
          {
            foreignKeyName: "interview_feedback_answer_id_fkey";
            columns: ["answer_id"];
            isOneToOne: false;
            referencedRelation: "interview_answers";
            referencedColumns: ["id"];
          },
        ];
      };
      interviews: {
        Row: {
          communication_score: number | null;
          completed_at: string | null;
          confidence_score: number | null;
          created_at: string;
          difficulty: string;
          id: string;
          interview_type: string;
          overall_score: number | null;
          problem_solving_score: number | null;
          role: string;
          status: string;
          technical_score: number | null;
          total_questions: number;
          user_id: string;
        };
        Insert: {
          communication_score?: number | null;
          completed_at?: string | null;
          confidence_score?: number | null;
          created_at?: string;
          difficulty: string;
          id?: string;
          interview_type: string;
          overall_score?: number | null;
          problem_solving_score?: number | null;
          role: string;
          status?: string;
          technical_score?: number | null;
          total_questions?: number;
          user_id: string;
        };
        Update: {
          communication_score?: number | null;
          completed_at?: string | null;
          confidence_score?: number | null;
          created_at?: string;
          difficulty?: string;
          id?: string;
          interview_type?: string;
          overall_score?: number | null;
          problem_solving_score?: number | null;
          role?: string;
          status?: string;
          technical_score?: number | null;
          total_questions?: number;
          user_id?: string;
        };
        Relationships: [];
      };
      notifications: {
        Row: {
          body: string | null;
          created_at: string;
          id: string;
          link: string | null;
          read_at: string | null;
          title: string;
          type: string;
          user_id: string;
        };
        Insert: {
          body?: string | null;
          created_at?: string;
          id?: string;
          link?: string | null;
          read_at?: string | null;
          title: string;
          type: string;
          user_id: string;
        };
        Update: {
          body?: string | null;
          created_at?: string;
          id?: string;
          link?: string | null;
          read_at?: string | null;
          title?: string;
          type?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      post_likes: {
        Row: {
          created_at: string;
          post_id: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          post_id: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          post_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "post_likes_post_id_fkey";
            columns: ["post_id"];
            isOneToOne: false;
            referencedRelation: "community_posts";
            referencedColumns: ["id"];
          },
        ];
      };
      profiles: {
        Row: {
          branch: string | null;
          college: string | null;
          created_at: string;
          degree: string | null;
          email: string | null;
          full_name: string | null;
          github: string | null;
          graduation_year: number | null;
          id: string;
          linkedin: string | null;
          portfolio: string | null;
          preferred_companies: string[];
          skills: string[];
          target_roles: string[];
          updated_at: string;
        };
        Insert: {
          branch?: string | null;
          college?: string | null;
          created_at?: string;
          degree?: string | null;
          email?: string | null;
          full_name?: string | null;
          github?: string | null;
          graduation_year?: number | null;
          id: string;
          linkedin?: string | null;
          portfolio?: string | null;
          preferred_companies?: string[];
          skills?: string[];
          target_roles?: string[];
          updated_at?: string;
        };
        Update: {
          branch?: string | null;
          college?: string | null;
          created_at?: string;
          degree?: string | null;
          email?: string | null;
          full_name?: string | null;
          github?: string | null;
          graduation_year?: number | null;
          id?: string;
          linkedin?: string | null;
          portfolio?: string | null;
          preferred_companies?: string[];
          skills?: string[];
          target_roles?: string[];
          updated_at?: string;
        };
        Relationships: [];
      };
      public_profiles: {
        Row: {
          bio: string | null;
          created_at: string;
          headline: string | null;
          is_public: boolean;
          show_badges: boolean;
          show_email: boolean;
          show_interview: boolean;
          show_problems: boolean;
          show_resume_score: boolean;
          updated_at: string;
          user_id: string;
          username: string;
        };
        Insert: {
          bio?: string | null;
          created_at?: string;
          headline?: string | null;
          is_public?: boolean;
          show_badges?: boolean;
          show_email?: boolean;
          show_interview?: boolean;
          show_problems?: boolean;
          show_resume_score?: boolean;
          updated_at?: string;
          user_id: string;
          username: string;
        };
        Update: {
          bio?: string | null;
          created_at?: string;
          headline?: string | null;
          is_public?: boolean;
          show_badges?: boolean;
          show_email?: boolean;
          show_interview?: boolean;
          show_problems?: boolean;
          show_resume_score?: boolean;
          updated_at?: string;
          user_id?: string;
          username?: string;
        };
        Relationships: [];
      };
      recruiter_shortlists: {
        Row: {
          created_at: string;
          notes: string | null;
          recruiter_id: string;
          status: Database["public"]["Enums"]["shortlist_status"];
          student_user_id: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          notes?: string | null;
          recruiter_id: string;
          status?: Database["public"]["Enums"]["shortlist_status"];
          student_user_id: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          notes?: string | null;
          recruiter_id?: string;
          status?: Database["public"]["Enums"]["shortlist_status"];
          student_user_id?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      resume_analyses: {
        Row: {
          ats_score: number;
          created_at: string;
          id: string;
          missing_keywords: Json;
          missing_skills: Json;
          model: string | null;
          recommended_topics: Json;
          resume_id: string | null;
          role_match: Json;
          strengths: Json;
          suggestions: Json;
          summary: string | null;
          user_id: string;
          weaknesses: Json;
        };
        Insert: {
          ats_score?: number;
          created_at?: string;
          id?: string;
          missing_keywords?: Json;
          missing_skills?: Json;
          model?: string | null;
          recommended_topics?: Json;
          resume_id?: string | null;
          role_match?: Json;
          strengths?: Json;
          suggestions?: Json;
          summary?: string | null;
          user_id: string;
          weaknesses?: Json;
        };
        Update: {
          ats_score?: number;
          created_at?: string;
          id?: string;
          missing_keywords?: Json;
          missing_skills?: Json;
          model?: string | null;
          recommended_topics?: Json;
          resume_id?: string | null;
          role_match?: Json;
          strengths?: Json;
          suggestions?: Json;
          summary?: string | null;
          user_id?: string;
          weaknesses?: Json;
        };
        Relationships: [
          {
            foreignKeyName: "resume_analyses_resume_id_fkey";
            columns: ["resume_id"];
            isOneToOne: false;
            referencedRelation: "resumes";
            referencedColumns: ["id"];
          },
        ];
      };
      resume_builder_resumes: {
        Row: {
          created_at: string;
          data: Json;
          id: string;
          template: string;
          title: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          data?: Json;
          id?: string;
          template?: string;
          title?: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          data?: Json;
          id?: string;
          template?: string;
          title?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      resumes: {
        Row: {
          created_at: string;
          file_name: string;
          id: string;
          raw_text: string;
          storage_path: string | null;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          file_name: string;
          id?: string;
          raw_text: string;
          storage_path?: string | null;
          user_id: string;
        };
        Update: {
          created_at?: string;
          file_name?: string;
          id?: string;
          raw_text?: string;
          storage_path?: string | null;
          user_id?: string;
        };
        Relationships: [];
      };
      saved_jobs: {
        Row: {
          apply_url: string | null;
          company: string;
          created_at: string;
          description: string | null;
          employment_type: string | null;
          id: string;
          location: string | null;
          match_pct: number;
          matched_skills: string[];
          missing_skills: string[];
          recommended_prep: string[];
          saved: boolean;
          source: Json;
          tags: string[];
          title: string;
          user_id: string;
        };
        Insert: {
          apply_url?: string | null;
          company: string;
          created_at?: string;
          description?: string | null;
          employment_type?: string | null;
          id?: string;
          location?: string | null;
          match_pct?: number;
          matched_skills?: string[];
          missing_skills?: string[];
          recommended_prep?: string[];
          saved?: boolean;
          source?: Json;
          tags?: string[];
          title: string;
          user_id: string;
        };
        Update: {
          apply_url?: string | null;
          company?: string;
          created_at?: string;
          description?: string | null;
          employment_type?: string | null;
          id?: string;
          location?: string | null;
          match_pct?: number;
          matched_skills?: string[];
          missing_skills?: string[];
          recommended_prep?: string[];
          saved?: boolean;
          source?: Json;
          tags?: string[];
          title?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      saved_posts: {
        Row: {
          created_at: string;
          post_id: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          post_id: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          post_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "saved_posts_post_id_fkey";
            columns: ["post_id"];
            isOneToOne: false;
            referencedRelation: "community_posts";
            referencedColumns: ["id"];
          },
        ];
      };
      streaks: {
        Row: {
          best_streak: number;
          current_streak: number;
          last_active_date: string | null;
          total_activity_days: number;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          best_streak?: number;
          current_streak?: number;
          last_active_date?: string | null;
          total_activity_days?: number;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          best_streak?: number;
          current_streak?: number;
          last_active_date?: string | null;
          total_activity_days?: number;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      study_group_members: {
        Row: {
          group_id: string;
          joined_at: string;
          role: string;
          user_id: string;
        };
        Insert: {
          group_id: string;
          joined_at?: string;
          role?: string;
          user_id: string;
        };
        Update: {
          group_id?: string;
          joined_at?: string;
          role?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "study_group_members_group_id_fkey";
            columns: ["group_id"];
            isOneToOne: false;
            referencedRelation: "study_groups";
            referencedColumns: ["id"];
          },
        ];
      };
      study_groups: {
        Row: {
          created_at: string;
          description: string | null;
          goal: string | null;
          id: string;
          invite_code: string;
          name: string;
          owner_id: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          goal?: string | null;
          id?: string;
          invite_code?: string;
          name: string;
          owner_id: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          goal?: string | null;
          id?: string;
          invite_code?: string;
          name?: string;
          owner_id?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      study_plans: {
        Row: {
          created_at: string;
          generated_from: Json;
          id: string;
          status: string;
          summary: string | null;
          user_id: string;
          week_start: string;
        };
        Insert: {
          created_at?: string;
          generated_from?: Json;
          id?: string;
          status?: string;
          summary?: string | null;
          user_id: string;
          week_start: string;
        };
        Update: {
          created_at?: string;
          generated_from?: Json;
          id?: string;
          status?: string;
          summary?: string | null;
          user_id?: string;
          week_start?: string;
        };
        Relationships: [];
      };
      study_tasks: {
        Row: {
          created_at: string;
          day_index: number;
          estimated_minutes: number;
          id: string;
          kind: string;
          plan_id: string;
          problem_slug: string | null;
          status: string;
          title: string;
          topic: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          day_index: number;
          estimated_minutes?: number;
          id?: string;
          kind?: string;
          plan_id: string;
          problem_slug?: string | null;
          status?: string;
          title: string;
          topic: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          day_index?: number;
          estimated_minutes?: number;
          id?: string;
          kind?: string;
          plan_id?: string;
          problem_slug?: string | null;
          status?: string;
          title?: string;
          topic?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "study_tasks_plan_id_fkey";
            columns: ["plan_id"];
            isOneToOne: false;
            referencedRelation: "study_plans";
            referencedColumns: ["id"];
          },
        ];
      };
      user_achievements: {
        Row: {
          achievement_code: string;
          earned_at: string;
          user_id: string;
        };
        Insert: {
          achievement_code: string;
          earned_at?: string;
          user_id: string;
        };
        Update: {
          achievement_code?: string;
          earned_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "user_achievements_achievement_code_fkey";
            columns: ["achievement_code"];
            isOneToOne: false;
            referencedRelation: "achievements";
            referencedColumns: ["code"];
          },
        ];
      };
      user_problem_progress: {
        Row: {
          bookmarked: boolean;
          created_at: string;
          id: string;
          notes: string | null;
          problem_slug: string;
          revision_count: number;
          solved_at: string | null;
          status: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          bookmarked?: boolean;
          created_at?: string;
          id?: string;
          notes?: string | null;
          problem_slug: string;
          revision_count?: number;
          solved_at?: string | null;
          status?: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          bookmarked?: boolean;
          created_at?: string;
          id?: string;
          notes?: string | null;
          problem_slug?: string;
          revision_count?: number;
          solved_at?: string | null;
          status?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      user_roles: {
        Row: {
          created_at: string;
          id: string;
          role: Database["public"]["Enums"]["app_role"];
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          role: Database["public"]["Enums"]["app_role"];
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          role?: Database["public"]["Enums"]["app_role"];
          user_id?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      admin_analytics: { Args: never; Returns: Json };
      admin_can_claim: { Args: never; Returns: boolean };
      admin_list_users: {
        Args: { _limit?: number; _search?: string };
        Returns: {
          email: string;
          full_name: string;
          roles: string[];
          user_id: string;
        }[];
      };
      admin_set_role: {
        Args: {
          _grant: boolean;
          _role: Database["public"]["Enums"]["app_role"];
          _target: string;
        };
        Returns: boolean;
      };
      award_achievement: { Args: { _code: string }; Returns: boolean };
      bootstrap_my_role: { Args: never; Returns: string };
      claim_first_admin: { Args: never; Returns: boolean };
      get_display_names: {
        Args: { _ids: string[] };
        Returns: {
          display_name: string;
          user_id: string;
          username: string;
        }[];
      };
      get_leaderboard: {
        Args: { _metric: string; _scope: string };
        Returns: {
          score: number;
          user_id: string;
        }[];
      };
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"];
          _user_id: string;
        };
        Returns: boolean;
      };
      is_group_member: {
        Args: { _group_id: string; _user_id: string };
        Returns: boolean;
      };
      join_group_by_invite: { Args: { _code: string }; Returns: string };
    };
    Enums: {
      app_role: "admin" | "moderator" | "user" | "recruiter";
      shortlist_status: "new" | "contacted" | "interviewing" | "offer" | "rejected";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user", "recruiter"],
      shortlist_status: ["new", "contacted", "interviewing", "offer", "rejected"],
    },
  },
} as const;
