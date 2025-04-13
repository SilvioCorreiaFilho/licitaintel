import { createClient, SupabaseClient } from '@supabase/supabase-js';
import brain from '../brain';

// Use a variable to track initialization state
let isInitializing = false;
let initializationCompleted = false;

// Initial default values for Supabase configuration
let supabaseUrl = 'https://nwuduzhrrhmjlwigabex.supabase.co';
let supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im53dWR1emhycmhtamx3aWdhYmV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQzMDk5OTksImV4cCI6MjA1OTg4NTk5OX0.mpgy-WI8z3GkI5tXwAB5UGICGiWzkuEUsWc4Dygf8cA';

// Create a reference that will hold our client instance
// We'll replace this with a properly configured client after initialization
let _supabaseClientInstance = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    debug: true, // Enable debug logging
  },
});

// Export a proxy object that will delegate to the current client instance
// This allows us to completely replace the client without breaking references
export const supabase = new Proxy({} as SupabaseClient, {
  get: (_, prop) => {
    return _supabaseClientInstance[prop as keyof SupabaseClient];
  },
});

/**
 * Initialize Supabase client with proper credentials from backend
 * This function fetches credentials from our secure API endpoint
 */
export async function initializeSupabase() {
  // Prevent multiple initialization attempts (if already completed or in progress)
  if (initializationCompleted || isInitializing) {
    console.log(
      `Supabase initialization ${initializationCompleted ? 'already completed' : 'in progress'}, skipping...`,
    );
    return;
  }
  
  isInitializing = true;
  console.group('🔐 Supabase Initialization');
  console.log('Initializing Supabase client...');
  
  try {
    // Log initial values for debugging
    console.log('Initial configuration:');
    console.log('- URL:', supabaseUrl);
    console.log('- Anon Key format:', supabaseAnonKey.startsWith('ey') ? 'Valid JWT format' : 'Invalid format');
    
    console.log('Fetching Supabase config from secure API endpoint...');
    const response = await brain.get_supabase_config();
    console.log('Received API response status:', response.status);
    
    if (!response.ok) {
      console.error('Failed to fetch Supabase config:', await response.text());
      throw new Error(`Failed to fetch Supabase config: ${response.status} ${response.statusText}`);
    }
    
    // Extract the actual data from the response
    const config = await response.json();
    console.log('Parsed Supabase config:', config);

    if (!config || !config.url || !config.anon_key) {
      console.error('Invalid Supabase configuration received:', config);
      throw new Error('Invalid Supabase configuration');
    }

    // Update our configuration values
    supabaseUrl = config.url;
    supabaseAnonKey = config.anon_key;
    console.log('Updated configuration:');
    console.log('- URL:', supabaseUrl);
    console.log('- Anon Key format:', supabaseAnonKey.startsWith('ey') ? 'Valid JWT format' : 'Invalid format');

    // Completely recreate the client with the new credentials
    const newClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        debug: true,
      },
    });
    
    // Replace the client instance completely (our proxy will redirect to this new instance)
    _supabaseClientInstance = newClient;
    console.log('✅ Supabase client completely recreated with new credentials');
    
    // Set up auth state listeners on the new client
    setupAuthListeners();
    
    initializationCompleted = true;
  } catch (error) {
    console.error('Error initializing Supabase:', error);
  } finally {
    isInitializing = false;
    console.groupEnd();
  }
}

// Handle authentication state changes
function setupAuthListeners() {
  // Set up the auth state listener on the current client instance
  _supabaseClientInstance.auth.onAuthStateChange((event, session) => {
    console.log(`🔐 Auth state changed: ${event}`, session ? `User: ${session.user?.email}` : 'No session');
  });
}

// Set up MCP for authentication state management
export const setupAuthMCP = () => {
  if (typeof window !== 'undefined') {
    // Only run in browser environment
    window.__mcpSupabaseAuth = {
      getCurrentUser: async () => {
        const { data } = await _supabaseClientInstance.auth.getUser();
        return data.user;
      },
      getSession: async () => {
        const { data } = await _supabaseClientInstance.auth.getSession();
        return data.session;
      },
    };
  }
};

// Start initialization explicitly from AppProvider, not automatically
// initializeSupabase();

// Set up MCP
setupAuthMCP();

// For testing - expose a way to force reinitialization
export const reinitializeSupabase = initializeSupabase;
