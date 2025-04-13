import { create } from 'zustand';
import { Bid } from './types';
import { bidService } from './databaseService';

interface BidsState {
  // Data state
  bids: Bid[];
  currentBid: Bid | null;
  semanticResults: Array<{ bid_id: number; content: string; similarity: number }>
  similarBids: Array<{ bid_id: number; title: string; similarity: number }>
  isLoading: boolean;
  error: Error | null;
  // Filter state
  filterStatus: string | null;
  filterOrgao: string | null;
  searchQuery: string | null;
  // Actions
  fetchBids: (options?: { limit?: number }) => Promise<void>;
  fetchBidById: (id: number) => Promise<void>;
  searchBids: (query: string) => Promise<void>;
  searchBidsSemantic: (query: string, limit?: number) => Promise<void>;
  getSimilarBids: (bidId: number, limit?: number) => Promise<void>;
  filterByStatus: (status: string | null) => Promise<void>;
  filterByOrgao: (orgao: string | null) => Promise<void>;
  resetFilters: () => Promise<void>;
}

export const useBidsStore = create<BidsState>((set, get) => ({
  // Initial state
  bids: [],
  currentBid: null,
  semanticResults: [],
  similarBids: [],
  isLoading: false,
  error: null,
  filterStatus: null,
  filterOrgao: null,
  searchQuery: null,

  // Fetch all bids with current filters
  fetchBids: async (options = {}) => {
    set({ isLoading: true, error: null });
    try {
      const { filterStatus, filterOrgao, searchQuery } = get();
      const bids = await bidService.getBids({
        ...options,
        status: filterStatus || undefined,
        orgao: filterOrgao || undefined,
        searchQuery: searchQuery || undefined,
      });
      set({ bids, isLoading: false });
    } catch (error) {
      set({ error: error as Error, isLoading: false });
    }
  },

  // Fetch a specific bid by ID
  fetchBidById: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      const bid = await bidService.getBidById(id);
      set({ currentBid: bid, isLoading: false });
    } catch (error) {
      set({ error: error as Error, isLoading: false });
    }
  },

  // Search bids by query
  searchBids: async (query: string) => {
    set({ searchQuery: query });
    await get().fetchBids();
  },
  
  // Search bids semantically
  searchBidsSemantic: async (query: string, limit = 10) => {
    set({ isLoading: true, error: null });
    try {
      const results = await bidService.searchBidsSemantic(query, limit);
      set({ semanticResults: results, isLoading: false });
      return results;
    } catch (error) {
      set({ error: error as Error, isLoading: false });
      return [];
    }
  },
  
  // Get similar bids to a specific bid
  getSimilarBids: async (bidId: number, limit = 5) => {
    set({ isLoading: true, error: null });
    try {
      const result = await bidService.getSimilarBids(bidId, limit);
      set({ similarBids: result.similar_bids, isLoading: false });
      return result.similar_bids;
    } catch (error) {
      set({ error: error as Error, isLoading: false });
      return [];
    }
  },

  // Filter bids by status
  filterByStatus: async (status: string | null) => {
    set({ filterStatus: status });
    await get().fetchBids();
  },

  // Filter bids by government agency
  filterByOrgao: async (orgao: string | null) => {
    set({ filterOrgao: orgao });
    await get().fetchBids();
  },

  // Reset all filters
  resetFilters: async () => {
    set({
      filterStatus: null,
      filterOrgao: null,
      searchQuery: null,
    });
    await get().fetchBids();
  },
}));
