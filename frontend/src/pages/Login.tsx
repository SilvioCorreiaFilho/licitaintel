import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "utils/authStore";
import { reinitializeSupabase, supabase } from "utils/supabase";
import { Loader2, AlertCircle, RefreshCw, CheckCircle2 } from "lucide-react";
import { AuthTester } from "components/AuthTester";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

export default function Login() {
  // For testing/debugging purposes
  const [showDebug, setShowDebug] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const navigate = useNavigate();
  const { signIn, error: authError, initialize } = useAuthStore();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [authStatus, setAuthStatus] = useState<string>("idle");
  const [clientStatus, setClientStatus] = useState<string>("unknown");
  
  // Check Supabase client status on component mount
  useEffect(() => {
    const checkSupabaseStatus = async () => {
      try {
        const response = await supabase.auth.getSession();
        setClientStatus(response.error ? "error" : "ready");
      } catch (error) {
        console.error("Error checking Supabase client status:", error);
        setClientStatus("error");
      }
    };
    
    checkSupabaseStatus();
    
    // Check if we're coming from a successful signup
    const params = new URLSearchParams(window.location.search);
    if (params.get('signup') === 'success') {
      console.log('Coming from successful signup');
      toast.success('Cadastro realizado com sucesso! Faça login para continuar.');
    }
  }, []);
  
  // Track auth process state and client initialization
  useEffect(() => {
    if (authError) {
      setLoginError(authError.message);
      setAuthStatus("error");
    }
  }, [authError]);
  
  // Log additional debug information
  useEffect(() => {
    console.log("Login component mounted");
    console.log("Current clientStatus:", clientStatus);
    
    // Debug info about routes
    console.log("Current location:", window.location.pathname);
    console.log("Navigation available:", !!navigate);
    
    return () => {
      console.log("Login component unmounting");
    };
  }, [clientStatus, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError(null);
    setAuthStatus("authenticating");
    
    try {
      console.group('📥 Login Process');
      // Always reinitialize before login to ensure fresh credentials
      console.log("Reinitializing Supabase client before login attempt...");
      await reinitializeSupabase();
      
      console.log("Login attempt starting with email:", email);
      const { error } = await signIn(email, password);
      
      if (error) {
        console.error("Login failed with error:", error.message);
        setLoginError(error.message);
        setAuthStatus("error");
        toast.error("Falha no login: " + error.message);
      } else {
        console.log("Login successful, refreshing auth state");
        
        // Ensure auth state is refreshed
        await initialize();
        
        console.log("Auth state refreshed, preparing redirect");
        setAuthStatus("success");
        toast.success("Login bem-sucedido!");
        
        // Add query param to indicate successful login when redirecting
        console.log("Redirecting to dashboard with success param");
        navigate("/dashboard?login=success");
      }
    } catch (err) {
      console.error("Unexpected login error:", err);
      setLoginError("An unexpected error occurred. Please try again.");
      setAuthStatus("error");
      toast.error("Erro inesperado. Por favor, tente novamente.");
    } finally {
      setIsLoading(false);
      console.groupEnd();
    }
  };
  
  // Handler to refresh Supabase client
  const handleRefreshSupabase = async () => {
    setIsRefreshing(true);
    try {
      console.group('🔄 Supabase Reinitialization');
      console.log("Starting Supabase client reinitialization");
      
      await reinitializeSupabase();
      console.log("Supabase client reinitialized");
      
      // Check client status after reinitialization
      console.log("Checking client status...");
      const response = await supabase.auth.getSession();
      const newStatus = response.error ? "error" : "ready";
      console.log(`Client status: ${newStatus}`, response.error ? `Error: ${response.error.message}` : '');
      setClientStatus(newStatus);
      
      // Refresh auth state
      console.log("Refreshing auth state...");
      await initialize();
      console.log("Auth state refreshed");
      
      // Test if we can do a basic auth operation
      try {
        const { data, error } = await supabase.auth.getUser();
        console.log("Auth test - getUser result:", error ? `Error: ${error.message}` : `Success: ${data?.user?.email || 'No user'}`); 
      } catch (testError) {
        console.error("Auth test failed:", testError);
      }
      
      toast.success("Cliente Supabase reinicializado com sucesso");
    } catch (error) {
      console.error("Error reinitializing Supabase client:", error);
      toast.error("Erro ao reinicializar o cliente Supabase");
    } finally {
      setIsRefreshing(false);
      console.groupEnd();
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="flex-1 flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">LicitaIntel</CardTitle>
            <CardDescription className="text-center">
              Acesse sua conta para gerenciar suas licitações
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {new URLSearchParams(window.location.search).get('from') === '/documentacao' && (
                <Alert className="bg-blue-50 border-blue-200 mb-4">
                  <AlertCircle className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-600">
                    Para acessar a documentação completa do sistema, é necessário fazer login.
                  </AlertDescription>
                </Alert>
              )}
              {loginError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {loginError}
                  </AlertDescription>
                </Alert>
              )}
              
              {authStatus === "success" && (
                <Alert className="bg-green-50 border-green-200">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-600">
                    Login bem-sucedido! Redirecionando...
                  </AlertDescription>
                </Alert>
              )}
              
              {clientStatus === "error" && (
                <Alert variant="destructive" className="bg-amber-50 border-amber-200">
                  <AlertCircle className="h-4 w-4 text-amber-600" />
                  <AlertDescription className="text-amber-600">
                    Problema de conexão com a autenticação. Tente reiniciar a autenticação abaixo.
                  </AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Senha</Label>
                  <button 
                    type="button" 
                    onClick={() => navigate("/forgot-password")} 
                    className="text-sm text-primary hover:underline"
                  >
                    Esqueceu a senha?
                  </button>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
              </div>
              
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Entrando...
                  </>
                ) : (
                  "Entrar"
                )}
              </Button>
            </form>
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-4">
            <div className="flex justify-between items-center w-full">
              <button 
                type="button" 
                onClick={() => setShowDebug(!showDebug)} 
                className="text-xs text-muted-foreground hover:underline"
              >
                {showDebug ? "Ocultar" : "Mostrar"} ferramentas de diagnóstico
              </button>
              
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs" 
                onClick={handleRefreshSupabase}
                disabled={isRefreshing}
              >
                {isRefreshing ? (
                  <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                ) : (
                  <RefreshCw className="h-3 w-3 mr-1" />
                )}
                Reiniciar autenticação
              </Button>
            </div>
            
            {showDebug && (
              <div className="w-full space-y-4">
                <Separator />
                <div className="text-xs text-muted-foreground">
                  <p className="font-medium mb-1">Estado de autenticação:</p>
                  <p>Status da autenticação: <span className="font-mono">{authStatus}</span></p>
                  <p>Status do cliente: <span className="font-mono">{clientStatus}</span></p>
                  <p>Erro: <span className="font-mono">{loginError || "nenhum"}</span></p>
                </div>
                <AuthTester />
              </div>
            )}
            
            <Separator />
            
            <div className="text-sm text-center">
              Não tem uma conta?{" "}
              <button 
                type="button" 
                onClick={() => navigate("/signup")} 
                className="text-primary hover:underline"
              >
                Cadastre-se
              </button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
