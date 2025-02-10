'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@/components/ui/carousel';

interface Slide {
  tag: string;
  tagPercentage: string;
  title: string;
  description: string;
  image: string;
  backgroundColor: string;
}

const slides: Slide[] = [
  {
    tag: 'Organic Vegetables',
    tagPercentage: '100%',
    title: 'The best way to stuff your wallet.',
    description:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Amet reiciendis beatae consequuntur.',
    image: '/assets/images/banner.jpg',
    backgroundColor: '#f8e7dd',
  },
  {
    tag: 'Fresh Fruits',
    tagPercentage: '100%',
    title: 'Natural and healthy fruits for you.',
    description:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Amet reiciendis beatae consequuntur.',
    image: '/assets/images/banner-2.jpg',
    backgroundColor: '#e7f8dd',
  },
  {
    tag: 'Organic Products',
    tagPercentage: '100%',
    title: 'The best organic products selection.',
    description:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Amet reiciendis beatae consequuntur.',
    image: '/assets/images/banner-3.png',
    backgroundColor: '#dde7f8',
  },
  {
    tag: 'Organic Products',
    tagPercentage: '100%',
    title: 'The best organic products selection.',
    description:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Amet reiciendis beatae consequuntur.',
    image: '/assets/images/banner-2.jpg',
    backgroundColor: '#dde7f8',
  },
];

export default function HeroSlider() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  const scrollNext = useCallback(() => {
    if (api) {
      api.scrollNext();
    }
  }, [api]);

  useEffect(() => {
    if (!api) return;

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  useEffect(() => {
    const timer = setInterval(() => {
      scrollNext();
    }, 5000); // Auto-slide every 5 seconds

    return () => clearInterval(timer);
  }, [scrollNext]);

  return (
    <div className="relative h-[80vh] overflow-hidden">
      <Carousel setApi={setApi} className="w-full h-full">
        <CarouselContent>
          {slides.map((slide, index) => (
            <CarouselItem key={index} className="relative w-full h-[80vh]">
              {/* Background Image */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-opacity duration-500 h-[80vh]"
                style={{
                  backgroundImage: `url(${slide.image})`,
                }}
              />

              {/* Overlay */}
              <div
                className="absolute inset-0 transition-colors duration-500 md:hidden lg:hidden sm:block"
                style={{ backgroundColor: `${slide.backgroundColor}80` }}
              />

              {/* Content */}
              <div className="relative z-10 h-full flex items-center">
                <div className="container mx-auto px-4">
                  <div className="max-w-2xl space-y-6">
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
                    <p className="text-gray-700 text-lg max-w-lg">
                      {slide.description}
                    </p>
                    <Button className="bg-emerald-500 hover:bg-black hover:text-white">
                      Shop Now
                    </Button>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* Navigation Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => api?.scrollTo(index)}
            className={`w-4 h-4 rounded-full transition-colors ${
              current === index ? 'bg-emerald-500' : 'bg-gray-300'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
