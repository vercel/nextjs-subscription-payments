export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          first_name: string | null;
          last_name: string | null;
          billing_address: Json | null;
          payment_method: Json | null;
          full_name: string | null;
          avatar_url: string | null;
        };
        Insert: {
          id: string;
          first_name?: string | null;
          last_name?: string | null;
          billing_address?: Json | null;
          payment_method?: Json | null;
          full_name?: string | null;
          avatar_url?: string | null;
        };
        Update: {
          id?: string;
          first_name?: string | null;
          last_name?: string | null;
          billing_address?: Json | null;
          payment_method?: Json | null;
          full_name?: string | null;
          avatar_url?: string | null;
        };
      };
      customers: {
        Row: {
          id: string;
          stripe_customer_id: string | null;
        };
        Insert: {
          id: string;
          stripe_customer_id?: string | null;
        };
        Update: {
          id?: string;
          stripe_customer_id?: string | null;
        };
      };
      products: {
        Row: {
          id: string;
          active: boolean | null;
          name: string | null;
          description: string | null;
          access_role:
            | Database['public']['Enums']['content_access_role']
            | null;
          image: string | null;
          metadata: Json | null;
        };
        Insert: {
          id: string;
          active?: boolean | null;
          name?: string | null;
          description?: string | null;
          access_role?:
            | Database['public']['Enums']['content_access_role']
            | null;
          image?: string | null;
          metadata?: Json | null;
        };
        Update: {
          id?: string;
          active?: boolean | null;
          name?: string | null;
          description?: string | null;
          access_role?:
            | Database['public']['Enums']['content_access_role']
            | null;
          image?: string | null;
          metadata?: Json | null;
        };
      };
      posts: {
        Row: {
          id: number;
          title: string;
          content: string;
          created_at: string | null;
          access_level:
            | Database['public']['Enums']['content_access_role']
            | null;
        };
        Insert: {
          id?: number;
          title: string;
          content: string;
          created_at?: string | null;
          access_level?:
            | Database['public']['Enums']['content_access_role']
            | null;
        };
        Update: {
          id?: number;
          title?: string;
          content?: string;
          created_at?: string | null;
          access_level?:
            | Database['public']['Enums']['content_access_role']
            | null;
        };
      };
      prices: {
        Row: {
          id: string;
          product_id: string | null;
          active: boolean | null;
          unit_amount: number | null;
          currency: string | null;
          type: Database['public']['Enums']['pricing_type'] | null;
          interval: Database['public']['Enums']['pricing_plan_interval'] | null;
          interval_count: number | null;
          trial_period_days: number | null;
          metadata: Json | null;
          description: string | null;
        };
        Insert: {
          id: string;
          product_id?: string | null;
          active?: boolean | null;
          unit_amount?: number | null;
          currency?: string | null;
          type?: Database['public']['Enums']['pricing_type'] | null;
          interval?:
            | Database['public']['Enums']['pricing_plan_interval']
            | null;
          interval_count?: number | null;
          trial_period_days?: number | null;
          metadata?: Json | null;
          description?: string | null;
        };
        Update: {
          id?: string;
          product_id?: string | null;
          active?: boolean | null;
          unit_amount?: number | null;
          currency?: string | null;
          type?: Database['public']['Enums']['pricing_type'] | null;
          interval?:
            | Database['public']['Enums']['pricing_plan_interval']
            | null;
          interval_count?: number | null;
          trial_period_days?: number | null;
          metadata?: Json | null;
          description?: string | null;
        };
      };
      subscriptions: {
        Row: {
          id: string;
          user_id: string;
          status: Database['public']['Enums']['subscription_status'] | null;
          metadata: Json | null;
          price_id: string | null;
          quantity: number | null;
          cancel_at_period_end: boolean | null;
          created: string;
          current_period_start: string;
          current_period_end: string;
          ended_at: string | null;
          cancel_at: string | null;
          canceled_at: string | null;
          trial_start: string | null;
          trial_end: string | null;
        };
        Insert: {
          id: string;
          user_id: string;
          status?: Database['public']['Enums']['subscription_status'] | null;
          metadata?: Json | null;
          price_id?: string | null;
          quantity?: number | null;
          cancel_at_period_end?: boolean | null;
          created?: string;
          current_period_start?: string;
          current_period_end?: string;
          ended_at?: string | null;
          cancel_at?: string | null;
          canceled_at?: string | null;
          trial_start?: string | null;
          trial_end?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          status?: Database['public']['Enums']['subscription_status'] | null;
          metadata?: Json | null;
          price_id?: string | null;
          quantity?: number | null;
          cancel_at_period_end?: boolean | null;
          created?: string;
          current_period_start?: string;
          current_period_end?: string;
          ended_at?: string | null;
          cancel_at?: string | null;
          canceled_at?: string | null;
          trial_start?: string | null;
          trial_end?: string | null;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      content_access_role: 'free' | 'basic' | 'premium';
      pricing_type: 'one_time' | 'recurring';
      pricing_plan_interval: 'day' | 'week' | 'month' | 'year';
      subscription_status:
        | 'trialing'
        | 'active'
        | 'canceled'
        | 'incomplete'
        | 'incomplete_expired'
        | 'past_due'
        | 'unpaid';
    };
  };
}
