import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ArrowLeftIcon, ExclamationTriangleIcon } from "@radix-ui/react-icons";
import brain from "brain";
import { BidResponse } from "types"; // Use correct type
import { toast } from "sonner";

export default function LicitacaoDetails() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const licitacaoId = searchParams.get("id");

  const [licitacao, setLicitacao] = useState<BidResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!licitacaoId) {
      setError("ID da licitação não fornecido na URL.");
      setIsLoading(false);
      toast.error("ID da licitação inválido.");
      return;
    }

    const fetchLicitacaoDetails = async () => {
      console.log(`Fetching details for licitacao ID: ${licitacaoId}`);
      setIsLoading(true);
      setError(null);
      try {
        // Pass licitacaoId correctly based on the expected parameter name
        const response = await brain.get_licitacao({ licitacaoId: licitacaoId });

        if (!response.ok) {
          const errorText = await response.text();
          console.error("API Error fetching bid details:", response.status, errorText);
          throw new Error(`Falha ao buscar detalhes da licitação: ${response.statusText} - ${errorText}`);
        }

        const data: BidResponse = await response.json();
        console.log("Licitacao details received:", data);
        setLicitacao(data);
      } catch (err: any) {
        console.error("Error fetching licitacao details:", err);
        const errorMessage = err.message || "Falha ao carregar detalhes da licitação.";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
        console.log("Finished fetching licitacao details.");
      }
    };

    fetchLicitacaoDetails();
  }, [licitacaoId]);

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "Não informado";
    try {
      return new Date(dateString).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (e) {
      console.error("Error formatting date:", dateString, e);
      return "Data inválida";
    }
  };

  return (
    <div className="container py-8 md:py-12">
      <Button variant="outline" size="sm" onClick={() => navigate(-1)} className="mb-6">
        <ArrowLeftIcon className="mr-2 h-4 w-4" />
        Voltar
      </Button>

      {isLoading ? (
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </CardContent>
        </Card>
      ) : error ? (
        <Alert variant="destructive">
          <ExclamationTriangleIcon className="h-4 w-4" />
          <AlertTitle>Erro ao Carregar</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : licitacao ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl md:text-2xl">{licitacao.title || "Título não disponível"}</CardTitle>
            <CardDescription>
              <strong>Órgão:</strong> {licitacao.orgao || "Não informado"} <br />
              <strong>Data de Abertura:</strong> {formatDate(licitacao.data_abertura)} <br />
              {licitacao.num_aviso && <><strong>Aviso N°:</strong> {licitacao.num_aviso}<br /></>}
              {licitacao.uasg && <><strong>UASG:</strong> {licitacao.uasg}</>}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <h3 className="font-semibold mb-2 text-lg">Objeto da Licitação</h3>
            <p className="text-muted-foreground whitespace-pre-wrap">
              {licitacao.objeto || "Descrição do objeto não disponível."}
            </p>
            {/* Add more fields as needed based on the Licitacao type */}
            {/* Example: Displaying link if available */}
            {licitacao.link_edital && (
              <div className="mt-4">
                <Button asChild variant="link" className="p-0 h-auto">
                  <a href={licitacao.link_edital} target="_blank" rel="noopener noreferrer">
                    Ver Edital/Detalhes
                  </a>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <p className="text-center text-muted-foreground">Detalhes da licitação não encontrados.</p>
      )}
    </div>
  );
}
