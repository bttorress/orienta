export type TransactionType = 'income' | 'expense';

export type Database = {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          type: TransactionType;
          color: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string;
          name: string;
          type: TransactionType;
          color?: string;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['categories']['Insert']>;
        Relationships: [];
      };
      transactions: {
        Row: {
          id: string;
          user_id: string;
          category_id: string | null;
          description: string;
          amount: number;
          type: TransactionType;
          transaction_date: string;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string;
          category_id?: string | null;
          description: string;
          amount: number;
          type: TransactionType;
          transaction_date: string;
          notes?: string | null;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['transactions']['Insert']>;
        Relationships: [
          {
            foreignKeyName: 'transactions_category_id_fkey';
            columns: ['category_id'];
            isOneToOne: false;
            referencedRelation: 'categories';
            referencedColumns: ['id'];
          },
        ];
      };
      goals: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          target_amount: number;
          current_amount: number;
          due_date: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string;
          name: string;
          target_amount: number;
          current_amount?: number;
          due_date?: string | null;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['goals']['Insert']>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      transaction_type: TransactionType;
    };
    CompositeTypes: Record<string, never>;
  };
};

export type Category = Database['public']['Tables']['categories']['Row'];
export type Transaction = Database['public']['Tables']['transactions']['Row'] & {
  categories?: Pick<Category, 'name' | 'color'> | null;
};
export type Goal = Database['public']['Tables']['goals']['Row'];
