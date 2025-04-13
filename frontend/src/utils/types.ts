// Define database table types

// Bid (Licitação) type
export interface Bid {
  id: number;
  title: string;
  description: string;
  orgao: string; // Government agency
  data_abertura: string; // Opening date
  data_encerramento: string; // Closing date
  valor_estimado: number | null; // Estimated value
  modalidade: string; // Bid type (pregão, concorrência, etc)
  status: 'aberta' | 'encerrada' | 'cancelada' | 'suspensa'; // Bid status
  numero_processo: string; // Process number
  objeto: string; // Long-form description of the bid
  link_edital: string; // Link to official documentation
  created_at: string;
  updated_at: string;
}

// Monitoring (Monitoramento) type
export interface Monitoring {
  id: number;
  user_id: string; // Supabase user ID
  keywords: string[]; // Keywords to monitor
  categorias: string[]; // Categories to monitor
  orgaos: string[]; // Government agencies to monitor
  valor_min: number | null; // Minimum value
  valor_max: number | null; // Maximum value
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Historical Pricing (Histórico de Preços) type
export interface PriceHistory {
  id: number;
  codigo_item: string; // Item code
  descricao_item: string; // Item description
  data_licitacao: string; // Date of the bid
  orgao: string; // Government agency
  valor_unitario: number; // Unit price
  quantidade: number; // Quantity
  vencedor: string; // Winner of the bid
  regiao: string; // Region
  uf: string; // State
  created_at: string;
}

// Price Projection type
export interface PriceProjection {
  codigo_item: string; // Item code
  preco_estimado: number; // Estimated price
  intervalo_min: number; // Minimum interval
  intervalo_max: number; // Maximum interval
  confianca: number; // Confidence level (0-1)
  contexto: string; // Context of the projection
  created_at: string;
}

// Bid Vector (for semantic search) type
export interface BidVector {
  id: number;
  bid_id: number;
  content: string;
  embedding: number[]; // Vector representation of the content
  created_at: string;
}

// Semantic Search Result type
export interface SemanticSearchResult {
  bid_id: number;
  content: string;
  similarity: number;
}

// Similar Bid Result type
export interface SimilarBidResult {
  bid_id: number;
  title: string;
  orgao: string;
  modalidade: string;
  status: string;
  similarity: number;
}

// Similar Bids Response type
export interface SimilarBidsResponse {
  bid: Bid;
  similar_bids: SimilarBidResult[];
}

// User Profile type to extend Supabase auth user
export interface UserProfile {
  id: string; // Same as auth.user.id
  email: string;
  full_name: string | null;
  company_name: string | null;
  cnpj: string | null; // Brazilian company ID
  phone: string | null;
  notification_email: boolean;
  plan: 'basic' | 'professional' | 'enterprise';
  created_at: string;
  updated_at: string;
}
