import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, BuildingIcon, DollarSignIcon, SearchIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useAuthStore } from "utils/authStore";
import { useBidsStore } from "utils/bidsStore";
import { SemanticSearchBox } from "../components/SemanticSearchBox";
import { apiTester } from "../utils/apiTester";
import { toast } from "sonner";
import { reinitializeSupabase } from "utils/supabase";


export default function Dashboard() {
  const navigate = useNavigate();
  const { user, signOut, isLoading: authLoading, initialize } = useAuthStore();
  const { bids, isLoading: bidsLoading, fetchBids, filterByStatus, filterStatus } = useBidsStore();
  const [activeTab, setActiveTab] = useState("todas");
  const [apiStatus, setApiStatus] = useState({
    initialized: false,
    loading: false,
    results: null as any
  });

  useEffect(() => {
    // Only fetch bids if user is authenticated
    if (user) {
      console.log("Dashboard: User authenticated, fetching bids...");
      fetchBids();
      
      // Test API connections on dashboard load
      const testApiConnections = async () => {
        setApiStatus(prev => ({ ...prev, loading: true }));
        try {
          console.log("Testing API connections...");
          const results = await apiTester.runAllTests();
          console.log("API test results:", results);
          
          setApiStatus({
            initialized: true,
            loading: false,
            results
          });
          
          if (results.allPassed) {
            console.log("All API tests passed!");
            toast.success("Conexão com APIs estabelecida com sucesso");
          } else {
            console.warn("Some API tests failed. Check console for details.");
            toast.warning("Algumas conexões com APIs falharam. Verifique o console para detalhes.");
          }
        } catch (error) {
          console.error("Error testing API connections:", error);
          setApiStatus({
            initialized: true,
            loading: false,
            results: { allPassed: false, error }
          });
          toast.error("Erro ao testar conexões com APIs");
        }
      };
      
      // Run the API tests to validate Supabase integration
      testApiConnections();
    } else {
      console.log("Dashboard: User not authenticated");
    }
  }, [fetchBids, user]);


  const handleSignOut = async () => {
    try {
      toast.info("Saindo...");
      await signOut();
      toast.success("Logout realizado com sucesso!");
      navigate("/login");
    } catch (error) {
      console.error("Error during sign out:", error);
      toast.error("Erro ao realizar logout. Tente novamente.");
    }
  };
  
  const handleRefreshAuth = async () => {
    try {
      toast.info("Reinicializando autenticação...");
      await reinitializeSupabase();
      await initialize();
      toast.success("Autenticação reinicializada com sucesso!");
    } catch (error) {
      console.error("Error refreshing auth:", error);
      toast.error("Erro ao reinicializar autenticação");
    }
  };
  
  const handleTabChange = (status: string) => {
    setActiveTab(status);
    if (status === "todas") {
      filterByStatus(null);
    } else {
      filterByStatus(status);
    }
  };
  
  const handleBidClick = (bidId: number) => {
    navigate(`/bid-details?id=${bidId}`);
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "aberta":
        return <Badge className="bg-green-500">Aberta</Badge>;
      case "encerrada":
        return <Badge className="bg-gray-500">Encerrada</Badge>;
      case "cancelada":
        return <Badge className="bg-red-500">Cancelada</Badge>;
      case "suspensa":
        return <Badge className="bg-yellow-500">Suspensa</Badge>;
      default:
        return <Badge className="bg-blue-500">{status}</Badge>;
    }
  };
  
  const formatCurrency = (value: number | null) => {
    if (value === null) return "Valor não informado";
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };
  
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, "dd/MM/yyyy", { locale: ptBR });
    } catch (e) {
      return "Data não disponível";
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-900">LicitaIntel Dashboard</h1>
          <div className="flex items-center gap-2">
            {authLoading ? (
              <span className="text-sm text-muted-foreground flex items-center">
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Verificando sessão...
              </span>
            ) : null}
            <Button variant="ghost" size="sm" onClick={handleRefreshAuth}>
              Recarregar Sessão
            </Button>
            <Button variant="outline" onClick={handleSignOut}>Sair</Button>
          </div>
        </div>
      </header>
      
      <main className="flex-1 py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <h2 className="text-lg font-medium mb-4">Bem-vindo, {user?.email || "Usuário"}</h2>
            <p className="text-gray-600 mb-4">
              Este é o seu dashboard onde você poderá gerenciar e monitorar licitações do governo brasileiro.
            </p>
            
            {!user && (
              <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mb-4">
                <p className="text-amber-800 text-sm">
                  Sessão não detectada. Por favor, tente recarregar a sessão ou faça login novamente.
                </p>
                <div className="mt-2 flex gap-2">
                  <Button size="sm" variant="outline" onClick={handleRefreshAuth}>
                    Recarregar Sessão
                  </Button>
                  <Button size="sm" onClick={() => navigate("/login")}>
                    Login
                  </Button>
                </div>
              </div>
            )}
            
            <div className="flex justify-end mb-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/documentacao")}
                className="text-primary hover:bg-primary/10"
              >
                Ver Documentação Completa
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <div className="bg-primary/10 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Licitações Ativas</h3>
                <p className="text-3xl font-bold">
                  {bidsLoading ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  ) : (
                    bids.filter(bid => bid.status === "aberta").length
                  )}
                </p>
              </div>
              <div className="bg-amber-100 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Monitoramentos</h3>
                <p className="text-3xl font-bold">0</p>
              </div>
              <div className="bg-green-100 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Previsão de Preços</h3>
                <p className="text-3xl font-bold">0</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <div className="mb-6">
              <h2 className="text-lg font-medium mb-4">Busca Semântica de Licitações</h2>
              <SemanticSearchBox />
            </div>
          </div>
          
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium mb-4">Licitações</h2>
            
            <Tabs defaultValue="todas" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger 
                  value="todas" 
                  onClick={() => handleTabChange("todas")}
                >
                  Todas
                </TabsTrigger>
                <TabsTrigger 
                  value="aberta" 
                  onClick={() => handleTabChange("aberta")}
                >
                  Abertas
                </TabsTrigger>
                <TabsTrigger 
                  value="encerrada" 
                  onClick={() => handleTabChange("encerrada")}
                >
                  Encerradas
                </TabsTrigger>
                <TabsTrigger 
                  value="suspensa" 
                  onClick={() => handleTabChange("suspensa")}
                >
                  Suspensas
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value={activeTab} className="mt-0">
                {bidsLoading ? (
                  <div className="animate-pulse space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-32 bg-muted rounded"></div>
                    ))}
                  </div>
                ) : bids.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">Nenhuma licitação encontrada.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bids.map((bid) => (
                      <Card 
                        key={bid.id} 
                        className="cursor-pointer hover:bg-accent/50 transition-colors"
                        onClick={() => handleBidClick(bid.id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                {getStatusBadge(bid.status)}
                                <span className="text-sm text-muted-foreground">{bid.modalidade}</span>
                              </div>
                              <h3 className="font-medium text-lg mb-1">{bid.title}</h3>
                              <p className="text-sm text-muted-foreground line-clamp-2">{bid.description || bid.objeto}</p>
                            </div>
                            <div className="flex flex-row md:flex-col gap-4 md:min-w-[200px]">
                              <div className="flex items-center gap-2">
                                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">{formatDate(bid.data_abertura)}</span>
                              </div>
                              {bid.valor_estimado && (
                                <div className="flex items-center gap-2">
                                  <DollarSignIcon className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm">{formatCurrency(bid.valor_estimado)}</span>
                                </div>
                              )}
                              <div className="flex items-center gap-2">
                                <BuildingIcon className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">{bid.orgao}</span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      
      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center space-y-2">
            <p className="text-sm text-center text-gray-500">
              &copy; {new Date().getFullYear()} LicitaIntel. Todos os direitos reservados.
            </p>
            <div className="flex space-x-4">
              <button 
                onClick={() => navigate("/documentacao")} 
                className="text-xs text-primary hover:underline"
              >
                Documentação
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
