import { supabase } from "./supabase";
import { Bid, Monitoring, PriceHistory, PriceProjection, UserProfile } from "./types";

// Bid operations
export const bidService = {
  /**
   * Fetch all bids with optional filtering
   */
  getBids: async (options?: {
    limit?: number;
    status?: string;
    orgao?: string;
    searchQuery?: string;
  }) => {
    let query = supabase.from("bids").select("*");

    if (options?.status) {
      query = query.eq("status", options.status);
    }

    if (options?.orgao) {
      query = query.eq("orgao", options.orgao);
    }

    if (options?.searchQuery) {
      query = query.or(
        `title.ilike.%${options.searchQuery}%,objeto.ilike.%${options.searchQuery}%`
      );
    }

    if (options?.limit) {
      query = query.limit(options.limit);
    }

    const { data, error } = await query.order("data_abertura", { ascending: false });

    if (error) {
      console.error("Error fetching bids:", error);
      throw error;
    }

    return data as Bid[];
  },

  /**
   * Fetch a single bid by ID
   */
  getBidById: async (id: number) => {
    const { data, error } = await supabase.from("bids").select("*").eq("id", id).single();

    if (error) {
      console.error(`Error fetching bid with ID ${id}:`, error);
      throw error;
    }

    return data as Bid;
  },

  /**
   * Create a new bid
   */
  createBid: async (bid: Omit<Bid, "id" | "created_at" | "updated_at">) => {
    const { data, error } = await supabase.from("bids").insert(bid).select();

    if (error) {
      console.error("Error creating bid:", error);
      throw error;
    }

    return data[0] as Bid;
  },

  /**
   * Update an existing bid
   */
  updateBid: async (id: number, bid: Partial<Bid>) => {
    const { data, error } = await supabase
      .from("bids")
      .update({ ...bid, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select();

    if (error) {
      console.error(`Error updating bid with ID ${id}:`, error);
      throw error;
    }

    return data[0] as Bid;
  },

  /**
   * Delete a bid
   */
  deleteBid: async (id: number) => {
    const { error } = await supabase.from("bids").delete().eq("id", id);

    if (error) {
      console.error(`Error deleting bid with ID ${id}:`, error);
      throw error;
    }

    return true;
  },

  /**
   * Search bids semantically using vector similarity
   */
  searchBidsSemantic: async (query: string, limit: number = 10) => {
    try {
      // Call the vector search API
      const response = await fetch(`/vector-search/search?query=${encodeURIComponent(query)}&limit=${limit}`);
      
      if (!response.ok) {
        throw new Error(`Error searching bids: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data.results || [];
    } catch (error) {
      console.error("Error searching bids semantically:", error);
      throw error;
    }
  },

  /**
   * Get bids similar to a specific bid
   */
  getSimilarBids: async (bidId: number, limit: number = 5) => {
    try {
      // Call the similar bids API
      const response = await fetch(`/vector-search/similar-bids/${bidId}?limit=${limit}`);
      
      if (!response.ok) {
        throw new Error(`Error fetching similar bids: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error getting similar bids for ID ${bidId}:`, error);
      throw error;
    }
  },
};

// Monitoring operations
export const monitoringService = {
  /**
   * Fetch all monitorings for the current user
   */
  getMonitorings: async () => {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      throw new Error("User not authenticated");
    }

    const { data, error } = await supabase
      .from("monitorings")
      .select("*")
      .eq("user_id", user.user.id);

    if (error) {
      console.error("Error fetching monitorings:", error);
      throw error;
    }

    return data as Monitoring[];
  },

  /**
   * Create a new monitoring
   */
  createMonitoring: async (monitoring: Omit<Monitoring, "id" | "user_id" | "created_at" | "updated_at">) => {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      throw new Error("User not authenticated");
    }

    const { data, error } = await supabase
      .from("monitorings")
      .insert({
        ...monitoring,
        user_id: user.user.id,
      })
      .select();

    if (error) {
      console.error("Error creating monitoring:", error);
      throw error;
    }

    return data[0] as Monitoring;
  },

  /**
   * Update an existing monitoring
   */
  updateMonitoring: async (id: number, monitoring: Partial<Monitoring>) => {
    const { data, error } = await supabase
      .from("monitorings")
      .update({ ...monitoring, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select();

    if (error) {
      console.error(`Error updating monitoring with ID ${id}:`, error);
      throw error;
    }

    return data[0] as Monitoring;
  },

  /**
   * Delete a monitoring
   */
  deleteMonitoring: async (id: number) => {
    const { error } = await supabase.from("monitorings").delete().eq("id", id);

    if (error) {
      console.error(`Error deleting monitoring with ID ${id}:`, error);
      throw error;
    }

    return true;
  },
};

// Price history operations
export const priceHistoryService = {
  /**
   * Fetch price history for a specific item code
   */
  getPriceHistory: async (codigoItem: string) => {
    const { data, error } = await supabase
      .from("price_history")
      .select("*")
      .eq("codigo_item", codigoItem)
      .order("data_licitacao", { ascending: false });

    if (error) {
      console.error(`Error fetching price history for item ${codigoItem}:`, error);
      throw error;
    }

    return data as PriceHistory[];
  },

  /**
   * Get price projection for an item
   */
  getPriceProjection: async (codigoItem: string, contexto: string) => {
    const { data, error } = await supabase
      .from("price_projections")
      .select("*")
      .eq("codigo_item", codigoItem)
      .eq("contexto", contexto)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        // No rows returned - need to calculate projection
        // For this example, we'll just return a mock projection
        // In a real app, you would call an API endpoint that calculates this
        return {
          codigo_item: codigoItem,
          preco_estimado: 45000,
          intervalo_min: 42000,
          intervalo_max: 48000,
          confianca: 0.85,
          contexto: contexto,
          created_at: new Date().toISOString(),
        } as PriceProjection;
      }
      
      console.error(`Error fetching price projection for item ${codigoItem}:`, error);
      throw error;
    }

    return data as PriceProjection;
  },
};

// User profile operations
export const profileService = {
  /**
   * Get the current user's profile
   */
  getProfile: async () => {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      throw new Error("User not authenticated");
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.user.id)
      .single();

    if (error) {
      console.error("Error fetching user profile:", error);
      throw error;
    }

    return data as UserProfile;
  },

  /**
   * Update the current user's profile
   */
  updateProfile: async (profile: Partial<UserProfile>) => {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      throw new Error("User not authenticated");
    }

    const { data, error } = await supabase
      .from("profiles")
      .update({ ...profile, updated_at: new Date().toISOString() })
      .eq("id", user.user.id)
      .select();

    if (error) {
      console.error("Error updating user profile:", error);
      throw error;
    }

    return data[0] as UserProfile;
  },
};
