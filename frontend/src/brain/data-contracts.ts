/** BidCreate */
export interface BidCreate {
  /** Title */
  title: string;
  /** Description */
  description?: string;
  /** Orgao */
  orgao: string;
  /**
   * Data Abertura
   * @format date-time
   */
  data_abertura: string;
  /**
   * Data Encerramento
   * @format date-time
   */
  data_encerramento?: string;
  /** Valor Estimado */
  valor_estimado?: number;
  /** Modalidade */
  modalidade: string;
  /** Status */
  status: string;
  /** Numero Processo */
  numero_processo: string;
  /** Objeto */
  objeto?: string;
  /** Link Edital */
  link_edital?: string;
}

/** BidResponse */
export interface BidResponse {
  /** Title */
  title: string;
  /** Description */
  description?: string;
  /** Orgao */
  orgao: string;
  /**
   * Data Abertura
   * @format date-time
   */
  data_abertura: string;
  /**
   * Data Encerramento
   * @format date-time
   */
  data_encerramento?: string;
  /** Valor Estimado */
  valor_estimado?: number;
  /** Modalidade */
  modalidade: string;
  /** Status */
  status: string;
  /** Numero Processo */
  numero_processo: string;
  /** Objeto */
  objeto?: string;
  /** Link Edital */
  link_edital?: string;
  /** Id */
  id: number;
  /**
   * Created At
   * @format date-time
   */
  created_at: string;
  /**
   * Updated At
   * @format date-time
   */
  updated_at: string;
}

/** BidUpdate */
export interface BidUpdate {
  /** Title */
  title?: string;
  /** Description */
  description?: string;
  /** Orgao */
  orgao?: string;
  /**
   * Data Abertura
   * @format date-time
   */
  data_abertura?: string;
  /**
   * Data Encerramento
   * @format date-time
   */
  data_encerramento?: string;
  /** Valor Estimado */
  valor_estimado?: number;
  /** Modalidade */
  modalidade?: string;
  /** Status */
  status?: string;
  /** Numero Processo */
  numero_processo?: string;
  /** Objeto */
  objeto?: string;
  /** Link Edital */
  link_edital?: string;
}

/** BidVectorResponse */
export interface BidVectorResponse {
  /** Bid Id */
  bid_id: number;
  /** Content */
  content: string;
  /** Similarity */
  similarity: number;
}

/** DatabaseStatusResponse */
export interface DatabaseStatusResponse {
  /** Status */
  status: string;
  /** Message */
  message: string;
  /** Tables */
  tables: any[];
}

/** HTTPValidationError */
export interface HTTPValidationError {
  /** Detail */
  detail?: ValidationError[];
}

/** HealthResponse */
export interface HealthResponse {
  /** Status */
  status: string;
}

/** MonitoringCreate */
export interface MonitoringCreate {
  /** Keywords */
  keywords?: string[];
  /** Categorias */
  categorias?: string[];
  /** Orgaos */
  orgaos?: string[];
  /** Valor Min */
  valor_min?: number;
  /** Valor Max */
  valor_max?: number;
  /**
   * Is Active
   * @default true
   */
  is_active?: boolean;
}

/** MonitoringResponse */
export interface MonitoringResponse {
  /** Keywords */
  keywords?: string[];
  /** Categorias */
  categorias?: string[];
  /** Orgaos */
  orgaos?: string[];
  /** Valor Min */
  valor_min?: number;
  /** Valor Max */
  valor_max?: number;
  /**
   * Is Active
   * @default true
   */
  is_active?: boolean;
  /** Id */
  id: number;
  /** User Id */
  user_id: string;
  /**
   * Created At
   * @format date-time
   */
  created_at: string;
  /**
   * Updated At
   * @format date-time
   */
  updated_at: string;
}

/** MonitoringUpdate */
export interface MonitoringUpdate {
  /** Keywords */
  keywords?: string[];
  /** Categorias */
  categorias?: string[];
  /** Orgaos */
  orgaos?: string[];
  /** Valor Min */
  valor_min?: number;
  /** Valor Max */
  valor_max?: number;
  /** Is Active */
  is_active?: boolean;
}

/** PriceHistoryCreate */
export interface PriceHistoryCreate {
  /** Codigo Item */
  codigo_item: string;
  /** Descricao Item */
  descricao_item: string;
  /**
   * Data Licitacao
   * @format date-time
   */
  data_licitacao: string;
  /** Orgao */
  orgao: string;
  /** Valor Unitario */
  valor_unitario: number;
  /** Quantidade */
  quantidade: number;
  /** Vencedor */
  vencedor?: string;
  /** Regiao */
  regiao?: string;
  /** Uf */
  uf?: string;
}

/** PriceHistoryResponse */
export interface PriceHistoryResponse {
  /** Codigo Item */
  codigo_item: string;
  /** Descricao Item */
  descricao_item: string;
  /**
   * Data Licitacao
   * @format date-time
   */
  data_licitacao: string;
  /** Orgao */
  orgao: string;
  /** Valor Unitario */
  valor_unitario: number;
  /** Quantidade */
  quantidade: number;
  /** Vencedor */
  vencedor?: string;
  /** Regiao */
  regiao?: string;
  /** Uf */
  uf?: string;
  /** Id */
  id: number;
  /**
   * Created At
   * @format date-time
   */
  created_at: string;
}

/** PriceProjectionResponse */
export interface PriceProjectionResponse {
  /** Codigo Item */
  codigo_item: string;
  /** Preco Estimado */
  preco_estimado: number;
  /** Intervalo Min */
  intervalo_min: number;
  /** Intervalo Max */
  intervalo_max: number;
  /** Confianca */
  confianca: number;
  /** Contexto */
  contexto: string;
  /** Id */
  id: number;
  /**
   * Created At
   * @format date-time
   */
  created_at: string;
}

/** SearchResult */
export interface SearchResult {
  /** Results */
  results: BidVectorResponse[];
  /** Total */
  total: number;
}

/** SupabaseConfig */
export interface SupabaseConfig {
  /** Url */
  url: string;
  /** Anon Key */
  anon_key: string;
}

/** ValidationError */
export interface ValidationError {
  /** Location */
  loc: (string | number)[];
  /** Message */
  msg: string;
  /** Error Type */
  type: string;
}

export type CheckHealthData = HealthResponse;

/** Response Get Monitorings */
export type GetMonitoringsData = MonitoringResponse[];

export type GetMonitoringsError = HTTPValidationError;

export type CreateMonitoringData = MonitoringResponse;

export type CreateMonitoringError = HTTPValidationError;

export interface GetMonitoringParams {
  /** Monitoring Id */
  monitoringId: number;
}

export type GetMonitoringData = MonitoringResponse;

export type GetMonitoringError = HTTPValidationError;

export interface UpdateMonitoringParams {
  /** Monitoring Id */
  monitoringId: number;
}

export type UpdateMonitoringData = MonitoringResponse;

export type UpdateMonitoringError = HTTPValidationError;

export interface DeleteMonitoringParams {
  /** Monitoring Id */
  monitoringId: number;
}

export type DeleteMonitoringData = any;

export type DeleteMonitoringError = HTTPValidationError;

export interface GetPriceHistoryParams {
  /**
   * Limit
   * @min 1
   * @max 100
   * @default 20
   */
  limit?: number;
  /** Codigo Item */
  codigoItem: string;
}

/** Response Get Price History */
export type GetPriceHistoryData = PriceHistoryResponse[];

export type GetPriceHistoryError = HTTPValidationError;

export interface GetPriceProjectionParams {
  /**
   * Contexto
   * Context for the projection
   */
  contexto: string;
  /** Codigo Item */
  codigoItem: string;
}

export type GetPriceProjectionData = PriceProjectionResponse;

export type GetPriceProjectionError = HTTPValidationError;

export type CreatePriceHistoryData = PriceHistoryResponse;

export type CreatePriceHistoryError = HTTPValidationError;

export interface GetPriceStatsParams {
  /** Codigo Item */
  codigoItem: string;
}

export type GetPriceStatsData = any;

export type GetPriceStatsError = HTTPValidationError;

export type IndexBidsData = any;

export interface SearchBidsParams {
  /**
   * Query
   * @minLength 2
   */
  query: string;
  /**
   * Limit
   * @min 1
   * @max 50
   * @default 10
   */
  limit?: number;
  /**
   * Threshold
   * @min 0
   * @max 1
   * @default 0.6
   */
  threshold?: number;
}

export type SearchBidsData = SearchResult;

export type SearchBidsError = HTTPValidationError;

export interface GetSimilarBidsParams {
  /**
   * Limit
   * @min 1
   * @max 20
   * @default 5
   */
  limit?: number;
  /** Bid Id */
  bidId: number;
}

export type GetSimilarBidsData = any;

export type GetSimilarBidsError = HTTPValidationError;

/** Response Init Database2 */
export type InitDatabase2Data = object;

export interface GetBidsParams {
  /**
   * Limit
   * @min 1
   * @max 100
   * @default 50
   */
  limit?: number;
  /** Status */
  status?: string;
  /** Orgao */
  orgao?: string;
  /** Search */
  search?: string;
}

/** Response Get Bids */
export type GetBidsData = BidResponse[];

export type GetBidsError = HTTPValidationError;

export type CreateBidData = BidResponse;

export type CreateBidError = HTTPValidationError;

export interface GetBidParams {
  /** Bid Id */
  bidId: number;
}

export type GetBidData = BidResponse;

export type GetBidError = HTTPValidationError;

export interface UpdateBidParams {
  /** Bid Id */
  bidId: number;
}

export type UpdateBidData = BidResponse;

export type UpdateBidError = HTTPValidationError;

export interface DeleteBidParams {
  /** Bid Id */
  bidId: number;
}

export type DeleteBidData = any;

export type DeleteBidError = HTTPValidationError;

export type GetDbStatusData = DatabaseStatusResponse;

export type InitDatabaseData = any;

export type LoadSampleDataData = any;

export type FullInitializationData = any;

export interface GetLicitacoesParams {
  /**
   * Limit
   * @min 1
   * @max 100
   * @default 50
   */
  limit?: number;
  /** Status */
  status?: string;
  /** Orgao */
  orgao?: string;
  /** Search */
  search?: string;
}

/** Response Get Licitacoes */
export type GetLicitacoesData = BidResponse[];

export type GetLicitacoesError = HTTPValidationError;

export interface GetLicitacaoParams {
  /** Licitacao Id */
  licitacaoId: number;
}

export type GetLicitacaoData = BidResponse;

export type GetLicitacaoError = HTTPValidationError;

export type GetSupabaseConfigData = SupabaseConfig;
