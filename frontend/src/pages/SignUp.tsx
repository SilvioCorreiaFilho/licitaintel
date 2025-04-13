import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "utils/authStore";
import { reinitializeSupabase } from "utils/supabase";
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export default function SignUp() {
  const navigate = useNavigate();
  const { signUp, error: authError } = useAuthStore();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [signupError, setSignupError] = useState<string | null>(null);
  const [signupStatus, setSignupStatus] = useState<string>("idle");
  
  // Track auth process state
  useEffect(() => {
    if (authError) {
      setSignupError(authError.message);
      setSignupStatus("error");
    }
  }, [authError]);
  
  // Log additional debug information
  useEffect(() => {
    console.log("SignUp component mounted");
    console.log("Current location:", window.location.pathname);
    console.log("Navigation available:", !!navigate);
    
    return () => {
      console.log("SignUp component unmounting");
    };
  }, [navigate]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSignupError(null);
    setSignupStatus("processing");
    
    // Validate password match
    if (password !== confirmPassword) {
      setSignupError("As senhas não correspondem.");
      setSignupStatus("error");
      setIsLoading(false);
      return;
    }
    
    // Validate password strength
    if (password.length < 8) {
      setSignupError("A senha deve ter pelo menos 8 caracteres.");
      setSignupStatus("error");
      setIsLoading(false);
      return;
    }
    
    try {
      console.group('📝 Signup Process');
      console.log("Signup attempt starting with email:", email);
      
      // Always reinitialize before signup to ensure fresh credentials
      console.log("Reinitializing Supabase client before signup attempt...");
      await reinitializeSupabase();
      
      const { error } = await signUp(email, password);
      
      if (error) {
        console.error("Signup failed with error:", error.message);
        setSignupError(error.message);
        setSignupStatus("error");
        toast.error("Falha no cadastro: " + error.message);
      } else {
        console.log("Signup successful, preparing redirect");
        setSignupStatus("success");
        toast.success("Cadastro realizado com sucesso! Verifique seu email para confirmar a conta.");
        
        // Redirect to login page after a delay
        setTimeout(() => {
          navigate("/login?signup=success");
        }, 3000);
      }
    } catch (err) {
      console.error("Unexpected signup error:", err);
      setSignupError("Ocorreu um erro inesperado. Por favor, tente novamente.");
      setSignupStatus("error");
      toast.error("Erro inesperado. Por favor, tente novamente.");
    } finally {
      setIsLoading(false);
      console.groupEnd();
    }
  };

  if (signupStatus === "success") {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <div className="flex-1 flex items-center justify-center py-12 px-4">
          <Card className="w-full max-w-md">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center">Cadastro Realizado</CardTitle>
              <CardDescription className="text-center">
                Enviamos um email de confirmação para {email}. Por favor, verifique sua caixa de entrada e siga as instruções para ativar sua conta.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Alert className="bg-green-50 border-green-200">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-600">
                  Você será redirecionado para a página de login em alguns segundos...
                </AlertDescription>
              </Alert>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={() => navigate("/login")} 
                className="w-full"
              >
                Ir para o Login Agora
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="flex-1 flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Criar Conta</CardTitle>
            <CardDescription className="text-center">
              Cadastre-se para acessar a plataforma LicitaIntel
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSignUp} className="space-y-4">
              {signupError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {signupError}
                  </AlertDescription>
                </Alert>
              )}
              
              {signupStatus === "processing" && (
                <Alert>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <AlertDescription>
                    Processando seu cadastro...
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
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  required
                />
                <p className="text-xs text-muted-foreground">A senha deve ter pelo menos 8 caracteres</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="********"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                  required
                />
              </div>
              
              <Button type="submit" className="w-full" disabled={isLoading || signupStatus === "processing"}>
                {isLoading || signupStatus === "processing" ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Criando conta...
                  </>
                ) : (
                  "Criar Conta"
                )}
              </Button>
            </form>
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-sm text-center">
              Já tem uma conta?{" "}
              <button 
                type="button" 
                onClick={() => navigate("/login")} 
                className="text-primary hover:underline"
              >
                Entrar
              </button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
