import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAuthStore } from "utils/authStore";
import { supabase } from "utils/supabase";

export function AuthTester() {
  const { user } = useAuthStore();
  const [authStatus, setAuthStatus] = useState<{status: string; message: string}>({ 
    status: "pending", 
    message: "Testing authentication..." 
  });
  const [supabaseConfig, setSupabaseConfig] = useState<{url: string; keyFormat: string}>({ 
    url: "", 
    keyFormat: "" 
  });

  // Test authentication on component mount
  useEffect(() => {
    testAuthentication();
  }, []);

  const testAuthentication = async () => {
    setAuthStatus({ status: "testing", message: "Testing Supabase authentication..." });
    
    try {
      // Check if we can get the current session from Supabase
      const { data, error } = await supabase.auth.getSession();
      
      // Check if we can get URL and key format
      const url = await supabase.auth.config.url;
      const anonKey = await supabase.auth.config.key;
      setSupabaseConfig({
        url: url || "Not available",
        keyFormat: anonKey ? (anonKey.startsWith("ey") ? "Valid JWT format" : "Invalid format") : "Not available"
      });
      
      if (error) {
        setAuthStatus({ 
          status: "error", 
          message: `Authentication error: ${error.message}` 
        });
        return;
      }
      
      if (data.session) {
        setAuthStatus({ 
          status: "success", 
          message: `Authenticated as ${data.session.user.email}` 
        });
      } else if (user) {
        setAuthStatus({ 
          status: "warning", 
          message: "Local state has user but no active Supabase session" 
        });
      } else {
        setAuthStatus({ 
          status: "info", 
          message: "Not authenticated (normal if not logged in)" 
        });
      }
    } catch (e) {
      setAuthStatus({ 
        status: "error", 
        message: `Authentication test error: ${e instanceof Error ? e.message : 'Unknown error'}` 
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Authentication Status</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm font-medium">Auth State:</p>
            <p className="text-sm">
              {user ? (
                <span className="text-green-600 font-medium">Logged in as {user.email}</span>
              ) : (
                <span className="text-amber-600 font-medium">Not logged in</span>
              )}
            </p>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm font-medium">Auth Status:</p>
            <p className="text-sm">
              {authStatus.status === "success" ? (
                <span className="text-green-600 font-medium">{authStatus.message}</span>
              ) : authStatus.status === "error" ? (
                <span className="text-red-600 font-medium">{authStatus.message}</span>
              ) : authStatus.status === "warning" ? (
                <span className="text-amber-600 font-medium">{authStatus.message}</span>
              ) : (
                <span className="text-blue-600 font-medium">{authStatus.message}</span>
              )}
            </p>
          </div>
        </div>
        
        <Separator />
        
        <div className="space-y-2">
          <p className="text-sm font-medium">Supabase Configuration:</p>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="font-medium">URL:</span> {supabaseConfig.url}
            </div>
            <div>
              <span className="font-medium">Anon Key Format:</span> {supabaseConfig.keyFormat}
            </div>
          </div>
        </div>
        
        <Button onClick={testAuthentication} size="sm" variant="outline">
          Test Authentication
        </Button>
      </CardContent>
    </Card>
  );
}
