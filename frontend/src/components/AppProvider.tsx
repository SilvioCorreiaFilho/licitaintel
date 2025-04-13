import { useEffect, useState } from "react"; // Added useState
import { Outlet } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "components/ThemeProvider";
import { useAuthStore } from "../utils/authStore";
import { initializeSupabase, supabase } from "../utils/supabase";
import { Skeleton } from "@/components/ui/skeleton"; // Import Skeleton

export function AppProvider() {
  // Get the initialize function from the store
  const { initialize } = useAuthStore((state) => ({ initialize: state.initialize }));
  const [isAuthResolved, setIsAuthResolved] = useState(false); // Local state for initial auth check

  useEffect(() => {
    const setup = async () => {
      console.log("AppProvider: Starting setup...");

      // IMPORTANT: Ensure Supabase client is ready BEFORE initializing store or listener
      try {
        await initializeSupabase(); // Ensure Supabase is ready
        console.log("AppProvider: Supabase client initialization confirmed.");
      } catch (error) {
        console.error("AppProvider: Critical error during Supabase initialization:", error);
        setIsAuthResolved(true); // Mark as resolved to potentially show an error state downstream
        return; // Stop if Supabase failed
      }

      // 1. Initialize auth store state synchronously (sets store's isLoading=true)
      try {
        initialize();
        console.log("AppProvider: Auth store sync initialization triggered.");
      } catch (error) {
        console.error("AppProvider: Error during Auth store sync initialization:", error);
      }

      // 2. Setup the auth state change listener *after* Supabase is ready
      console.log("AppProvider: Setting up auth state listener...");
      const { data: authListener } = supabase.auth.onAuthStateChange(
        (event, session) => {
          console.log(`AppProvider: Auth state change received - Event: ${event}`);
          // Update store state
          useAuthStore.setState({
            user: session?.user ?? null,
            session: session,
            isLoading: false // Set store's isLoading=false
          });
          // Mark local state as resolved only once after first event
          // Check isAuthResolved directly from state variable, not from potentially stale closure value
          setIsAuthResolved(currentResolvedState => {
             if (!currentResolvedState) {
                 console.log("AppProvider: Initial auth state resolved locally.");
                 return true; // Set state to true
             }
             return currentResolvedState; // Keep state as true if already resolved
          });
        }
      );
      console.log("AppProvider: Auth state listener attached.");

      // Return the cleanup function
      return () => {
        if (authListener?.subscription) {
          authListener.subscription.unsubscribe();
          console.log("AppProvider: Auth state listener detached.");
        }
      };
    };

    const cleanupPromise = setup();

    return () => {
      cleanupPromise.then(cleanup => {
        if (cleanup) {
          cleanup();
        }
      });
    };
    // Only depend on initialize, setup runs once on mount.
  }, [initialize]); // Only depend on initialize function reference

  // Show loading indicator controlled by local state until the initial auth check completes
  if (!isAuthResolved) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="space-y-4 text-center">
           <p className="text-muted-foreground">Carregando autenticação...</p>
           <Skeleton className="h-10 w-40 mx-auto" />
        </div>
      </div>
    );
  }

  // Once initial auth is resolved locally, render the main layout which uses store's state
  return (
    <ThemeProvider defaultTheme="dark">
      <Outlet />
      <Toaster />
    </ThemeProvider>
  );
}
