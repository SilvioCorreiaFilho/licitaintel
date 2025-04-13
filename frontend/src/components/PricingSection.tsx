import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";

export const PricingSection = () => {
  const pricingPlans = [
    {
      name: "Básico",
      description: "Para empresas iniciantes no mercado de licitações",
      price: "R$ 299",
      billing: "/mês",
      features: [
        "Até 5 monitoramentos ativos",
        "Busca semântica básica",
        "Alertas por e-mail",
        "Histórico de preços (3 meses)",
        "Suporte por email"
      ],
      buttonText: "Começar Grátis",
      buttonVariant: "outline"
    },
    {
      name: "Profissional",
      description: "Para fornecedores regulares do governo",
      price: "R$ 599",
      billing: "/mês",
      features: [
        "Até 20 monitoramentos ativos",
        "Busca semântica avançada",
        "Alertas por e-mail e SMS",
        "Histórico de preços (12 meses)",
        "Previsão de preços básica",
        "Suporte prioritário",
        "Exportação de relatórios"
      ],
      buttonText: "Assinar Agora",
      buttonVariant: "default",
      highlighted: true
    },
    {
      name: "Empresarial",
      description: "Para empresas que dependem de licitações",
      price: "R$ 1.199",
      billing: "/mês",
      features: [
        "Monitoramentos ilimitados",
        "Busca semântica avançada",
        "Alertas em tempo real",
        "Histórico de preços completo",
        "Previsão de preços avançada",
        "API de integração",
        "Suporte dedicado 24/7",
        "Análise de concorrentes"
      ],
      buttonText: "Contato Comercial",
      buttonVariant: "outline"
    }
  ];

  return (
    <section id="pricing" className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Planos e Preços</h2>
          <p className="text-xl text-muted-foreground">
            Escolha o plano ideal para as necessidades do seu negócio
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricingPlans.map((plan, index) => (
            <Card key={index} className={`border-border ${plan.highlighted ? 'ring-2 ring-primary shadow-lg' : ''}`}>
              <CardHeader>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-baseline">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground ml-1">{plan.billing}</span>
                </div>
                <ul className="space-y-3 py-4">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <Check className="mr-2 h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button variant={plan.buttonVariant as "outline" | "default"} className="w-full">
                  {plan.buttonText}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
