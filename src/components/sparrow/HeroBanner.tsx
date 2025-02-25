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
    tag: 'Seasonal Cakes',
    tagPercentage: '20% OFF',
    title: 'Celebrate with our seasonal cakes!',
    description:
      'Enjoy our delicious seasonal cakes made with the freshest ingredients. Perfect for any celebration.',
    image: '/assets/images/banner.jpg',
    backgroundColor: '#ffe5e5',
  },
  {
    tag: 'Custom Cakes',
    tagPercentage: '15% OFF',
    title: 'Create your dream cake with us!',
    description:
      'Design your own cake for any occasion. Our custom cakes are made to order with your favorite flavors and decorations.',
    image: '/assets/images/banner-2.jpg',
    backgroundColor: '#e5f7ff',
  },
  {
    tag: 'Wedding Cakes',
    tagPercentage: '10% OFF',
    title: 'Make your special day unforgettable!',
    description:
      'Our wedding cakes are crafted with love and attention to detail. Choose from a variety of designs and flavors.',
    image: '/assets/images/banner-3.jpg',
    backgroundColor: '#fff5e5',
  },
  {
    tag: 'Birthday Cakes',
    tagPercentage: '25% OFF',
    title: 'Celebrate your birthday with a bang!',
    description:
      'Our birthday cakes are perfect for any age. Choose from a wide range of themes and flavors to make your day extra special.',
    image: '/assets/images/banner-2.jpg',
    backgroundColor: '#e5ffe5',
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
      <Carousel
        setApi={setApi}
        className="w-full h-full"
        opts={{
          align: 'start',
          loop: true,
        }}
      >
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
