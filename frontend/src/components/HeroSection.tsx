import React from "react";

// Keep Props interface for consistency, though not used in this minimal version
export interface Props {
  onTryFreeClick?: () => void;
}

export const HeroSection = ({ onTryFreeClick }: Props) => {
  return (
    <section className="w-full py-12 bg-background">
      <div className="container px-4 md:px-6">
        <h1>Hero Section Base Test</h1>
      </div>
    </section>
  );
};