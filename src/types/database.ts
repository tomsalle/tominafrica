/**
 * Types de la base Supabase.
 *
 * Ce fichier reflète le schéma défini dans supabase/migrations/. Il est
 * régénérable à tout moment après une modification de schéma :
 *
 *   npm run gen:types
 *
 * (voir scripts/generate-types.sh)
 */

export type OrderStatus =
  | 'pending'
  | 'paid'
  | 'in_production'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export type Database = {
  public: {
    Tables: {
      series: {
        Row: {
          id: string;
          slug: string;
          title: string;
          subtitle: string | null;
          description: string | null;
          location_label: string | null;
          cover_photo_id: string | null;
          position: number;
          published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          subtitle?: string | null;
          description?: string | null;
          location_label?: string | null;
          cover_photo_id?: string | null;
          position?: number;
          published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['series']['Insert']>;
        Relationships: [];
      };

      photos: {
        Row: {
          id: string;
          series_id: string | null;
          slug: string;
          title: string;
          caption: string | null;
          story: string | null;
          location_name: string | null;
          country_code: string | null;
          latitude: number | null;
          longitude: number | null;
          map_zoom: number;
          taken_at: string | null;
          image_path: string;
          image_width: number | null;
          image_height: number | null;
          blur_data_url: string | null;
          master_filename: string | null;
          is_black_and_white: boolean;
          position: number;
          published: boolean;
          featured: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          series_id?: string | null;
          slug: string;
          title: string;
          caption?: string | null;
          story?: string | null;
          location_name?: string | null;
          country_code?: string | null;
          latitude?: number | null;
          longitude?: number | null;
          map_zoom?: number;
          taken_at?: string | null;
          image_path: string;
          image_width?: number | null;
          image_height?: number | null;
          blur_data_url?: string | null;
          master_filename?: string | null;
          is_black_and_white?: boolean;
          position?: number;
          published?: boolean;
          featured?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['photos']['Insert']>;
        Relationships: [];
      };

      print_options: {
        Row: {
          id: string;
          photo_id: string;
          sku: string;
          label: string;
          width_cm: number;
          height_cm: number;
          paper: string | null;
          framed: boolean;
          price_cents: number;
          currency: string;
          edition_size: number | null;
          editions_sold: number;
          available: boolean;
          position: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          photo_id: string;
          sku: string;
          label: string;
          width_cm: number;
          height_cm: number;
          paper?: string | null;
          framed?: boolean;
          price_cents: number;
          currency?: string;
          edition_size?: number | null;
          editions_sold?: number;
          available?: boolean;
          position?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['print_options']['Insert']>;
        Relationships: [];
      };

      customers: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          phone: string | null;
          stripe_customer_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          full_name?: string | null;
          phone?: string | null;
          stripe_customer_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['customers']['Insert']>;
        Relationships: [];
      };

      orders: {
        Row: {
          id: string;
          order_number: string;
          customer_id: string | null;
          email: string;
          status: OrderStatus;
          stripe_checkout_session_id: string | null;
          stripe_payment_intent_id: string | null;
          subtotal_cents: number;
          shipping_cents: number;
          tax_cents: number;
          total_cents: number;
          currency: string;
          shipping_name: string | null;
          shipping_line1: string | null;
          shipping_line2: string | null;
          shipping_postal_code: string | null;
          shipping_city: string | null;
          shipping_country: string | null;
          carrier: string | null;
          tracking_number: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
          paid_at: string | null;
          shipped_at: string | null;
        };
        Insert: {
          id?: string;
          order_number?: string;
          customer_id?: string | null;
          email: string;
          status?: OrderStatus;
          stripe_checkout_session_id?: string | null;
          stripe_payment_intent_id?: string | null;
          subtotal_cents?: number;
          shipping_cents?: number;
          tax_cents?: number;
          total_cents?: number;
          currency?: string;
          shipping_name?: string | null;
          shipping_line1?: string | null;
          shipping_line2?: string | null;
          shipping_postal_code?: string | null;
          shipping_city?: string | null;
          shipping_country?: string | null;
          carrier?: string | null;
          tracking_number?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
          paid_at?: string | null;
          shipped_at?: string | null;
        };
        Update: Partial<Database['public']['Tables']['orders']['Insert']>;
        Relationships: [];
      };

      order_items: {
        Row: {
          id: string;
          order_id: string;
          print_option_id: string | null;
          photo_id: string | null;
          photo_title: string;
          photo_slug: string;
          option_label: string;
          option_sku: string;
          unit_price_cents: number;
          quantity: number;
          edition_number: number | null;
          total_cents: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          print_option_id?: string | null;
          photo_id?: string | null;
          photo_title: string;
          photo_slug: string;
          option_label: string;
          option_sku: string;
          unit_price_cents: number;
          quantity?: number;
          edition_number?: number | null;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['order_items']['Insert']>;
        Relationships: [];
      };
    };

    Views: Record<never, never>;

    Functions: {
      assign_edition_numbers: {
        Args: { p_order_id: string };
        Returns: undefined;
      };
      generate_order_number: {
        Args: Record<never, never>;
        Returns: string;
      };
    };

    Enums: {
      order_status: OrderStatus;
    };

    CompositeTypes: Record<never, never>;
  };
};

// ---------------------------------------------------------------------------
// Raccourcis utilisés dans toute l'application
// ---------------------------------------------------------------------------
type PublicTables = Database['public']['Tables'];

export type SeriesRow = PublicTables['series']['Row'];
export type PhotoRow = PublicTables['photos']['Row'];
export type PrintOptionRow = PublicTables['print_options']['Row'];
export type CustomerRow = PublicTables['customers']['Row'];
export type OrderRow = PublicTables['orders']['Row'];
export type OrderItemRow = PublicTables['order_items']['Row'];

export type PhotoInsert = PublicTables['photos']['Insert'];
export type OrderInsert = PublicTables['orders']['Insert'];
export type OrderItemInsert = PublicTables['order_items']['Insert'];

/** Une photo accompagnée de ses options de tirage (page produit). */
export type PhotoWithOptions = PhotoRow & {
  series: Pick<SeriesRow, 'id' | 'slug' | 'title'> | null;
  print_options: PrintOptionRow[];
};

/** Une série accompagnée de sa photo de couverture (accueil). */
export type SeriesWithCover = SeriesRow & {
  cover_photo: PhotoRow | null;
};
