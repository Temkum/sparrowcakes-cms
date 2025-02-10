'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@/components/ui/carousel';
import { slides } from '@/utilities/data';

export default function HeroSlider() {
  const [api, setApi] = useState<CarouselApi | null>();
  const [current, setCurrent] = useState(0);
  //   const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!api) return;

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap());
    });

    const timer = setInterval(() => {
      api.scrollNext();
    }, 5000); // Auto-slide every 5 seconds

    return () => clearInterval(timer);
  }, [api]);

  return (
    <div
      className="relative min-h-[80vh] transition-colors duration-500"
      style={{ backgroundColor: slides[current].backgroundColor }}
    >
      <Carousel setApi={setApi} className="w-full">
        <CarouselContent>
          {slides.map((slide, index) => (
            <CarouselItem key={index}>
              <div className="container mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 min-h-[80vh] items-center">
                  {/* Content */}
                  <div className="space-y-6 p-8">
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-500 font-bold text-xl">
                        {slide.tagPercentage}
                      </span>
                      <span className="text-gray-900 font-medium">
                        {slide.tag}
                      </span>
                    </div>
                    <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                      {slide.title}
                    </h1>
                    <p className="text-gray-600 text-lg max-w-lg">
                      {slide.description}
                    </p>
                    <Button className="bg-emerald-500 hover:bg-emerald-600">
                      Shop Now
                    </Button>
                  </div>

                  {/* Image */}
                  <div className="relative flex justify-center items-center p-8">
                    <div className="relative w-[80%] h-[80%] rounded-full overflow-hidden">
                      <div className="absolute inset-0 rounded-full bg-black/5" />
                      <img
                        src={slide.image || '/placeholder.svg'}
                        alt={slide.tag}
                        className="w-full h-full object-cover relative z-10"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* Navigation Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => api?.scrollTo(index)}
            className={`w-2 h-2 rounded-full transition-colors ${
              current === index ? 'bg-emerald-500' : 'bg-gray-300'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
