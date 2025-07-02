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
      customers: {
        Row: {
          address: string | null
          created_at: string
          email: string | null
          gst_number: string | null
          id: string
          name: string
          notes: string | null
          phone: string
          user_id: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          email?: string | null
          gst_number?: string | null
          id?: string
          name: string
          notes?: string | null
          phone: string
          user_id: string
        }
        Update: {
          address?: string | null
          created_at?: string
          email?: string | null
          gst_number?: string | null
          id?: string
          name?: string
          notes?: string | null
          phone?: string
          user_id?: string
        }
        Relationships: []
      }
      invoice_items: {
        Row: {
          created_at: string
          discount: number
          hsn_code: string | null
          id: string
          invoice_id: string
          item_id: string
          item_type: string
          name: string
          quantity: number
          total: number
          unit_price: number
        }
        Insert: {
          created_at?: string
          discount?: number
          hsn_code?: string | null
          id?: string
          invoice_id: string
          item_id: string
          item_type: string
          name: string
          quantity?: number
          total?: number
          unit_price?: number
        }
        Update: {
          created_at?: string
          discount?: number
          hsn_code?: string | null
          id?: string
          invoice_id?: string
          item_id?: string
          item_type?: string
          name?: string
          quantity?: number
          total?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "invoice_items_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          created_at: string
          customer_id: string
          discount: number
          due_date: string | null
          id: string
          invoice_number: string
          invoice_type: string
          kilometers: number | null
          labor_charges: number
          notes: string | null
          paid_at: string | null
          status: string
          subtotal: number
          tax_amount: number
          tax_rate: number
          total: number
          user_id: string
          vehicle_id: string
        }
        Insert: {
          created_at?: string
          customer_id: string
          discount?: number
          due_date?: string | null
          id?: string
          invoice_number: string
          invoice_type: string
          kilometers?: number | null
          labor_charges?: number
          notes?: string | null
          paid_at?: string | null
          status?: string
          subtotal?: number
          tax_amount?: number
          tax_rate?: number
          total?: number
          user_id: string
          vehicle_id: string
        }
        Update: {
          created_at?: string
          customer_id?: string
          discount?: number
          due_date?: string | null
          id?: string
          invoice_number?: string
          invoice_type?: string
          kilometers?: number | null
          labor_charges?: number
          notes?: string | null
          paid_at?: string | null
          status?: string
          subtotal?: number
          tax_amount?: number
          tax_rate?: number
          total?: number
          user_id?: string
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoices_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      parts: {
        Row: {
          category: string
          created_at: string
          hsn_code: string | null
          id: string
          is_active: boolean
          min_stock_level: number
          name: string
          part_number: string | null
          price: number
          stock_quantity: number
          supplier: string | null
          user_id: string
        }
        Insert: {
          category: string
          created_at?: string
          hsn_code?: string | null
          id?: string
          is_active?: boolean
          min_stock_level?: number
          name: string
          part_number?: string | null
          price?: number
          stock_quantity?: number
          supplier?: string | null
          user_id: string
        }
        Update: {
          category?: string
          created_at?: string
          hsn_code?: string | null
          id?: string
          is_active?: boolean
          min_stock_level?: number
          name?: string
          part_number?: string | null
          price?: number
          stock_quantity?: number
          supplier?: string | null
          user_id?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          id: string
          invoice_id: string
          method: string
          paid_at: string
          refund_amount: number | null
          refund_reason: string | null
          status: string
          transaction_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          invoice_id: string
          method: string
          paid_at?: string
          refund_amount?: number | null
          refund_reason?: string | null
          status?: string
          transaction_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          invoice_id?: string
          method?: string
          paid_at?: string
          refund_amount?: number | null
          refund_reason?: string | null
          status?: string
          transaction_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          base_price: number
          category: string
          created_at: string
          description: string | null
          estimated_time: number
          hsn_code: string | null
          id: string
          is_active: boolean
          labor_charges: number
          name: string
          user_id: string
        }
        Insert: {
          base_price?: number
          category: string
          created_at?: string
          description?: string | null
          estimated_time?: number
          hsn_code?: string | null
          id?: string
          is_active?: boolean
          labor_charges?: number
          name: string
          user_id: string
        }
        Update: {
          base_price?: number
          category?: string
          created_at?: string
          description?: string | null
          estimated_time?: number
          hsn_code?: string | null
          id?: string
          is_active?: boolean
          labor_charges?: number
          name?: string
          user_id?: string
        }
        Relationships: []
      }
      vehicles: {
        Row: {
          chassis_number: string | null
          color: string | null
          created_at: string
          customer_id: string
          engine_number: string | null
          id: string
          make: string
          model: string
          user_id: string
          vehicle_number: string
          vehicle_type: string
          year: number | null
        }
        Insert: {
          chassis_number?: string | null
          color?: string | null
          created_at?: string
          customer_id: string
          engine_number?: string | null
          id?: string
          make: string
          model: string
          user_id: string
          vehicle_number: string
          vehicle_type: string
          year?: number | null
        }
        Update: {
          chassis_number?: string | null
          color?: string | null
          created_at?: string
          customer_id?: string
          engine_number?: string | null
          id?: string
          make?: string
          model?: string
          user_id?: string
          vehicle_number?: string
          vehicle_type?: string
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "vehicles_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
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
