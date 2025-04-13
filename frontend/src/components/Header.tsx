import React from "react";
import { Button } from "@/components/ui/button";

export interface Props {
  onLoginClick?: () => void;
  onSignupClick?: () => void;
}

export const Header = ({ onLoginClick, onSignupClick }: Props) => {
  return (
    <header className="py-4 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full">
      <div className="container flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img 
            src="https://static.databutton.com/public/b0f21410-4110-4dce-8299-bbb7eb8cec66/background_removed_image_tdap0tSnSP2ATtmSrpDoBQ.png" 
            alt="LicitaIntel Logo" 
            className="h-10 w-auto" 
          />
          <span className="font-bold text-xl">LicitaIntel</span>
        </div>
        
        <nav className="hidden md:flex items-center space-x-6">
          <a href="#features" className="text-foreground/80 hover:text-foreground transition-colors">
            Recursos
          </a>
          <a href="#pricing" className="text-foreground/80 hover:text-foreground transition-colors">
            Preços
          </a>
          <a href="#about" className="text-foreground/80 hover:text-foreground transition-colors">
            Sobre
          </a>
          <a href="/documentacao" className="text-foreground/80 hover:text-foreground transition-colors">
            Documentação
          </a>
        </nav>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={onLoginClick}>Entrar</Button>
          <Button onClick={onSignupClick}>Criar Conta</Button>
        </div>
      </div>
    </header>
  );
};
