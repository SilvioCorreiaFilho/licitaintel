import React from "react";

export const AboutSection = () => {
  return (
    <section id="about" className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Sobre a LicitaIntel</h2>
          <p className="text-xl text-muted-foreground">
            Simplificando processos e aumentando oportunidades para fornecedores do governo
          </p>
        </div>
        
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border rounded-lg p-6">
              <h3 className="text-2xl font-semibold mb-4">Nossa Missão</h3>
              <p className="text-muted-foreground mb-4">
                Democratizar o acesso às licitações públicas brasileiras, permitindo que pequenas e médias empresas 
                compitam de igual para igual com grandes corporações através de inteligência de dados e automação.
              </p>
              <p className="text-muted-foreground">
                Acreditamos que ao simplificar o complexo universo das compras governamentais, contribuímos para um 
                mercado mais competitivo, transparente e eficiente.
              </p>
            </div>
            
            <div className="border rounded-lg p-6">
              <h3 className="text-2xl font-semibold mb-4">Nossa Tecnologia</h3>
              <p className="text-muted-foreground mb-4">
                A plataforma LicitaIntel utiliza tecnologias de ponta como inteligência artificial, 
                processamento de linguagem natural e aprendizado de máquina para analisar milhares de editais 
                diariamente.
              </p>
              <div className="grid grid-cols-1 gap-4 mt-6">
                <div className="p-4 border rounded-md">
                  <h4 className="font-semibold mb-2">Banco de Dados Vetoriais</h4>
                  <p className="text-sm text-muted-foreground">Utilizamos banco de dados vetoriais (Qdrant) para busca semântica avançada.</p>
                </div>
              </div>
            </div>
            
            <div className="border rounded-lg p-6">
              <h3 className="text-2xl font-semibold mb-4">Nossa Equipe</h3>
              <p className="text-muted-foreground mb-4">
                Somos uma equipe multidisciplinar de especialistas em tecnologia, licitações públicas e análise de dados, 
                comprometidos em criar a melhor plataforma de inteligência para licitações do Brasil.
              </p>
              <div className="grid grid-cols-1 gap-4 mt-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-muted rounded-full mx-auto mb-2"></div>
                  <h4 className="font-semibold">Silvio Correia</h4>
                  <p className="text-sm text-muted-foreground">CEO & Fundador</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

