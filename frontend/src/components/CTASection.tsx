import React from "react";
import { Button } from "@/components/ui/button";

export interface Props {
  onTryFreeClick?: () => void;
}

export const CTASection = ({ onTryFreeClick }: Props) => {
  return (
    <section className="py-16 md:py-24 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Pronto para transformar sua estratégia de licitações?
          </h2>
          <p className="text-xl mb-8 text-primary-foreground/90">
            Junte-se a centenas de empresas que já estão economizando tempo e aumentando o sucesso em licitações públicas através de nossa plataforma.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              variant="secondary"
              onClick={onTryFreeClick} 
              className="text-lg px-8 py-6"
            >
              Experimente Grátis por 14 Dias
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg px-8 py-6 bg-transparent text-primary-foreground border-primary-foreground/20 hover:bg-primary-foreground/10"
            >
              Agendar Demonstração
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
