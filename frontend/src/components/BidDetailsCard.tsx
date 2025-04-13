import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CalendarIcon, FileTextIcon, Building2Icon, DollarSignIcon, TagIcon } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Bid } from "../utils/types";
import { useBidsStore } from "../utils/bidsStore";

interface Props {
  bid: Bid;
  showSimilarBids?: boolean;
  onOpenPdf?: () => void;
}

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
    return format(date, "PPP", { locale: ptBR });
  } catch (e) {
    return "Data não disponível";
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "aberta":
      return "bg-green-500 hover:bg-green-600";
    case "encerrada":
      return "bg-gray-500 hover:bg-gray-600";
    case "cancelada":
      return "bg-red-500 hover:bg-red-600";
    case "suspensa":
      return "bg-yellow-500 hover:bg-yellow-600";
    default:
      return "bg-blue-500 hover:bg-blue-600";
  }
};

export function BidDetailsCard({ bid, showSimilarBids = true, onOpenPdf }: Props) {
  const navigate = useNavigate();
  const { getSimilarBids, similarBids, isLoading } = useBidsStore();

  useEffect(() => {
    if (showSimilarBids && bid?.id) {
      getSimilarBids(bid.id);
    }
  }, [bid?.id, showSimilarBids, getSimilarBids]);

  const handleOpenEdital = () => {
    if (bid.link_edital) {
      window.open(bid.link_edital, "_blank");
    } else if (onOpenPdf) {
      onOpenPdf();
    }
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-md">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <Badge className={getStatusColor(bid.status)}>
                {bid.status.charAt(0).toUpperCase() + bid.status.slice(1)}
              </Badge>
              <CardTitle className="mt-2 text-2xl">{bid.title}</CardTitle>
              <CardDescription className="mt-1">
                Processo: {bid.numero_processo}
              </CardDescription>
            </div>
            {bid.valor_estimado && (
              <div className="bg-muted p-3 rounded-md text-right">
                <div className="text-sm text-muted-foreground">Valor Estimado</div>
                <div className="text-xl font-bold">
                  {formatCurrency(bid.valor_estimado)}
                </div>
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Building2Icon className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="text-sm text-muted-foreground">Órgão</div>
                <div>{bid.orgao}</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="text-sm text-muted-foreground">Data de Abertura</div>
                <div>{formatDate(bid.data_abertura)}</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <TagIcon className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="text-sm text-muted-foreground">Modalidade</div>
                <div>{bid.modalidade}</div>
              </div>
            </div>

            {bid.data_encerramento && (
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="text-sm text-muted-foreground">Data de Encerramento</div>
                  <div>{formatDate(bid.data_encerramento)}</div>
                </div>
              </div>
            )}
          </div>

          <Separator />

          <div>
            <h3 className="font-medium mb-2">Descrição</h3>
            <p className="text-sm text-muted-foreground">{bid.description}</p>
          </div>

          {bid.objeto && (
            <div>
              <h3 className="font-medium mb-2">Objeto</h3>
              <p className="text-sm text-muted-foreground">{bid.objeto}</p>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => navigate(-1)}>
            Voltar
          </Button>
          {bid.link_edital && (
            <Button onClick={handleOpenEdital}>
              <FileTextIcon className="h-4 w-4 mr-2" /> Ver Edital
            </Button>
          )}
        </CardFooter>
      </Card>

      {showSimilarBids && similarBids.length > 0 && (
        <div>
          <h3 className="text-lg font-medium mb-3">Licitações Similares</h3>
          <div className="grid grid-cols-1 gap-4">
            {similarBids.map((similarBid) => (
              <Card 
                key={similarBid.bid_id} 
                className="cursor-pointer hover:bg-accent/50 transition-colors"
                onClick={() => navigate(`/bid/${similarBid.bid_id}`)}
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{similarBid.title}</h4>
                      <div className="text-sm text-muted-foreground mt-1">
                        {similarBid.orgao} · {similarBid.modalidade}
                      </div>
                    </div>
                    <Badge variant="outline">
                      {Math.round(similarBid.similarity * 100)}% similar
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
