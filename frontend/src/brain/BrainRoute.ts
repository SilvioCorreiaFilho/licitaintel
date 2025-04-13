import {
  BidCreate,
  BidUpdate,
  CheckHealthData,
  CreateBidData,
  CreateMonitoringData,
  CreatePriceHistoryData,
  DeleteBidData,
  DeleteMonitoringData,
  FullInitializationData,
  GetBidData,
  GetBidsData,
  GetDbStatusData,
  GetLicitacaoData,
  GetLicitacoesData,
  GetMonitoringData,
  GetMonitoringsData,
  GetPriceHistoryData,
  GetPriceProjectionData,
  GetPriceStatsData,
  GetSimilarBidsData,
  GetSupabaseConfigData,
  IndexBidsData,
  InitDatabase2Data,
  InitDatabaseData,
  LoadSampleDataData,
  MonitoringCreate,
  MonitoringUpdate,
  PriceHistoryCreate,
  SearchBidsData,
  UpdateBidData,
  UpdateMonitoringData,
} from "./data-contracts";

export namespace Brain {
  /**
   * @description Check health of application. Returns 200 when OK, 500 when not.
   * @name check_health
   * @summary Check Health
   * @request GET:/_healthz
   */
  export namespace check_health {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = CheckHealthData;
  }

  /**
   * @description Get all monitoring configurations for the current user.
   * @tags monitoring, dbtn/module:monitoring
   * @name get_monitorings
   * @summary Get Monitorings
   * @request GET:/routes/monitoring
   */
  export namespace get_monitorings {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {
      /** Authorization */
      authorization: string;
    };
    export type ResponseBody = GetMonitoringsData;
  }

  /**
   * @description Create a new monitoring configuration for the current user.
   * @tags monitoring, dbtn/module:monitoring
   * @name create_monitoring
   * @summary Create Monitoring
   * @request POST:/routes/monitoring
   */
  export namespace create_monitoring {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = MonitoringCreate;
    export type RequestHeaders = {
      /** Authorization */
      authorization: string;
    };
    export type ResponseBody = CreateMonitoringData;
  }

  /**
   * @description Get a specific monitoring configuration by its ID.
   * @tags monitoring, dbtn/module:monitoring
   * @name get_monitoring
   * @summary Get Monitoring
   * @request GET:/routes/monitoring/{monitoring_id}
   */
  export namespace get_monitoring {
    export type RequestParams = {
      /** Monitoring Id */
      monitoringId: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {
      /** Authorization */
      authorization: string;
    };
    export type ResponseBody = GetMonitoringData;
  }

  /**
   * @description Update an existing monitoring configuration by its ID.
   * @tags monitoring, dbtn/module:monitoring
   * @name update_monitoring
   * @summary Update Monitoring
   * @request PUT:/routes/monitoring/{monitoring_id}
   */
  export namespace update_monitoring {
    export type RequestParams = {
      /** Monitoring Id */
      monitoringId: number;
    };
    export type RequestQuery = {};
    export type RequestBody = MonitoringUpdate;
    export type RequestHeaders = {
      /** Authorization */
      authorization: string;
    };
    export type ResponseBody = UpdateMonitoringData;
  }

  /**
   * @description Delete a monitoring configuration by its ID.
   * @tags monitoring, dbtn/module:monitoring
   * @name delete_monitoring
   * @summary Delete Monitoring
   * @request DELETE:/routes/monitoring/{monitoring_id}
   */
  export namespace delete_monitoring {
    export type RequestParams = {
      /** Monitoring Id */
      monitoringId: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {
      /** Authorization */
      authorization: string;
    };
    export type ResponseBody = DeleteMonitoringData;
  }

  /**
   * @description Get price history for a specific item code.
   * @tags prices, dbtn/module:prices
   * @name get_price_history
   * @summary Get Price History
   * @request GET:/routes/prices/history/{codigo_item}
   */
  export namespace get_price_history {
    export type RequestParams = {
      /** Codigo Item */
      codigoItem: string;
    };
    export type RequestQuery = {
      /**
       * Limit
       * @min 1
       * @max 100
       * @default 20
       */
      limit?: number;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetPriceHistoryData;
  }

  /**
   * @description Get price projection for a specific item code with context.
   * @tags prices, dbtn/module:prices
   * @name get_price_projection
   * @summary Get Price Projection
   * @request GET:/routes/prices/projection/{codigo_item}
   */
  export namespace get_price_projection {
    export type RequestParams = {
      /** Codigo Item */
      codigoItem: string;
    };
    export type RequestQuery = {
      /**
       * Contexto
       * Context for the projection
       */
      contexto: string;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetPriceProjectionData;
  }

  /**
   * @description Add a new price history entry.
   * @tags prices, dbtn/module:prices
   * @name create_price_history
   * @summary Create Price History
   * @request POST:/routes/prices/history
   */
  export namespace create_price_history {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PriceHistoryCreate;
    export type RequestHeaders = {};
    export type ResponseBody = CreatePriceHistoryData;
  }

  /**
   * @description Get price statistics for a specific item code.
   * @tags prices, dbtn/module:prices
   * @name get_price_stats
   * @summary Get Price Stats
   * @request GET:/routes/prices/stats/{codigo_item}
   */
  export namespace get_price_stats {
    export type RequestParams = {
      /** Codigo Item */
      codigoItem: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetPriceStatsData;
  }

  /**
   * @description Index all bids in the database by creating vector embeddings. This should be run after database initialization and whenever new bids are added.
   * @tags vector-search, dbtn/module:vector_search
   * @name index_bids
   * @summary Index Bids
   * @request POST:/routes/vector-search/index-bids
   */
  export namespace index_bids {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = IndexBidsData;
  }

  /**
   * @description Search bids using semantic vector similarity.
   * @tags vector-search, dbtn/module:vector_search
   * @name search_bids
   * @summary Search Bids
   * @request GET:/routes/vector-search/search
   */
  export namespace search_bids {
    export type RequestParams = {};
    export type RequestQuery = {
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
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = SearchBidsData;
  }

  /**
   * @description Get bids similar to a specific bid.
   * @tags vector-search, dbtn/module:vector_search
   * @name get_similar_bids
   * @summary Get Similar Bids
   * @request GET:/routes/vector-search/similar-bids/{bid_id}
   */
  export namespace get_similar_bids {
    export type RequestParams = {
      /** Bid Id */
      bidId: number;
    };
    export type RequestQuery = {
      /**
       * Limit
       * @min 1
       * @max 20
       * @default 5
       */
      limit?: number;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetSimilarBidsData;
  }

  /**
   * @description Initialize the database with tables and sample data. This is typically used during setup or for testing.
   * @tags bids, dbtn/module:bids
   * @name init_database2
   * @summary Init Database2
   * @request POST:/routes/bids/init
   */
  export namespace init_database2 {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = InitDatabase2Data;
  }

  /**
   * @description Get all bids with optional filtering by status, organization, or search term.
   * @tags bids, dbtn/module:bids
   * @name get_bids
   * @summary Get Bids
   * @request GET:/routes/bids
   */
  export namespace get_bids {
    export type RequestParams = {};
    export type RequestQuery = {
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
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetBidsData;
  }

  /**
   * @description Create a new bid.
   * @tags bids, dbtn/module:bids
   * @name create_bid
   * @summary Create Bid
   * @request POST:/routes/bids
   */
  export namespace create_bid {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = BidCreate;
    export type RequestHeaders = {};
    export type ResponseBody = CreateBidData;
  }

  /**
   * @description Get a specific bid by its ID.
   * @tags bids, dbtn/module:bids
   * @name get_bid
   * @summary Get Bid
   * @request GET:/routes/bids/{bid_id}
   */
  export namespace get_bid {
    export type RequestParams = {
      /** Bid Id */
      bidId: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetBidData;
  }

  /**
   * @description Update an existing bid by its ID.
   * @tags bids, dbtn/module:bids
   * @name update_bid
   * @summary Update Bid
   * @request PUT:/routes/bids/{bid_id}
   */
  export namespace update_bid {
    export type RequestParams = {
      /** Bid Id */
      bidId: number;
    };
    export type RequestQuery = {};
    export type RequestBody = BidUpdate;
    export type RequestHeaders = {};
    export type ResponseBody = UpdateBidData;
  }

  /**
   * @description Delete a bid by its ID.
   * @tags bids, dbtn/module:bids
   * @name delete_bid
   * @summary Delete Bid
   * @request DELETE:/routes/bids/{bid_id}
   */
  export namespace delete_bid {
    export type RequestParams = {
      /** Bid Id */
      bidId: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = DeleteBidData;
  }

  /**
   * @description Get the current status of the database.
   * @tags db-management, dbtn/module:db_management
   * @name get_db_status
   * @summary Get Db Status
   * @request GET:/routes/db-management/status
   */
  export namespace get_db_status {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetDbStatusData;
  }

  /**
   * @description Check database tables and report which ones exist and which are missing. This endpoint is safe to call multiple times.
   * @tags db-management, dbtn/module:db_management
   * @name init_database
   * @summary Init Database
   * @request POST:/routes/db-management/init
   */
  export namespace init_database {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = InitDatabaseData;
  }

  /**
   * @description Load sample data into the database. This endpoint is safe to call multiple times - it will not create duplicates.
   * @tags db-management, dbtn/module:db_management
   * @name load_sample_data
   * @summary Load Sample Data
   * @request POST:/routes/db-management/sample-data
   */
  export namespace load_sample_data {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = LoadSampleDataData;
  }

  /**
   * @description Initialize the database schema and load sample data. This is a convenience endpoint that combines checking tables and loading sample data.
   * @tags db-management, dbtn/module:db_management
   * @name full_initialization
   * @summary Full Initialization
   * @request POST:/routes/db-management/full-init
   */
  export namespace full_initialization {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = FullInitializationData;
  }

  /**
   * @description Get all licitações (bids) with optional filtering by status, organization, or search term. This endpoint is a wrapper around the /bids endpoint to provide a more domain-specific API.
   * @tags licitacoes, dbtn/module:licitacoes
   * @name get_licitacoes
   * @summary Get Licitacoes
   * @request GET:/routes/licitacoes
   */
  export namespace get_licitacoes {
    export type RequestParams = {};
    export type RequestQuery = {
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
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetLicitacoesData;
  }

  /**
   * @description Get a specific licitação (bid) by its ID. This endpoint is a wrapper around the /bids/{bid_id} endpoint to provide a more domain-specific API.
   * @tags licitacoes, dbtn/module:licitacoes
   * @name get_licitacao
   * @summary Get Licitacao
   * @request GET:/routes/licitacoes/{licitacao_id}
   */
  export namespace get_licitacao {
    export type RequestParams = {
      /** Licitacao Id */
      licitacaoId: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetLicitacaoData;
  }

  /**
   * @description Get Supabase configuration for frontend authentication.
   * @tags dbtn/module:supabase_helper
   * @name get_supabase_config
   * @summary Get Supabase Config
   * @request GET:/routes/supabase-config
   */
  export namespace get_supabase_config {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetSupabaseConfigData;
  }
}
