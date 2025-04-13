import React from "react";
import { ProtectedRoute } from "components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Header } from "components/Header";
import { Footer } from "components/Footer";

export default function Documentacao() {
  const navigate = useNavigate();

  return (
    <ProtectedRoute>
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)} 
            className="mr-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </div>
        
        <Card>
          <CardContent className="p-6">
            <article className="prose prose-slate max-w-none lg:prose-lg">
              <h1 className="text-3xl font-bold mb-8">LicitaIntel - Documentação Completa</h1>
              
              <nav className="mb-8 p-4 bg-slate-50 rounded-lg">
                <h2 className="text-xl font-semibold mb-4">Índice</h2>
                <ol className="list-decimal pl-5 space-y-1">
                  <li><a href="#visao-geral" className="text-blue-600 hover:underline">Visão Geral do Projeto</a></li>
                  <li><a href="#arquitetura" className="text-blue-600 hover:underline">Arquitetura do Sistema</a></li>
                  <li><a href="#configuracao" className="text-blue-600 hover:underline">Configuração e Instalação</a></li>
                  <li><a href="#apis" className="text-blue-600 hover:underline">APIs e Endpoints</a></li>
                  <li><a href="#banco-dados" className="text-blue-600 hover:underline">Banco de Dados</a></li>
                  <li><a href="#autenticacao" className="text-blue-600 hover:underline">Fluxo de Autenticação</a></li>
                  <li><a href="#guias" className="text-blue-600 hover:underline">Guias do Usuário</a></li>
                  <li><a href="#desenvolvimento" className="text-blue-600 hover:underline">Processos de Desenvolvimento e Deploy</a></li>
                </ol>
              </nav>
              
              <section id="visao-geral" className="mb-12">
                <h2 className="text-2xl font-bold mb-4 scroll-mt-20">1. Visão Geral do Projeto</h2>
                
                <p className="mb-4">
                  O <strong>LicitaIntel</strong> é uma plataforma SaaS (Software as a Service) robusta, projetada especificamente para atender às necessidades de <strong>contratantes do governo brasileiro</strong>. A plataforma visa transformar a maneira como as empresas descobrem, analisam e participam de processos licitatórios, utilizando inteligência artificial e análise de dados para fornecer uma vantagem competitiva significativa.
                </p>
                <p className="mb-4">
                  Em um mercado complexo e volumoso como o de compras governamentais no Brasil, encontrar as oportunidades certas e definir estratégias de precificação competitivas é um desafio constante. O LicitaIntel surge como uma solução inteligente e automatizada para otimizar todo o ciclo de vida da participação em licitações, desde a prospecção até a análise pós-resultado.
                </p>
                
                <h3 className="text-xl font-semibold mt-6 mb-3">Público-Alvo</h3>
                <p className="mb-4">Empresas de todos os portes que participam ou desejam participar de licitações públicas no Brasil, buscando maior eficiência, inteligência de mercado e taxas de sucesso elevadas.</p>

                <h3 className="text-xl font-semibold mt-6 mb-3">Proposta de Valor</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong>Inteligência Competitiva:</strong> Análise de dados históricos e concorrência para embasar decisões estratégicas.</li>
                  <li><strong>Eficiência Operacional:</strong> Automação da busca, monitoramento e análise de milhares de editais.</li>
                  <li><strong>Previsibilidade:</strong> Modelos preditivos para estimar faixas de preços competitivas e aumentar as chances de vitória.</li>
                  <li><strong>Visão Centralizada:</strong> Dashboard unificado para gerenciar todo o funil de licitações.</li>
                  <li><strong>Alertas Personalizados:</strong> Notificações proativas sobre novas oportunidades alinhadas ao perfil da empresa.</li>
                </ul>

                <h3 className="text-xl font-semibold mt-6 mb-3">Principais Funcionalidades Planejadas</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Coleta e agregação de dados de diversas fontes de licitações.</li>
                  <li>Dashboard interativo com visão geral das oportunidades e métricas chave.</li>
                  <li>Motor de busca avançado com filtros e busca semântica (via Qdrant).</li>
                  <li>Sistema de monitoramento configurável por palavras-chave, categorias e órgãos.</li>
                  <li>Módulo de análise de histórico de preços e concorrentes.</li>
                  <li>Motor de IA para projeção de preços e recomendação de estratégias.</li>
                  <li>Gerenciamento de usuários e perfis de empresa (via Supabase).</li>
                  <li>Relatórios e exports de dados.</li>
                </ul>
              </section>
              
              <section id="arquitetura" className="mb-12">
                <h2 className="text-2xl font-bold mb-4 scroll-mt-20">2. Arquitetura do Sistema</h2>
                
                <h3 className="text-xl font-semibold mt-6 mb-3">Visão Geral da Arquitetura</h3>
                <p className="mb-4">
                  O LicitaIntel opera em uma arquitetura moderna e distribuída, otimizada para escalabilidade e manutenibilidade. A aplicação é desenvolvida e hospedada na plataforma <strong>Databutton</strong>, que gerencia a infraestrutura subjacente, permitindo foco no desenvolvimento das funcionalidades.
                </p>
                <p className="mb-4">
                  A arquitetura consiste em um <strong>frontend React (com Vite)</strong>, um <strong>backend Python (FastAPI)</strong>, e utiliza o <strong>Supabase</strong> como backend-as-a-service para autenticação e banco de dados <strong>PostgreSQL</strong>. Adicionalmente, um banco de dados vetorial <strong>Qdrant</strong> é planejado para funcionalidades de busca semântica. Embora a especificação inicial mencione deploy em Contabo/Hostinger com Traefik, a implementação atual utiliza a infraestrutura gerenciada da Databutton.
                </p>
                
                <h3 className="text-xl font-semibold mt-6 mb-3">Diagrama de Arquitetura Conceitual (PlantUML)</h3>
                <p className="mb-2">O diagrama abaixo ilustra a interação entre os principais componentes do sistema, incluindo a relação com serviços externos como Supabase e Qdrant (planejado).</p>
                <div className="bg-slate-800 text-slate-100 p-4 rounded-lg mb-6 overflow-x-auto">
                  <pre className="text-sm whitespace-pre">
                    {`@startuml
skinparam monochrome true
skinparam shadowing false
skinparam defaultFontName "Segoe UI, Arial"
skinparam defaultFontSize 14

actor Usuário as user

package "Databutton Platform" {
  package "Frontend (UI)" <<Cloud>> {
    [React App (Vite)] as frontend
  }
  
  package "Backend (API)" <<Cloud>> {
    [FastAPI App] as backend
  }
  
  database "DB Storage (Databutton)" as dbstorage
}

package "Serviços Externos" {
  database "Supabase" <<Cloud>> {
    [Auth] as supabase_auth
    [PostgreSQL DB] as supabase_db
  }
  
  database "Qdrant (Planejado)" <<Cloud>> as qdrant
}

' Relações
user --> frontend : Interage com
frontend --> backend : Chama API (via Brain Client)
frontend --> supabase_auth : Autenticação
frontend --> supabase_db : Leitura/Escrita Direta (RLS)

backend --> supabase_db : Acesso Service Role
backend --> qdrant : Busca/Indexação Vetorial
backend --> dbstorage : Armazena/Lê arquivos

@enduml`}
                  </pre>
                </div>
                
                <h3 className="text-xl font-semibold mt-6 mb-3">Componentes do Sistema (Implementação Atual)</h3>
                <ol className="list-decimal pl-5 space-y-3">
                  <li>
                    <strong>Frontend (React/Vite + Shadcn UI)</strong>
                    <ul className="list-disc pl-5 mt-1 space-y-1">
                      <li>Interface de usuário construída com React e TypeScript.</li>
                      <li>Utiliza Vite para build e desenvolvimento rápido.</li>
                      <li>Componentes de UI baseados em Shadcn UI e Tailwind CSS.</li>
                      <li>Integração direta com Supabase Auth para login/logout.</li>
                      <li>Comunicação com o backend via cliente HTTP 'Brain' gerado automaticamente.</li>
                      <li>Leitura/escrita de dados no Supabase PostgreSQL diretamente do frontend, respeitando Row Level Security (RLS).</li>
                      <li>Hospedado e servido pela plataforma Databutton.</li>
                    </ul>
                  </li>
                  <li>
                    <strong>Backend (Python/FastAPI)</strong>
                    <ul className="list-disc pl-5 mt-1 space-y-1">
                      <li>API RESTful construída com FastAPI.</li>
                      <li>Fornece endpoints para operações complexas, processamento de dados e integrações seguras.</li>
                      <li>Utiliza Pydantic para validação de dados.</li>
                      <li>Interage com o Supabase PostgreSQL usando a chave de serviço (privilégios elevados).</li>
                      <li>Planejado para integrar com Qdrant para busca vetorial.</li>
                      <li>Utiliza o Databutton Storage (`db.storage`) para persistência de arquivos e dataframes.</li>
                      <li>Acessa segredos (API Keys) via `db.secrets`.</li>
                      <li>Hospedado e gerenciado pela plataforma Databutton.</li>
                    </ul>
                  </li>
                  <li>
                    <strong>Supabase (BaaS)</strong>
                    <ul className="list-disc pl-5 mt-1 space-y-1">
                      <li><strong>Autenticação:</strong> Gerencia usuários, login, registro e sessões.</li>
                      <li><strong>Banco de Dados (PostgreSQL):</strong> Armazena dados relacionais (licitações, monitoramentos, etc.). Utiliza RLS para controle de acesso do frontend.</li>
                    </ul>
                  </li>
                  <li>
                    <strong>Databutton Platform</strong>
                    <ul className="list-disc pl-5 mt-1 space-y-1">
                      <li>Ambiente de desenvolvimento integrado (Workspace).</li>
                      <li>Hospedagem gerenciada para frontend e backend.</li>
                      <li>Geração automática de cliente TypeScript (Brain).</li>
                      <li>Gerenciamento de segredos (`db.secrets`).</li>
                      <li>Armazenamento de dados (`db.storage`).</li>
                      <li>Deploy simplificado.</li>
                    </ul>
                  </li>
                  <li>
                    <strong>Qdrant (Planejado)</strong>
                    <ul className="list-disc pl-5 mt-1 space-y-1">
                      <li>Banco de dados vetorial para busca semântica por similaridade em textos de licitações.</li>
                    </ul>
                  </li>
                </ol>
              </section>
              
              <section id="configuracao" className="mb-12">
                <h2 className="text-2xl font-bold mb-4">3. Configuração e Instalação</h2>
                
                <h3 className="text-xl font-semibold mt-6 mb-3">Pré-requisitos</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Docker e Docker Compose</li>
                  <li>VPN WireGuard configurada (para conexão com Traefik)</li>
                  <li>Acesso ao Supabase</li>
                </ul>
                
                <h3 className="text-xl font-semibold mt-6 mb-3">Variáveis de Ambiente</h3>
                <p className="mb-2">As seguintes variáveis de ambiente devem ser configuradas no arquivo <code>.env</code>:</p>
                
                <div className="bg-slate-100 p-4 rounded-lg mb-6 overflow-x-auto">
                  <pre className="text-xs whitespace-pre">
                    {`# Supabase
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_ANON_KEY=sua-chave-anonima
SUPABASE_SERVICE_KEY=sua-chave-de-servico

# Configurações da Aplicação
APP_PORT=3101
API_PORT=8001

# Banco de Dados
POSTGRES_USER=postgres
POSTGRES_PASSWORD=sua-senha
POSTGRES_DB=licitaintel

# Qdrant
QDRANT_URL=http://qdrant:6333`}
                  </pre>
                </div>
                
                <h3 className="text-xl font-semibold mt-6 mb-3">Configuração do Docker Compose</h3>
                <p className="mb-2">O arquivo <code>docker-compose.yml</code> define os serviços da aplicação:</p>
                
                <div className="bg-slate-100 p-4 rounded-lg mb-6 overflow-x-auto">
                  <pre className="text-xs whitespace-pre">
                    {`version: "3.8"

services:
  backend:
    build: ./backend
    ports:
      - "8001:8000"
    environment:
      - SUPABASE_URL=\${SUPABASE_URL}
      - SUPABASE_ANON_KEY=\${SUPABASE_ANON_KEY}
      - SUPABASE_SERVICE_KEY=\${SUPABASE_SERVICE_KEY}
      - QDRANT_URL=\${QDRANT_URL}
    volumes:
      - ./backend:/app
    depends_on:
      - qdrant

  frontend:
    build: ./frontend
    ports:
      - "3101:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:8001
    volumes:
      - ./frontend:/app

  qdrant:
    image: qdrant/qdrant:latest
    ports:
      - "6333:6333"
    volumes:
      - qdrant_data:/qdrant/storage

volumes:
  qdrant_data:`}
                  </pre>
                </div>
                
                <h3 className="text-xl font-semibold mt-6 mb-3">Procedimento de Instalação</h3>
                <ol className="list-decimal pl-5 space-y-2">
                  <li>
                    Clone o repositório
                    <div className="bg-slate-100 p-2 rounded mt-1">
                      <code>git clone https://github.com/seu-usuario/licitaintel.git<br/>cd licitaintel</code>
                    </div>
                  </li>
                  <li>
                    Configure as variáveis de ambiente
                    <div className="bg-slate-100 p-2 rounded mt-1">
                      <code>cp .env.example .env<br/># Edite o arquivo .env com suas credenciais</code>
                    </div>
                  </li>
                  <li>
                    Inicie os contêineres
                    <div className="bg-slate-100 p-2 rounded mt-1">
                      <code>docker-compose up -d</code>
                    </div>
                  </li>
                  <li>
                    Inicialize o banco de dados
                    <div className="bg-slate-100 p-2 rounded mt-1">
                      <code>curl http://localhost:8001/init-database</code>
                    </div>
                  </li>
                  <li>Acesse a aplicação em <code>http://localhost:3101</code></li>
                </ol>
              </section>
              
              <section id="apis" className="mb-12">
                <h2 className="text-2xl font-bold mb-4">4. APIs e Endpoints</h2>
                
                <h3 className="text-xl font-semibold mt-6 mb-3">Autenticação</h3>
                <p className="mb-4">A autenticação é gerenciada pelo Supabase e disponibilizada no frontend.</p>
                
                <h3 className="text-xl font-semibold mt-6 mb-3">Licitações (Bids)</h3>
                
                <h4 className="text-lg font-medium mt-4 mb-2">GET /licitacoes</h4>
                <p className="mb-2">Retorna a lista de licitações com paginação e filtros.</p>
                
                <p className="mb-1 font-medium">Parâmetros de consulta:</p>
                <ul className="list-disc pl-5 mb-2">
                  <li><code>page</code>: número da página (padrão: 1)</li>
                  <li><code>limit</code>: itens por página (padrão: 10)</li>
                  <li><code>status</code>: filtro por status ("aberta", "encerrada", etc.)</li>
                </ul>
                
                <p className="mb-1 font-medium">Resposta:</p>
                <div className="bg-slate-100 p-4 rounded-lg mb-6 overflow-x-auto">
                  <pre className="text-xs whitespace-pre">
                    {`{
  "items": [
    {
      "id": 1,
      "title": "Aquisição de Equipamentos de Informática",
      "orgao": "Ministério da Saúde",
      "data_abertura": "2025-01-15T10:00:00Z",
      "data_encerramento": "2025-01-30T18:00:00Z",
      "valor_estimado": 75000.50,
      "modalidade": "Pregão Eletrônico",
      "status": "aberta",
      "numero_processo": "MS-2025-0123"
    }
  ],
  "total": 100,
  "page": 1,
  "pages": 10
}`}
                  </pre>
                </div>
                
                <h4 className="text-lg font-medium mt-4 mb-2">GET /licitacoes/{'{id}'}</h4>
                <p className="mb-2">Retorna detalhes de uma licitação específica.</p>
                
                <p className="mb-1 font-medium">Resposta:</p>
                <div className="bg-slate-100 p-4 rounded-lg mb-6 overflow-x-auto">
                  <pre className="text-xs whitespace-pre">
                    {`{
  "id": 1,
  "title": "Aquisição de Equipamentos de Informática",
  "description": "Compra de computadores e impressoras para o departamento de saúde.",
  "orgao": "Ministério da Saúde",
  "data_abertura": "2025-01-15T10:00:00Z",
  "data_encerramento": "2025-01-30T18:00:00Z",
  "valor_estimado": 75000.50,
  "modalidade": "Pregão Eletrônico",
  "status": "aberta",
  "numero_processo": "MS-2025-0123",
  "objeto": "Aquisição de computadores e impressoras para melhorar a infraestrutura de TI do departamento de saúde pública.",
  "link_edital": "https://comprasnet.gov.br/edital/MS-2025-0123"
}`}
                  </pre>
                </div>
                
                <h4 className="text-lg font-medium mt-4 mb-2">POST /bids</h4>
                <p className="mb-2">Cria uma nova licitação.</p>
                
                <p className="mb-1 font-medium">Corpo da requisição:</p>
                <div className="bg-slate-100 p-4 rounded-lg mb-6 overflow-x-auto">
                  <pre className="text-xs whitespace-pre">
                    {`{
  "title": "Novo Edital de Licitação",
  "description": "Descrição detalhada",
  "orgao": "Nome do Órgão",
  "data_abertura": "2025-05-15T10:00:00Z",
  "data_encerramento": "2025-05-30T18:00:00Z",
  "valor_estimado": 50000.00,
  "modalidade": "Pregão Eletrônico",
  "status": "aberta",
  "numero_processo": "PROC-2025-0123",
  "objeto": "Objeto detalhado da licitação",
  "link_edital": "https://exemplo.com/edital"
}`}
                  </pre>
                </div>
                
                <h3 className="text-xl font-semibold mt-6 mb-3">Monitoramento</h3>
                
                <h4 className="text-lg font-medium mt-4 mb-2">POST /monitoramento</h4>
                <p className="mb-2">Cria ou atualiza um monitoramento por palavras-chave.</p>
                
                <p className="mb-1 font-medium">Corpo da requisição:</p>
                <div className="bg-slate-100 p-4 rounded-lg mb-6 overflow-x-auto">
                  <pre className="text-xs whitespace-pre">
                    {`{
  "empresa_id": 7,
  "palavras_chave": ["servidor", "cloud", "licenciamento"]
}`}
                  </pre>
                </div>
                
                <p className="mb-1 font-medium">Resposta:</p>
                <div className="bg-slate-100 p-4 rounded-lg mb-6 overflow-x-auto">
                  <pre className="text-xs whitespace-pre">
                    {`{
  "id": 42,
  "empresa_id": 7,
  "palavras_chave": ["servidor", "cloud", "licenciamento"],
  "created_at": "2025-04-11T14:30:00Z",
  "status": "ativo"
}`}
                  </pre>
                </div>
                
                <h4 className="text-lg font-medium mt-4 mb-2">GET /monitoramentos</h4>
                <p className="mb-2">Retorna os monitoramentos ativos.</p>
                
                <p className="mb-1 font-medium">Resposta:</p>
                <div className="bg-slate-100 p-4 rounded-lg mb-6 overflow-x-auto">
                  <pre className="text-xs whitespace-pre">
                    {`[
  {
    "id": 42,
    "empresa_id": 7,
    "palavras_chave": ["servidor", "cloud", "licenciamento"],
    "created_at": "2025-04-11T14:30:00Z",
    "status": "ativo"
  }
]`}
                  </pre>
                </div>
                
                <h3 className="text-xl font-semibold mt-6 mb-3">Histórico e Projeção de Preços</h3>
                
                <h4 className="text-lg font-medium mt-4 mb-2">GET /historico-precos</h4>
                <p className="mb-2">Retorna o histórico de preços para um item específico.</p>
                
                <p className="mb-1 font-medium">Parâmetros de consulta:</p>
                <ul className="list-disc pl-5 mb-2">
                  <li><code>codigo_item</code>: código do item (obrigatório)</li>
                </ul>
                
                <p className="mb-1 font-medium">Resposta:</p>
                <div className="bg-slate-100 p-4 rounded-lg mb-6 overflow-x-auto">
                  <pre className="text-xs whitespace-pre">
                    {`{
  "codigo_item": "TI-PC-001",
  "descricao": "Computador Desktop i5 16GB RAM 512GB SSD",
  "historico": [
    {
      "data": "2024-11-10T00:00:00Z",
      "valor": 4800.00,
      "orgao": "Ministério da Saúde",
      "quantidade": 50
    },
    {
      "data": "2024-08-15T00:00:00Z",
      "valor": 5100.00,
      "orgao": "Tribunal Regional Federal",
      "quantidade": 30
    }
  ],
  "media": 4950.00,
  "desvio_padrao": 150.00,
  "tendencia": "estável"
}`}
                  </pre>
                </div>
                
                <h4 className="text-lg font-medium mt-4 mb-2">POST /licitacoes/projecao-precos</h4>
                <p className="mb-2">Retorna projeção de preços para itens de licitação.</p>
                
                <p className="mb-1 font-medium">Corpo da requisição:</p>
                <div className="bg-slate-100 p-4 rounded-lg mb-6 overflow-x-auto">
                  <pre className="text-xs whitespace-pre">
                    {`{
  "codigo_item": "TI-PC-001",
  "contexto": "compra anual saúde sudeste"
}`}
                  </pre>
                </div>
                
                <p className="mb-1 font-medium">Resposta:</p>
                <div className="bg-slate-100 p-4 rounded-lg mb-6 overflow-x-auto">
                  <pre className="text-xs whitespace-pre">
                    {`{
  "preco_estimado": 4700.00,
  "intervalo": [4500.00, 4900.00],
  "confianca": 0.91
}`}
                  </pre>
                </div>
                
                <h3 className="text-xl font-semibold mt-6 mb-3">Busca Semântica</h3>
                
                <h4 className="text-lg font-medium mt-4 mb-2">POST /bids/search</h4>
                <p className="mb-2">Realiza busca semântica nas licitações.</p>
                
                <p className="mb-1 font-medium">Corpo da requisição:</p>
                <div className="bg-slate-100 p-4 rounded-lg mb-6 overflow-x-auto">
                  <pre className="text-xs whitespace-pre">
                    {`{
  "query": "equipamentos de TI para escolas",
  "filtros": {
    "status": "aberta",
    "valor_min": 10000,
    "valor_max": 100000
  },
  "limit": 10
}`}
                  </pre>
                </div>
                
                <p className="mb-1 font-medium">Resposta:</p>
                <div className="bg-slate-100 p-4 rounded-lg mb-6 overflow-x-auto">
                  <pre className="text-xs whitespace-pre">
                    {`{
  "resultados": [
    {
      "id": 1,
      "title": "Aquisição de Equipamentos de Informática",
      "relevancia": 0.92,
      "orgao": "Ministério da Saúde",
      "data_abertura": "2025-01-15T10:00:00Z",
      "valor_estimado": 75000.50
    }
  ],
  "total": 1
}`}
                  </pre>
                </div>
              </section>
              
              <section id="banco-dados" className="mb-12">
                <h2 className="text-2xl font-bold mb-4">5. Banco de Dados</h2>
                
                <h3 className="text-xl font-semibold mt-6 mb-3">Modelo de Dados</h3>
                <p className="mb-4">O sistema utiliza o Supabase (PostgreSQL) como banco de dados principal, com as seguintes tabelas:</p>
                
                <h4 className="text-lg font-medium mt-4 mb-2">Tabela: <code>bids</code></h4>
                <div className="overflow-x-auto mb-6">
                  <table className="min-w-full border border-slate-300">
                    <thead>
                      <tr className="bg-slate-100">
                        <th className="border border-slate-300 px-4 py-2 text-left">Campo</th>
                        <th className="border border-slate-300 px-4 py-2 text-left">Tipo</th>
                        <th className="border border-slate-300 px-4 py-2 text-left">Descrição</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-slate-300 px-4 py-2">id</td>
                        <td className="border border-slate-300 px-4 py-2">integer</td>
                        <td className="border border-slate-300 px-4 py-2">ID único da licitação (PK)</td>
                      </tr>
                      <tr>
                        <td className="border border-slate-300 px-4 py-2">title</td>
                        <td className="border border-slate-300 px-4 py-2">text</td>
                        <td className="border border-slate-300 px-4 py-2">Título da licitação</td>
                      </tr>
                      <tr>
                        <td className="border border-slate-300 px-4 py-2">description</td>
                        <td className="border border-slate-300 px-4 py-2">text</td>
                        <td className="border border-slate-300 px-4 py-2">Descrição detalhada</td>
                      </tr>
                      <tr>
                        <td className="border border-slate-300 px-4 py-2">orgao</td>
                        <td className="border border-slate-300 px-4 py-2">text</td>
                        <td className="border border-slate-300 px-4 py-2">Órgão responsável</td>
                      </tr>
                      <tr>
                        <td className="border border-slate-300 px-4 py-2">data_abertura</td>
                        <td className="border border-slate-300 px-4 py-2">timestamp</td>
                        <td className="border border-slate-300 px-4 py-2">Data de abertura</td>
                      </tr>
                      <tr>
                        <td className="border border-slate-300 px-4 py-2">data_encerramento</td>
                        <td className="border border-slate-300 px-4 py-2">timestamp</td>
                        <td className="border border-slate-300 px-4 py-2">Data de encerramento</td>
                      </tr>
                      <tr>
                        <td className="border border-slate-300 px-4 py-2">valor_estimado</td>
                        <td className="border border-slate-300 px-4 py-2">numeric</td>
                        <td className="border border-slate-300 px-4 py-2">Valor estimado em reais</td>
                      </tr>
                      <tr>
                        <td className="border border-slate-300 px-4 py-2">modalidade</td>
                        <td className="border border-slate-300 px-4 py-2">text</td>
                        <td className="border border-slate-300 px-4 py-2">Modalidade da licitação</td>
                      </tr>
                      <tr>
                        <td className="border border-slate-300 px-4 py-2">status</td>
                        <td className="border border-slate-300 px-4 py-2">text</td>
                        <td className="border border-slate-300 px-4 py-2">Status (aberta, encerrada, etc.)</td>
                      </tr>
                      <tr>
                        <td className="border border-slate-300 px-4 py-2">numero_processo</td>
                        <td className="border border-slate-300 px-4 py-2">text</td>
                        <td className="border border-slate-300 px-4 py-2">Número do processo administrativo</td>
                      </tr>
                      <tr>
                        <td className="border border-slate-300 px-4 py-2">objeto</td>
                        <td className="border border-slate-300 px-4 py-2">text</td>
                        <td className="border border-slate-300 px-4 py-2">Descrição do objeto da licitação</td>
                      </tr>
                      <tr>
                        <td className="border border-slate-300 px-4 py-2">link_edital</td>
                        <td className="border border-slate-300 px-4 py-2">text</td>
                        <td className="border border-slate-300 px-4 py-2">Link para o edital completo</td>
                      </tr>
                      <tr>
                        <td className="border border-slate-300 px-4 py-2">created_at</td>
                        <td className="border border-slate-300 px-4 py-2">timestamp</td>
                        <td className="border border-slate-300 px-4 py-2">Data de criação do registro</td>
                      </tr>
                      <tr>
                        <td className="border border-slate-300 px-4 py-2">updated_at</td>
                        <td className="border border-slate-300 px-4 py-2">timestamp</td>
                        <td className="border border-slate-300 px-4 py-2">Data da última atualização</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <h4 className="text-lg font-medium mt-4 mb-2">Tabela: <code>monitorings</code></h4>
                <div className="overflow-x-auto mb-6">
                  <table className="min-w-full border border-slate-300">
                    <thead>
                      <tr className="bg-slate-100">
                        <th className="border border-slate-300 px-4 py-2 text-left">Campo</th>
                        <th className="border border-slate-300 px-4 py-2 text-left">Tipo</th>
                        <th className="border border-slate-300 px-4 py-2 text-left">Descrição</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-slate-300 px-4 py-2">id</td>
                        <td className="border border-slate-300 px-4 py-2">integer</td>
                        <td className="border border-slate-300 px-4 py-2">ID único do monitoramento (PK)</td>
                      </tr>
                      <tr>
                        <td className="border border-slate-300 px-4 py-2">empresa_id</td>
                        <td className="border border-slate-300 px-4 py-2">integer</td>
                        <td className="border border-slate-300 px-4 py-2">ID da empresa (FK para profiles)</td>
                      </tr>
                      <tr>
                        <td className="border border-slate-300 px-4 py-2">palavras_chave</td>
                        <td className="border border-slate-300 px-4 py-2">text[]</td>
                        <td className="border border-slate-300 px-4 py-2">Array de palavras-chave</td>
                      </tr>
                      <tr>
                        <td className="border border-slate-300 px-4 py-2">status</td>
                        <td className="border border-slate-300 px-4 py-2">text</td>
                        <td className="border border-slate-300 px-4 py-2">Status do monitoramento</td>
                      </tr>
                      <tr>
                        <td className="border border-slate-300 px-4 py-2">created_at</td>
                        <td className="border border-slate-300 px-4 py-2">timestamp</td>
                        <td className="border border-slate-300 px-4 py-2">Data de criação</td>
                      </tr>
                      <tr>
                        <td className="border border-slate-300 px-4 py-2">updated_at</td>
                        <td className="border border-slate-300 px-4 py-2">timestamp</td>
                        <td className="border border-slate-300 px-4 py-2">Data da última atualização</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <h4 className="text-lg font-medium mt-4 mb-2">Tabela: <code>price_history</code></h4>
                <div className="overflow-x-auto mb-6">
                  <table className="min-w-full border border-slate-300">
                    <thead>
                      <tr className="bg-slate-100">
                        <th className="border border-slate-300 px-4 py-2 text-left">Campo</th>
                        <th className="border border-slate-300 px-4 py-2 text-left">Tipo</th>
                        <th className="border border-slate-300 px-4 py-2 text-left">Descrição</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-slate-300 px-4 py-2">id</td>
                        <td className="border border-slate-300 px-4 py-2">integer</td>
                        <td className="border border-slate-300 px-4 py-2">ID único do registro (PK)</td>
                      </tr>
                      <tr>
                        <td className="border border-slate-300 px-4 py-2">codigo_item</td>
                        <td className="border border-slate-300 px-4 py-2">text</td>
                        <td className="border border-slate-300 px-4 py-2">Código do item</td>
                      </tr>
                      <tr>
                        <td className="border border-slate-300 px-4 py-2">descricao_item</td>
                        <td className="border border-slate-300 px-4 py-2">text</td>
                        <td className="border border-slate-300 px-4 py-2">Descrição do item</td>
                      </tr>
                      <tr>
                        <td className="border border-slate-300 px-4 py-2">data_licitacao</td>
                        <td className="border border-slate-300 px-4 py-2">timestamp</td>
                        <td className="border border-slate-300 px-4 py-2">Data da licitação</td>
                      </tr>
                      <tr>
                        <td className="border border-slate-300 px-4 py-2">orgao</td>
                        <td className="border border-slate-300 px-4 py-2">text</td>
                        <td className="border border-slate-300 px-4 py-2">Órgão responsável</td>
                      </tr>
                      <tr>
                        <td className="border border-slate-300 px-4 py-2">valor_unitario</td>
                        <td className="border border-slate-300 px-4 py-2">numeric</td>
                        <td className="border border-slate-300 px-4 py-2">Valor unitário em reais</td>
                      </tr>
                      <tr>
                        <td className="border border-slate-300 px-4 py-2">quantidade</td>
                        <td className="border border-slate-300 px-4 py-2">integer</td>
                        <td className="border border-slate-300 px-4 py-2">Quantidade adquirida</td>
                      </tr>
                      <tr>
                        <td className="border border-slate-300 px-4 py-2">vencedor</td>
                        <td className="border border-slate-300 px-4 py-2">text</td>
                        <td className="border border-slate-300 px-4 py-2">Empresa vencedora</td>
                      </tr>
                      <tr>
                        <td className="border border-slate-300 px-4 py-2">regiao</td>
                        <td className="border border-slate-300 px-4 py-2">text</td>
                        <td className="border border-slate-300 px-4 py-2">Região do país</td>
                      </tr>
                      <tr>
                        <td className="border border-slate-300 px-4 py-2">uf</td>
                        <td className="border border-slate-300 px-4 py-2">text</td>
                        <td className="border border-slate-300 px-4 py-2">Estado (UF)</td>
                      </tr>
                      <tr>
                        <td className="border border-slate-300 px-4 py-2">created_at</td>
                        <td className="border border-slate-300 px-4 py-2">timestamp</td>
                        <td className="border border-slate-300 px-4 py-2">Data de criação do registro</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <h4 className="text-lg font-medium mt-4 mb-2">Tabela: <code>price_projections</code></h4>
                <div className="overflow-x-auto mb-6">
                  <table className="min-w-full border border-slate-300">
                    <thead>
                      <tr className="bg-slate-100">
                        <th className="border border-slate-300 px-4 py-2 text-left">Campo</th>
                        <th className="border border-slate-300 px-4 py-2 text-left">Tipo</th>
                        <th className="border border-slate-300 px-4 py-2 text-left">Descrição</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-slate-300 px-4 py-2">id</td>
                        <td className="border border-slate-300 px-4 py-2">integer</td>
                        <td className="border border-slate-300 px-4 py-2">ID único da projeção (PK)</td>
                      </tr>
                      <tr>
                        <td className="border border-slate-300 px-4 py-2">codigo_item</td>
                        <td className="border border-slate-300 px-4 py-2">text</td>
                        <td className="border border-slate-300 px-4 py-2">Código do item</td>
                      </tr>
                      <tr>
                        <td className="border border-slate-300 px-4 py-2">preco_estimado</td>
                        <td className="border border-slate-300 px-4 py-2">numeric</td>
                        <td className="border border-slate-300 px-4 py-2">Preço estimado</td>
                      </tr>
                      <tr>
                        <td className="border border-slate-300 px-4 py-2">intervalo_min</td>
                        <td className="border border-slate-300 px-4 py-2">numeric</td>
                        <td className="border border-slate-300 px-4 py-2">Valor mínimo do intervalo</td>
                      </tr>
                      <tr>
                        <td className="border border-slate-300 px-4 py-2">intervalo_max</td>
                        <td className="border border-slate-300 px-4 py-2">numeric</td>
                        <td className="border border-slate-300 px-4 py-2">Valor máximo do intervalo</td>
                      </tr>
                      <tr>
                        <td className="border border-slate-300 px-4 py-2">confianca</td>
                        <td className="border border-slate-300 px-4 py-2">numeric</td>
                        <td className="border border-slate-300 px-4 py-2">Grau de confiança (0-1)</td>
                      </tr>
                      <tr>
                        <td className="border border-slate-300 px-4 py-2">contexto</td>
                        <td className="border border-slate-300 px-4 py-2">text</td>
                        <td className="border border-slate-300 px-4 py-2">Contexto da projeção</td>
                      </tr>
                      <tr>
                        <td className="border border-slate-300 px-4 py-2">created_at</td>
                        <td className="border border-slate-300 px-4 py-2">timestamp</td>
                        <td className="border border-slate-300 px-4 py-2">Data de criação da projeção</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <h4 className="text-lg font-medium mt-4 mb-2">Tabela: <code>profiles</code></h4>
                <div className="overflow-x-auto mb-6">
                  <table className="min-w-full border border-slate-300">
                    <thead>
                      <tr className="bg-slate-100">
                        <th className="border border-slate-300 px-4 py-2 text-left">Campo</th>
                        <th className="border border-slate-300 px-4 py-2 text-left">Tipo</th>
                        <th className="border border-slate-300 px-4 py-2 text-left">Descrição</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-slate-300 px-4 py-2">id</td>
                        <td className="border border-slate-300 px-4 py-2">uuid</td>
                        <td className="border border-slate-300 px-4 py-2">ID único do perfil (PK)</td>
                      </tr>
                      <tr>
                        <td className="border border-slate-300 px-4 py-2">user_id</td>
                        <td className="border border-slate-300 px-4 py-2">uuid</td>
                        <td className="border border-slate-300 px-4 py-2">ID do usuário no Supabase Auth</td>
                      </tr>
                      <tr>
                        <td className="border border-slate-300 px-4 py-2">nome_empresa</td>
                        <td className="border border-slate-300 px-4 py-2">text</td>
                        <td className="border border-slate-300 px-4 py-2">Nome da empresa</td>
                      </tr>
                      <tr>
                        <td className="border border-slate-300 px-4 py-2">cnpj</td>
                        <td className="border border-slate-300 px-4 py-2">text</td>
                        <td className="border border-slate-300 px-4 py-2">CNPJ da empresa</td>
                      </tr>
                      <tr>
                        <td className="border border-slate-300 px-4 py-2">segmento</td>
                        <td className="border border-slate-300 px-4 py-2">text</td>
                        <td className="border border-slate-300 px-4 py-2">Segmento de atuação</td>
                      </tr>
                      <tr>
                        <td className="border border-slate-300 px-4 py-2">created_at</td>
                        <td className="border border-slate-300 px-4 py-2">timestamp</td>
                        <td className="border border-slate-300 px-4 py-2">Data de criação</td>
                      </tr>
                      <tr>
                        <td className="border border-slate-300 px-4 py-2">updated_at</td>
                        <td className="border border-slate-300 px-4 py-2">timestamp</td>
                        <td className="border border-slate-300 px-4 py-2">Data da última atualização</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <h3 className="text-xl font-semibold mt-6 mb-3">Banco de Dados Vetorial (Qdrant)</h3>
                <p className="mb-4">O Qdrant é utilizado para armazenar e buscar vetores de texto, permitindo a busca semântica. A coleção principal é:</p>
                
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong>bids_embeddings</strong>: Armazena os embeddings dos textos das licitações para busca por similaridade</li>
                </ul>
              </section>
              
              <section id="autenticacao" className="mb-12">
                <h2 className="text-2xl font-bold mb-4">6. Fluxo de Autenticação</h2>
                
                <p className="mb-4">O sistema utiliza o Supabase Auth para autenticação. Abaixo está o fluxo completo:</p>
                
                <h3 className="text-xl font-semibold mt-6 mb-3">Diagrama de Fluxo de Autenticação</h3>
                
                <div className="bg-slate-100 p-4 rounded-lg mb-6 overflow-x-auto">
                  <pre className="text-xs whitespace-pre">
                    {`┌─────────┐     ┌─────────┐     ┌─────────────┐     ┌─────────────┐
|         |     |         |     |             |     |             |
| Usuário |────>| Frontend|────>| Supabase Auth|────>| Supabase DB |
|         |     |         |     |             |     |             |
└─────────┘     └─────────┘     └─────────────┘     └─────────────┘
     |              |                   |                  |
     |              |                   |                  |
     |              |                   |                  |
     |              |<──────────────────┘                  |
     |              |                                      |
     |              |<──────────────────────────────────────┘
     |              |
     └<─────────────┘`}
                  </pre>
                </div>
                
                <h3 className="text-xl font-semibold mt-6 mb-3">Processos de Autenticação</h3>
                
                <h4 className="text-lg font-medium mt-4 mb-2">Registro de Usuário</h4>
                <ol className="list-decimal pl-5 space-y-1">
                  <li>Usuário acessa a página de cadastro</li>
                  <li>Preenche email e senha</li>
                  <li>Frontend chama <code>supabase.auth.signUp()</code></li>
                  <li>Supabase cria o usuário e envia email de confirmação</li>
                  <li>Após confirmação, o usuário é redirecionado para a página de login</li>
                </ol>
                
                <h4 className="text-lg font-medium mt-4 mb-2">Login</h4>
                <ol className="list-decimal pl-5 space-y-1">
                  <li>Usuário acessa a página de login</li>
                  <li>Preenche email e senha</li>
                  <li>Frontend chama <code>supabase.auth.signInWithPassword()</code></li>
                  <li>Supabase autentica e retorna token JWT</li>
                  <li>Frontend armazena o token e redireciona para o dashboard</li>
                </ol>
                
                <h4 className="text-lg font-medium mt-4 mb-2">Verificação de Autenticação</h4>
                <ol className="list-decimal pl-5 space-y-1">
                  <li>Ao carregar a aplicação, o AppProvider verifica a sessão</li>
                  <li>Usa <code>supabase.auth.getSession()</code> para verificar token válido</li>
                  <li>Se autenticado, carrega os dados do usuário</li>
                  <li>Se não, redireciona para login quando necessário</li>
                </ol>
                
                <h4 className="text-lg font-medium mt-4 mb-2">Logout</h4>
                <ol className="list-decimal pl-5 space-y-1">
                  <li>Usuário clica em "Sair"</li>
                  <li>Frontend chama <code>supabase.auth.signOut()</code></li>
                  <li>Remove tokens e redireciona para página inicial</li>
                </ol>
              </section>
              
              <section id="guias" className="mb-12">
                <h2 className="text-2xl font-bold mb-4">7. Guias do Usuário</h2>
                
                <h3 className="text-xl font-semibold mt-6 mb-3">Frontend (Para Usuários Finais)</h3>
                
                <h4 className="text-lg font-medium mt-4 mb-2">Dashboard</h4>
                <p className="mb-2">
                  O dashboard é a página principal após o login, mostrando:
                </p>
                <ul className="list-disc pl-5 mb-4">
                  <li>Lista de licitações abertas</li>
                  <li>Monitoramentos ativos</li>
                  <li>Estatísticas e gráficos</li>
                </ul>
                
                <p className="font-medium">Como usar:</p>
                <ol className="list-decimal pl-5 mb-4">
                  <li>Acesse o sistema com seu login e senha</li>
                  <li>Na página inicial, visualize licitações recentes e monitoramentos</li>
                  <li>Use os filtros para refinar resultados</li>
                  <li>Clique nas licitações para ver detalhes</li>
                </ol>
                
                <h4 className="text-lg font-medium mt-4 mb-2">Busca de Licitações</h4>
                <ol className="list-decimal pl-5 mb-4">
                  <li>Utilize a barra de busca no topo da página</li>
                  <li>Digite termos relacionados ao que procura (ex: "equipamentos médicos")</li>
                  <li>Refine resultados usando filtros de data, valor, modalidade</li>
                  <li>Clique nos resultados para mais detalhes</li>
                </ol>
                
                <h4 className="text-lg font-medium mt-4 mb-2">Configuração de Monitoramentos</h4>
                <ol className="list-decimal pl-5 mb-4">
                  <li>Acesse a seção "Monitoramentos"</li>
                  <li>Clique em "Novo Monitoramento"</li>
                  <li>Adicione palavras-chave para acompanhar</li>
                  <li>Configure alertas de email (opcional)</li>
                  <li>Salve o monitoramento</li>
                </ol>
                
                <h3 className="text-xl font-semibold mt-6 mb-3">Backend (Para Desenvolvedores)</h3>
                
                <h4 className="text-lg font-medium mt-4 mb-2">Configuração de Desenvolvimento</h4>
                <ol className="list-decimal pl-5 mb-4">
                  <li>Clone o repositório</li>
                  <li>Configure variáveis de ambiente</li>
                  <li>
                    Instale dependências:
                    <div className="bg-slate-100 p-2 rounded my-1">
                      <code>cd backend<br/>pip install -r requirements.txt</code>
                    </div>
                  </li>
                  <li>
                    Execute o servidor:
                    <div className="bg-slate-100 p-2 rounded my-1">
                      <code>uvicorn main:app --reload</code>
                    </div>
                  </li>
                </ol>
                
                <h4 className="text-lg font-medium mt-4 mb-2">Adicionando Novos Endpoints</h4>
                <ol className="list-decimal pl-5 mb-4">
                  <li>Crie um novo arquivo no diretório <code>/app/apis/</code></li>
                  <li>
                    Defina um router FastAPI:
                    <div className="bg-slate-100 p-2 rounded my-1">
                      <pre className="text-xs">
                        {`from fastapi import APIRouter

router = APIRouter()

@router.get("/my-endpoint")
def get_data():
    return {"data": "value"}`}
                      </pre>
                    </div>
                  </li>
                  <li>O sistema carregará automaticamente seu endpoint</li>
                </ol>
                
                <h4 className="text-lg font-medium mt-4 mb-2">Trabalhando com Supabase</h4>
                <ol className="list-decimal pl-5 mb-4">
                  <li>
                    Importe o cliente Supabase:
                    <div className="bg-slate-100 p-2 rounded my-1">
                      <code>from app.apis.supabase_helper import supabase</code>
                    </div>
                  </li>
                  <li>
                    Use o cliente para operações:
                    <div className="bg-slate-100 p-2 rounded my-1">
                      <pre className="text-xs">
                        {`# Selecionar dados
result = supabase.select("bids", filters={"status": "aberta"})

# Inserir dados
supabase.insert("bids", {"title": "Nova Licitação", ...})`}
                      </pre>
                    </div>
                  </li>
                </ol>
              </section>
              
              <section id="desenvolvimento" className="mb-12">
                <h2 className="text-2xl font-bold mb-4">8. Processos de Desenvolvimento e Deploy</h2>
                
                <h3 className="text-xl font-semibold mt-6 mb-3">Fluxo de Desenvolvimento</h3>
                <ol className="list-decimal pl-5 space-y-2 mb-6">
                  <li>
                    <strong>Desenvolvimento local</strong>
                    <ul className="list-disc pl-5 mt-1">
                      <li>Use ambientes de desenvolvimento locais com Docker</li>
                      <li>Teste mudanças antes de commit</li>
                    </ul>
                  </li>
                  <li>
                    <strong>Controle de versão</strong>
                    <ul className="list-disc pl-5 mt-1">
                      <li>Utilize Git para controle de versão</li>
                      <li>Faça commits com mensagens descritivas</li>
                      <li>Use branches para novas funcionalidades</li>
                    </ul>
                  </li>
                  <li>
                    <strong>Revisão de código</strong>
                    <ul className="list-disc pl-5 mt-1">
                      <li>Faça revisão de código antes de merge</li>
                      <li>Verifique qualidade e teste antes de aceitar PRs</li>
                    </ul>
                  </li>
                </ol>
                
                <h3 className="text-xl font-semibold mt-6 mb-3">Deploy Automático</h3>
                <p className="mb-4">O sistema utiliza GitHub Actions para deploy automático:</p>
                
                <ol className="list-decimal pl-5 mb-4">
                  <li>Push para branch <code>main</code> inicia deploy</li>
                  <li>GitHub Actions conecta ao VPS via SSH</li>
                  <li>Puxa mudanças do repositório</li>
                  <li>Reconstrói e reinicia contêineres Docker</li>
                </ol>
                
                <p className="mb-2">Arquivo <code>.github/workflows/deploy.yml</code>:</p>
                <div className="bg-slate-100 p-4 rounded-lg mb-6 overflow-x-auto">
                  <pre className="text-xs whitespace-pre">
                    {`name: Deploy Full Stack (Contabo)

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Connect and deploy to VPS
        uses: appleboy/ssh-action@v1.0.0
        with:
          host: \${{ secrets.CONTABO_HOST }}
          username: \${{ secrets.CONTABO_USER }}
          key: \${{ secrets.CONTABO_SSH_KEY }}
          script: |
            cd /opt/licitacoes-inteligentes
            git pull
            bash deploy_full_stack_verified.sh`}
                  </pre>
                </div>
                
                <h3 className="text-xl font-semibold mt-6 mb-3">Monitoramento e Manutenção</h3>
                <ol className="list-decimal pl-5 space-y-2 mb-6">
                  <li>
                    <strong>Logs do sistema</strong>
                    <ul className="list-disc pl-5 mt-1">
                      <li>Logs são armazenados nos contêineres Docker</li>
                      <li>Acesse com <code>docker logs [container-id]</code></li>
                    </ul>
                  </li>
                  <li>
                    <strong>Backups</strong>
                    <ul className="list-disc pl-5 mt-1">
                      <li>Backup automatizado do banco de dados</li>
                      <li>Script de backup diário às 03:00 BRT</li>
                    </ul>
                  </li>
                  <li>
                    <strong>Atualizações de segurança</strong>
                    <ul className="list-disc pl-5 mt-1">
                      <li>Implemente atualizações críticas imediatamente</li>
                      <li>Planeje atualizações regulares mensais</li>
                    </ul>
                  </li>
                </ol>
              </section>
              
              <div className="border-t border-gray-200 pt-8 mt-12">
                <h2 className="text-xl font-bold mb-4">Considerações Finais</h2>
                <p className="mb-4">
                  Esta documentação fornece uma visão abrangente do LicitaIntel, cobrindo arquitetura, configuração, APIs, banco de dados, fluxos de autenticação e guias para usuários e desenvolvedores. Para informações mais específicas ou atualizadas, consulte o repositório do projeto ou entre em contato com a equipe de desenvolvimento.
                </p>
                <p className="text-sm text-gray-600">Documento atualizado em: 11 de Abril de 2025</p>
              </div>
            </article>
          </CardContent>
        </Card>
      </main>
      
      <Footer />
    </div>
    </ProtectedRoute>
  );
}
