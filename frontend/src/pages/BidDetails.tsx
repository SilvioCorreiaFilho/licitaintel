import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ChevronRight, Home } from "lucide-react";
import { useBidsStore } from "../utils/bidsStore";
import { BidDetailsCard } from "../components/BidDetailsCard";

export default function BidDetails() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get('id');

  const navigate = useNavigate();
  const { fetchBidById, currentBid, isLoading, error } = useBidsStore();

  useEffect(() => {
    if (id) {
      const bidId = parseInt(id);
      if (!isNaN(bidId)) {
        fetchBidById(bidId).catch((err) => {
          toast({
            title: "Erro ao carregar licitação",
            description: "Não foi possível carregar os detalhes desta licitação.",
            variant: "destructive",
          });
        });
      } else {
        toast({
          title: "ID inválido",
          description: "O ID da licitação é inválido.",
          variant: "destructive",
        });
        navigate("/dashboard");
      }
    }
  }, [id, fetchBidById, navigate]); // Removed toast from dependencies

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center mb-6 text-sm text-muted-foreground">
          <Home className="h-4 w-4 mr-1" />
          <span>Dashboard</span>
          <ChevronRight className="h-4 w-4 mx-1" />
          <span>Carregando...</span>
        </div>
        
        <div className="animate-pulse space-y-6">
          <div className="h-10 bg-muted rounded w-1/3"></div>
          <div className="h-64 bg-muted rounded"></div>
          <div className="h-32 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !currentBid) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center mb-6 text-sm text-muted-foreground">
          <Home className="h-4 w-4 mr-1" />
          <span>Dashboard</span>
          <ChevronRight className="h-4 w-4 mx-1" />
          <span>Erro</span>
        </div>
        
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">
            {error ? "Erro ao carregar a licitação" : "Licitação não encontrada"}
          </h1>
          <p className="text-muted-foreground mb-6">
            {error
              ? "Ocorreu um erro ao carregar os detalhes desta licitação. Por favor, tente novamente."
              : "A licitação que você está procurando não foi encontrada."}
          </p>
          <Button onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para o Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center mb-6 text-sm text-muted-foreground">
        <Home className="h-4 w-4 mr-1" />
        <span className="cursor-pointer hover:underline" onClick={() => navigate("/dashboard")}>Dashboard</span>
        <ChevronRight className="h-4 w-4 mx-1" />
        <span>{currentBid.title.substring(0, 30)}{currentBid.title.length > 30 ? "..." : ""}</span>
      </div>
      
      <BidDetailsCard bid={currentBid} />
    </div>
  );
}
