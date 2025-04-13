import {
  BidCreate,
  BidUpdate,
  CheckHealthData,
  CreateBidData,
  CreateBidError,
  CreateMonitoringData,
  CreateMonitoringError,
  CreatePriceHistoryData,
  CreatePriceHistoryError,
  DeleteBidData,
  DeleteBidError,
  DeleteBidParams,
  DeleteMonitoringData,
  DeleteMonitoringError,
  DeleteMonitoringParams,
  FullInitializationData,
  GetBidData,
  GetBidError,
  GetBidParams,
  GetBidsData,
  GetBidsError,
  GetBidsParams,
  GetDbStatusData,
  GetLicitacaoData,
  GetLicitacaoError,
  GetLicitacaoParams,
  GetLicitacoesData,
  GetLicitacoesError,
  GetLicitacoesParams,
  GetMonitoringData,
  GetMonitoringError,
  GetMonitoringParams,
  GetMonitoringsData,
  GetMonitoringsError,
  GetPriceHistoryData,
  GetPriceHistoryError,
  GetPriceHistoryParams,
  GetPriceProjectionData,
  GetPriceProjectionError,
  GetPriceProjectionParams,
  GetPriceStatsData,
  GetPriceStatsError,
  GetPriceStatsParams,
  GetSimilarBidsData,
  GetSimilarBidsError,
  GetSimilarBidsParams,
  GetSupabaseConfigData,
  IndexBidsData,
  InitDatabase2Data,
  InitDatabaseData,
  LoadSampleDataData,
  MonitoringCreate,
  MonitoringUpdate,
  PriceHistoryCreate,
  SearchBidsData,
  SearchBidsError,
  SearchBidsParams,
  UpdateBidData,
  UpdateBidError,
  UpdateBidParams,
  UpdateMonitoringData,
  UpdateMonitoringError,
  UpdateMonitoringParams,
} from "./data-contracts";
import { ContentType, HttpClient, RequestParams } from "./http-client";

export class Brain<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * @description Check health of application. Returns 200 when OK, 500 when not.
   *
   * @name check_health
   * @summary Check Health
   * @request GET:/_healthz
   */
  check_health = (params: RequestParams = {}) =>
    this.request<CheckHealthData, any>({
      path: `/_healthz`,
      method: "GET",
      ...params,
    });

  /**
   * @description Get all monitoring configurations for the current user.
   *
   * @tags monitoring, dbtn/module:monitoring
   * @name get_monitorings
   * @summary Get Monitorings
   * @request GET:/routes/monitoring
   */
  get_monitorings = (params: RequestParams = {}) =>
    this.request<GetMonitoringsData, GetMonitoringsError>({
      path: `/routes/monitoring`,
      method: "GET",
      ...params,
    });

  /**
   * @description Create a new monitoring configuration for the current user.
   *
   * @tags monitoring, dbtn/module:monitoring
   * @name create_monitoring
   * @summary Create Monitoring
   * @request POST:/routes/monitoring
   */
  create_monitoring = (data: MonitoringCreate, params: RequestParams = {}) =>
    this.request<CreateMonitoringData, CreateMonitoringError>({
      path: `/routes/monitoring`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });

  /**
   * @description Get a specific monitoring configuration by its ID.
   *
   * @tags monitoring, dbtn/module:monitoring
   * @name get_monitoring
   * @summary Get Monitoring
   * @request GET:/routes/monitoring/{monitoring_id}
   */
  get_monitoring = ({ monitoringId, ...query }: GetMonitoringParams, params: RequestParams = {}) =>
    this.request<GetMonitoringData, GetMonitoringError>({
      path: `/routes/monitoring/${monitoringId}`,
      method: "GET",
      ...params,
    });

  /**
   * @description Update an existing monitoring configuration by its ID.
   *
   * @tags monitoring, dbtn/module:monitoring
   * @name update_monitoring
   * @summary Update Monitoring
   * @request PUT:/routes/monitoring/{monitoring_id}
   */
  update_monitoring = (
    { monitoringId, ...query }: UpdateMonitoringParams,
    data: MonitoringUpdate,
    params: RequestParams = {},
  ) =>
    this.request<UpdateMonitoringData, UpdateMonitoringError>({
      path: `/routes/monitoring/${monitoringId}`,
      method: "PUT",
      body: data,
      type: ContentType.Json,
      ...params,
    });

  /**
   * @description Delete a monitoring configuration by its ID.
   *
   * @tags monitoring, dbtn/module:monitoring
   * @name delete_monitoring
   * @summary Delete Monitoring
   * @request DELETE:/routes/monitoring/{monitoring_id}
   */
  delete_monitoring = ({ monitoringId, ...query }: DeleteMonitoringParams, params: RequestParams = {}) =>
    this.request<DeleteMonitoringData, DeleteMonitoringError>({
      path: `/routes/monitoring/${monitoringId}`,
      method: "DELETE",
      ...params,
    });

  /**
   * @description Get price history for a specific item code.
   *
   * @tags prices, dbtn/module:prices
   * @name get_price_history
   * @summary Get Price History
   * @request GET:/routes/prices/history/{codigo_item}
   */
  get_price_history = ({ codigoItem, ...query }: GetPriceHistoryParams, params: RequestParams = {}) =>
    this.request<GetPriceHistoryData, GetPriceHistoryError>({
      path: `/routes/prices/history/${codigoItem}`,
      method: "GET",
      query: query,
      ...params,
    });

  /**
   * @description Get price projection for a specific item code with context.
   *
   * @tags prices, dbtn/module:prices
   * @name get_price_projection
   * @summary Get Price Projection
   * @request GET:/routes/prices/projection/{codigo_item}
   */
  get_price_projection = ({ codigoItem, ...query }: GetPriceProjectionParams, params: RequestParams = {}) =>
    this.request<GetPriceProjectionData, GetPriceProjectionError>({
      path: `/routes/prices/projection/${codigoItem}`,
      method: "GET",
      query: query,
      ...params,
    });

  /**
   * @description Add a new price history entry.
   *
   * @tags prices, dbtn/module:prices
   * @name create_price_history
   * @summary Create Price History
   * @request POST:/routes/prices/history
   */
  create_price_history = (data: PriceHistoryCreate, params: RequestParams = {}) =>
    this.request<CreatePriceHistoryData, CreatePriceHistoryError>({
      path: `/routes/prices/history`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });

  /**
   * @description Get price statistics for a specific item code.
   *
   * @tags prices, dbtn/module:prices
   * @name get_price_stats
   * @summary Get Price Stats
   * @request GET:/routes/prices/stats/{codigo_item}
   */
  get_price_stats = ({ codigoItem, ...query }: GetPriceStatsParams, params: RequestParams = {}) =>
    this.request<GetPriceStatsData, GetPriceStatsError>({
      path: `/routes/prices/stats/${codigoItem}`,
      method: "GET",
      ...params,
    });

  /**
   * @description Index all bids in the database by creating vector embeddings. This should be run after database initialization and whenever new bids are added.
   *
   * @tags vector-search, dbtn/module:vector_search
   * @name index_bids
   * @summary Index Bids
   * @request POST:/routes/vector-search/index-bids
   */
  index_bids = (params: RequestParams = {}) =>
    this.request<IndexBidsData, any>({
      path: `/routes/vector-search/index-bids`,
      method: "POST",
      ...params,
    });

  /**
   * @description Search bids using semantic vector similarity.
   *
   * @tags vector-search, dbtn/module:vector_search
   * @name search_bids
   * @summary Search Bids
   * @request GET:/routes/vector-search/search
   */
  search_bids = (query: SearchBidsParams, params: RequestParams = {}) =>
    this.request<SearchBidsData, SearchBidsError>({
      path: `/routes/vector-search/search`,
      method: "GET",
      query: query,
      ...params,
    });

  /**
   * @description Get bids similar to a specific bid.
   *
   * @tags vector-search, dbtn/module:vector_search
   * @name get_similar_bids
   * @summary Get Similar Bids
   * @request GET:/routes/vector-search/similar-bids/{bid_id}
   */
  get_similar_bids = ({ bidId, ...query }: GetSimilarBidsParams, params: RequestParams = {}) =>
    this.request<GetSimilarBidsData, GetSimilarBidsError>({
      path: `/routes/vector-search/similar-bids/${bidId}`,
      method: "GET",
      query: query,
      ...params,
    });

  /**
   * @description Initialize the database with tables and sample data. This is typically used during setup or for testing.
   *
   * @tags bids, dbtn/module:bids
   * @name init_database2
   * @summary Init Database2
   * @request POST:/routes/bids/init
   */
  init_database2 = (params: RequestParams = {}) =>
    this.request<InitDatabase2Data, any>({
      path: `/routes/bids/init`,
      method: "POST",
      ...params,
    });

  /**
   * @description Get all bids with optional filtering by status, organization, or search term.
   *
   * @tags bids, dbtn/module:bids
   * @name get_bids
   * @summary Get Bids
   * @request GET:/routes/bids
   */
  get_bids = (query: GetBidsParams, params: RequestParams = {}) =>
    this.request<GetBidsData, GetBidsError>({
      path: `/routes/bids`,
      method: "GET",
      query: query,
      ...params,
    });

  /**
   * @description Create a new bid.
   *
   * @tags bids, dbtn/module:bids
   * @name create_bid
   * @summary Create Bid
   * @request POST:/routes/bids
   */
  create_bid = (data: BidCreate, params: RequestParams = {}) =>
    this.request<CreateBidData, CreateBidError>({
      path: `/routes/bids`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });

  /**
   * @description Get a specific bid by its ID.
   *
   * @tags bids, dbtn/module:bids
   * @name get_bid
   * @summary Get Bid
   * @request GET:/routes/bids/{bid_id}
   */
  get_bid = ({ bidId, ...query }: GetBidParams, params: RequestParams = {}) =>
    this.request<GetBidData, GetBidError>({
      path: `/routes/bids/${bidId}`,
      method: "GET",
      ...params,
    });

  /**
   * @description Update an existing bid by its ID.
   *
   * @tags bids, dbtn/module:bids
   * @name update_bid
   * @summary Update Bid
   * @request PUT:/routes/bids/{bid_id}
   */
  update_bid = ({ bidId, ...query }: UpdateBidParams, data: BidUpdate, params: RequestParams = {}) =>
    this.request<UpdateBidData, UpdateBidError>({
      path: `/routes/bids/${bidId}`,
      method: "PUT",
      body: data,
      type: ContentType.Json,
      ...params,
    });

  /**
   * @description Delete a bid by its ID.
   *
   * @tags bids, dbtn/module:bids
   * @name delete_bid
   * @summary Delete Bid
   * @request DELETE:/routes/bids/{bid_id}
   */
  delete_bid = ({ bidId, ...query }: DeleteBidParams, params: RequestParams = {}) =>
    this.request<DeleteBidData, DeleteBidError>({
      path: `/routes/bids/${bidId}`,
      method: "DELETE",
      ...params,
    });

  /**
   * @description Get the current status of the database.
   *
   * @tags db-management, dbtn/module:db_management
   * @name get_db_status
   * @summary Get Db Status
   * @request GET:/routes/db-management/status
   */
  get_db_status = (params: RequestParams = {}) =>
    this.request<GetDbStatusData, any>({
      path: `/routes/db-management/status`,
      method: "GET",
      ...params,
    });

  /**
   * @description Check database tables and report which ones exist and which are missing. This endpoint is safe to call multiple times.
   *
   * @tags db-management, dbtn/module:db_management
   * @name init_database
   * @summary Init Database
   * @request POST:/routes/db-management/init
   */
  init_database = (params: RequestParams = {}) =>
    this.request<InitDatabaseData, any>({
      path: `/routes/db-management/init`,
      method: "POST",
      ...params,
    });

  /**
   * @description Load sample data into the database. This endpoint is safe to call multiple times - it will not create duplicates.
   *
   * @tags db-management, dbtn/module:db_management
   * @name load_sample_data
   * @summary Load Sample Data
   * @request POST:/routes/db-management/sample-data
   */
  load_sample_data = (params: RequestParams = {}) =>
    this.request<LoadSampleDataData, any>({
      path: `/routes/db-management/sample-data`,
      method: "POST",
      ...params,
    });

  /**
   * @description Initialize the database schema and load sample data. This is a convenience endpoint that combines checking tables and loading sample data.
   *
   * @tags db-management, dbtn/module:db_management
   * @name full_initialization
   * @summary Full Initialization
   * @request POST:/routes/db-management/full-init
   */
  full_initialization = (params: RequestParams = {}) =>
    this.request<FullInitializationData, any>({
      path: `/routes/db-management/full-init`,
      method: "POST",
      ...params,
    });

  /**
   * @description Get all licitações (bids) with optional filtering by status, organization, or search term. This endpoint is a wrapper around the /bids endpoint to provide a more domain-specific API.
   *
   * @tags licitacoes, dbtn/module:licitacoes
   * @name get_licitacoes
   * @summary Get Licitacoes
   * @request GET:/routes/licitacoes
   */
  get_licitacoes = (query: GetLicitacoesParams, params: RequestParams = {}) =>
    this.request<GetLicitacoesData, GetLicitacoesError>({
      path: `/routes/licitacoes`,
      method: "GET",
      query: query,
      ...params,
    });

  /**
   * @description Get a specific licitação (bid) by its ID. This endpoint is a wrapper around the /bids/{bid_id} endpoint to provide a more domain-specific API.
   *
   * @tags licitacoes, dbtn/module:licitacoes
   * @name get_licitacao
   * @summary Get Licitacao
   * @request GET:/routes/licitacoes/{licitacao_id}
   */
  get_licitacao = ({ licitacaoId, ...query }: GetLicitacaoParams, params: RequestParams = {}) =>
    this.request<GetLicitacaoData, GetLicitacaoError>({
      path: `/routes/licitacoes/${licitacaoId}`,
      method: "GET",
      ...params,
    });

  /**
   * @description Get Supabase configuration for frontend authentication.
   *
   * @tags dbtn/module:supabase_helper
   * @name get_supabase_config
   * @summary Get Supabase Config
   * @request GET:/routes/supabase-config
   */
  get_supabase_config = (params: RequestParams = {}) =>
    this.request<GetSupabaseConfigData, any>({
      path: `/routes/supabase-config`,
      method: "GET",
      ...params,
    });
}
