import React from 'react';
import { Button } from '@/components/ui/button'; // Import Shadcn Button
import { useNavigate } from 'react-router-dom'; // For navigation

/**
 * NewHomePage component - Conversion-focused landing page for LicitaIntel.
 * This will replace the default LoggedOutView in App.tsx.
 */
export default function NewHomePage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* Navigation Placeholder (Optional - Can be added later) */}
      <header className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold">LicitaIntel</div>
        <Button variant="ghost" onClick={() => navigate('/login')}>Entrar</Button>
      </header>

      {/* Hero Section */}
      <section className="flex-grow flex items-center bg-gradient-to-b from-background to-muted/30 py-20 md:py-32">
        <div className="container mx-auto px-4 text-center">
          {/* Headline - Assuming default sans-serif is geometric enough or adjust later */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-tight">
            Domine as Licitações Públicas com Inteligência Artificial
          </h1>
          {/* Sub-headline - Legible sans-serif */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-10">
            Monitore, analise e preveja resultados para conquistar mais contratos com o governo brasileiro.
          </p>
          {/* CTAs */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Button size="lg" onClick={() => navigate('/signup')} className="w-full sm:w-auto">
              Comece Agora Gratuitamente
            </Button>
            <Button size="lg" variant="outline" onClick={() => {/* Scroll to features or navigate */}} className="w-full sm:w-auto">
              Ver Funcionalidades
            </Button>
          </div>
          {/* Placeholder for Visual Element Below CTAs (Optional) */}
          {/* 
          <div className="mt-16">
            <div className="aspect-video bg-muted rounded-lg max-w-4xl mx-auto shadow-md">
              {/* Placeholder Content or Image */}
              {/* <p className="text-muted-foreground p-4">Visual Placeholder</p> */}
            {/* </div>
          </div> 
          */}
        </div>
      </section>

      {/* Other sections will be added below */}
      
    </div>
  );
}
