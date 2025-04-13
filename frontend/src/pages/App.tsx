import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "utils/authStore";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { toast } from "sonner";
import brain from "brain";
import { BidResponse } from "types"; // Use correct type

// Helper function to format dates (consider moving to a utils file if used elsewhere)
const formatDate = (dateString: string | undefined) => {
  if (!dateString) return "-";
  try {
    // Check if the date string includes time information
    if (dateString.includes('T')) {
      return new Date(dateString).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        // Optional: include time if needed and available
        // hour: "2-digit", 
        // minute: "2-digit",
      });
    } else {
        // If no time, parse as date only
         return new Date(dateString + 'T00:00:00Z').toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            timeZone: 'UTC' // Specify UTC if the date is timezone-naive
        });
    }
  } catch (e) {
    console.error("Error formatting date:", dateString, e);
    return "Data inválida";
  }
};

// Helper to check if a date is today
const isToday = (dateString: string | undefined): boolean => {
    if (!dateString) return false;
    try {
        const date = new Date(dateString);
        const today = new Date();
        return date.getDate() === today.getDate() &&
               date.getMonth() === today.getMonth() &&
               date.getFullYear() === today.getFullYear();
    } catch {
        return false;
    }
}

// --- Logged Out View Component ---
const LoggedOutView = () => (
  <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center px-4">
    <h1 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
      Inteligência em Licitações Públicas
    </h1>
    <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-8">
      Monitore, analise e prepare propostas com precisão estratégica.
      A LicitaIntel centraliza informações e oferece insights para maximizar suas chances de sucesso em pregões e concorrências.
    </p>
    <div className="flex gap-4">
      <Button size="lg" asChild>
        <Link to="/login">Entrar</Link>
      </Button>
      {/* Optional: Add Sign Up if registration is enabled */}
      {/* <Button size="lg" variant="outline" asChild>
        <Link to="/signup">Cadastre-se</Link>
      </Button> */}
    </div>
  </div>
);

// --- Dashboard Statistics Card Component ---
interface StatCardProps {
  title: string;
  value: number | string;
  description?: string;
  isLoading: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, description, isLoading }) => (
  <Card>
    <CardHeader className="pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent>
      {isLoading ? (
        <Skeleton className="h-8 w-1/2" />
      ) : (
        <div className="text-2xl font-bold">{value}</div>
      )}
      {description && !isLoading && (
        <p className="text-xs text-muted-foreground pt-1">{description}</p>
      )}
      {description && isLoading && (
         <Skeleton className="h-4 w-3/4 mt-1" />
      )}
    </CardContent>
  </Card>
);

const LoggedInView = () => {
  const navigate = useNavigate();
  const [bids, setBids] = useState<BidResponse[]>([]);
  const [bidsLoading, setBidsLoading] = useState(true);
  const [bidsError, setBidsError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBids = async () => {
      console.log("Fetching recent bids...");
      setBidsLoading(true);
      setBidsError(null);
      try {
        const response = await brain.get_licitacoes({ limit: 50 }); // Fetch recent 50

        if (!response.ok) {
          const errorText = await response.text();
          console.error("API Error fetching bids:", response.status, errorText);
          throw new Error(`Falha ao buscar licitações: ${response.statusText} - ${errorText}`);
        }

        const data: BidResponse[] = await response.json();
        console.log("Bids received:", data.length);
        setBids(data);
      } catch (err: any) {
        console.error("Error fetching bids:", err);
        const errorMessage = err.message || "Ocorreu um erro desconhecido ao buscar licitações.";
        setBidsError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setBidsLoading(false);
        console.log("Finished fetching bids.");
      }
    };

    fetchBids();
  }, []);

  // Memoize calculations
  const totalBids = useMemo(() => bids.length, [bids]);
  const bidsToday = useMemo(() => 
    bids.filter(bid => isToday(bid.data_abertura)).length, 
    [bids]
  );

  const handleRowClick = (id: number | string | undefined) => {
    if (id === undefined) {
      console.warn("Attempted to navigate with undefined bid ID");
      toast.warn("ID da licitação não encontrado para navegação.");
      return;
    }
    console.log(`Navigating to /LicitacaoDetails?id=${id}`);
    navigate(`/LicitacaoDetails?id=${id}`);
  };



  return (
    <div className="container py-8 md:py-12">
      <h2 className="text-2xl font-semibold tracking-tight mb-6">Painel Principal</h2>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
         <StatCard 
            title="Total de Licitações Recentes"
            value={bidsLoading || bidsError ? "-" : totalBids}
            isLoading={bidsLoading}
            description="Últimas 50 carregadas"
        />
         <StatCard 
            title="Abertas Hoje"
            value={bidsLoading || bidsError ? "-" : bidsToday}
            isLoading={bidsLoading}
        />
         {/* Add more StatCard instances here */}
      </div>

      {/* Bids Table Card */}
      <Card>
        <CardHeader>
          <CardTitle>Licitações Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          {bidsLoading && (
            <div className="space-y-2">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          )}
          {bidsError && !bidsLoading && (
            <Alert variant="destructive">
              <ExclamationTriangleIcon className="h-4 w-4" />
              <AlertTitle>Erro ao Carregar Licitações</AlertTitle>
              <AlertDescription>{bidsError}</AlertDescription>
            </Alert>
          )}
          {!bidsLoading && !bidsError && bids.length === 0 && (
            <p className="text-center text-muted-foreground py-4">Nenhuma licitação recente encontrada.</p>
          )}
          {!bidsLoading && !bidsError && bids.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Órgão</TableHead>
                  <TableHead className="text-right">Data de Abertura</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bids.map((bid) => (
                  <TableRow
                    key={bid.id}
                    onClick={() => handleRowClick(bid.id)}
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                  >
                    <TableCell className="font-medium max-w-xs truncate">{bid.title || "N/A"}</TableCell>
                    <TableCell className="text-muted-foreground max-w-xs truncate">{bid.orgao || "N/A"}</TableCell>
                    <TableCell className="text-right text-muted-foreground">{formatDate(bid.data_abertura)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// --- Main App Component ---
export default function App() {
  const { user, isLoading: authIsLoading } = useAuthStore();

  // Show loading skeleton for the whole page while auth is resolving
  if (authIsLoading) {
    return (
      <div className="container py-8 md:py-12">
        <Skeleton className="h-10 w-1/4 mb-6" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return user ? <LoggedInView /> : <LoggedOutView />;
}
