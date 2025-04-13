import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { bidService } from "../utils/databaseService";
import { useNavigate } from "react-router-dom";

export interface SemanticSearchResult {
  bid_id: number;
  content: string;
  similarity: number;
}

interface Props {
  onSearch?: (results: SemanticSearchResult[]) => void;
  placeholder?: string;
  buttonText?: string;
  limit?: number;
  isFullWidth?: boolean;
  showResults?: boolean;
}

export function SemanticSearchBox({
  onSearch,
  placeholder = "Buscar licitações por descrição ou necessidade...",
  buttonText = "Buscar",
  limit = 5,
  isFullWidth = false,
  showResults = true,
}: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SemanticSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async () => {
    if (!query.trim()) return;

    setIsSearching(true);
    try {
      const searchResults = await bidService.searchBidsSemantic(query, limit);
      setResults(searchResults);
      if (onSearch) {
        onSearch(searchResults);
      }
    } catch (error) {
      console.error("Error performing semantic search:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const navigateToBid = (bidId: number) => {
    navigate(`/bid/${bidId}`);
  };

  return (
    <div className={`flex flex-col ${isFullWidth ? "w-full" : "max-w-2xl"}`}>
      <div className="flex w-full">
        <Input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          className="rounded-r-none"
          disabled={isSearching}
        />
        <Button
          onClick={handleSearch}
          className="rounded-l-none"
          disabled={isSearching}
        >
          {isSearching ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Buscando...
            </>
          ) : (
            buttonText
          )}
        </Button>
      </div>

      {showResults && results.length > 0 && (
        <div className="mt-4 space-y-3">
          <p className="text-sm text-muted-foreground">
            {results.length} resultado{results.length !== 1 ? "s" : ""}
            encontrado{results.length !== 1 ? "s" : ""}:
          </p>
          {results.map((result) => (
            <Card
              key={result.bid_id}
              className="cursor-pointer hover:bg-accent/50 transition-colors"
              onClick={() => navigateToBid(result.bid_id)}
            >
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="line-clamp-3 text-sm">{result.content}</div>
                  </div>
                  <div className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                    {Math.round(result.similarity * 100)}% match
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
