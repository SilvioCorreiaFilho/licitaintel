import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

export interface CarouselItem {
  title: string;
  description: string;
  image: string;
  bgColor: string;
}

export interface Props {
  items: CarouselItem[];
  autoPlay?: boolean;
  interval?: number;
}

export const Carousel = ({ items, autoPlay = true, interval = 5000 }: Props) => {
  const [activeIndex, setActiveIndex] = useState(0);
  
  const nextSlide = () => {
    setActiveIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));
  };
  
  const prevSlide = () => {
    setActiveIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1));
  };
  
  useEffect(() => {
    if (!autoPlay) return;
    
    const timer = setInterval(() => {
      nextSlide();
    }, interval);
    
    return () => clearInterval(timer);
  }, [activeIndex, autoPlay, interval]);
  
  return (
    <div className="relative overflow-hidden rounded-xl h-[400px] md:h-[500px]">
      {/* Slides */}
      {items.map((item, index) => (
        <div 
          key={index}
          className={`absolute inset-0 flex flex-col md:flex-row items-center transition-opacity duration-700 ease-in-out ${activeIndex === index ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
          style={{ backgroundColor: item.bgColor }}
        >
          <div className="flex-1 p-8 md:p-12 text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{item.title}</h2>
            <p className="text-lg mb-6 text-white/90">{item.description}</p>
          </div>
          <div className="flex-1 p-6 flex items-center justify-center h-full">
            <img 
              src={item.image} 
              alt={item.title} 
              className="max-h-full max-w-full object-contain drop-shadow-xl rounded"
            />
          </div>
        </div>
      ))}
      
      {/* Navigation Controls */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2 z-20">
        {items.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={`w-3 h-3 rounded-full ${activeIndex === index ? 'bg-white' : 'bg-white/50'}`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
      
      {/* Next/Prev Buttons */}
      <Button 
        size="icon" 
        variant="secondary" 
        onClick={prevSlide} 
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 opacity-70 hover:opacity-100"
        aria-label="Previous slide"
      >
        <ArrowLeft className="h-4 w-4" />
      </Button>
      
      <Button 
        size="icon" 
        variant="secondary" 
        onClick={nextSlide} 
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 opacity-70 hover:opacity-100"
        aria-label="Next slide"
      >
        <ArrowRight className="h-4 w-4" />
      </Button>
    </div>
  );
};
