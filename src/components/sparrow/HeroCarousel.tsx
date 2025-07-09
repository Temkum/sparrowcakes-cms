import React, { useState, useEffect, useCallback } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Star,
  Zap,
  Shield,
  Crown,
  Sparkles,
  Heart,
} from 'lucide-react';

const HeroCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const slides1 = [
    {
      id: 1,
      discount: '25% Off Today',
      headline: 'Premium Wireless Headphones',
      description:
        'Experience crystal-clear audio with our flagship noise-canceling headphones. Perfect for music lovers and professionals.',
      image:
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=600&fit=crop&crop=center',
      dominantColor: 'bg-gradient-to-r from-purple-600 to-blue-600',
      icon: <Star className="w-4 h-4" />,
    },
    {
      id: 2,
      discount: '30% Off Limited',
      headline: 'Smart Fitness Tracker',
      description:
        'Track your health, monitor your progress, and achieve your fitness goals with advanced biometric sensors.',
      image:
        'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=800&h=600&fit=crop&crop=center',
      dominantColor: 'bg-gradient-to-r from-green-600 to-teal-600',
      icon: <Zap className="w-4 h-4" />,
    },
    {
      id: 3,
      discount: '20% Off Flash Sale',
      headline: 'Ultra-Secure Laptop',
      description:
        'Professional-grade security meets cutting-edge performance. Built for creators and business professionals.',
      image:
        'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&h=600&fit=crop&crop=center',
      dominantColor: 'bg-gradient-to-r from-slate-700 to-slate-900',
      icon: <Shield className="w-4 h-4" />,
    },
    {
      id: 4,
      discount: '35% Off Exclusive',
      headline: 'Luxury Smartwatch',
      description:
        'Elegance meets innovation. Premium materials and advanced features for the discerning individual.',
      image:
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=600&fit=crop&crop=center',
      dominantColor: 'bg-gradient-to-r from-amber-600 to-orange-600',
      icon: <Crown className="w-4 h-4" />,
    },
    {
      id: 5,
      discount: '40% Off Today Only',
      headline: 'Gaming Mechanical Keyboard',
      description:
        'Professional gaming performance with RGB lighting and tactile switches. Dominate every game.',
      image:
        'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&h=600&fit=crop&crop=center',
      dominantColor: 'bg-gradient-to-r from-red-600 to-pink-600',
      icon: <Sparkles className="w-4 h-4" />,
    },
    {
      id: 6,
      discount: '50% Off Special',
      headline: 'Wellness Essential Kit',
      description:
        'Complete wellness solution with aromatherapy, meditation tools, and premium self-care products.',
      image:
        'https://images.unsplash.com/photo-1540553016722-983e48a2cd10?w=800&h=600&fit=crop&crop=center',
      dominantColor: 'bg-gradient-to-r from-rose-500 to-pink-500',
      icon: <Heart className="w-4 h-4" />,
    },
  ];

  const slides = [
    {
      id: 1,
      discount: '25% Off Today',
      headline: 'Artisan Chocolate Cake',
      description:
        'Decadent layers of rich chocolate cake with silky ganache frosting. Made with premium Belgian chocolate daily.',
      image:
        'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&h=600&fit=crop&crop=center',
      dominantColor: 'bg-gradient-to-r from-amber-700 to-orange-600',
      icon: <Star className="w-4 h-4" />,
    },
    {
      id: 2,
      discount: '30% Off Weekend',
      headline: 'Fresh Croissants',
      description:
        'Buttery, flaky croissants baked fresh every morning. Perfect with coffee or as a light breakfast treat.',
      image:
        'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&h=600&fit=crop&crop=center',
      dominantColor: 'bg-gradient-to-r from-yellow-600 to-amber-600',
      icon: <Zap className="w-4 h-4" />,
    },
    {
      id: 3,
      discount: '20% Off Special',
      headline: 'Wedding Cakes',
      description:
        'Custom wedding cakes designed to make your special day unforgettable. Beautiful designs with exquisite flavors.',
      image:
        'https://images.unsplash.com/photo-1621303837174-89787a4d4729?w=800&h=600&fit=crop&crop=center',
      dominantColor: 'bg-gradient-to-r from-pink-500 to-rose-500',
      icon: <Heart className="w-4 h-4" />,
    },
    {
      id: 4,
      discount: '35% Off Bulk Orders',
      headline: 'Assorted Donuts',
      description:
        'Freshly glazed donuts in a variety of flavors. From classic glazed to specialty filled varieties.',
      image:
        'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=800&h=600&fit=crop&crop=center',
      dominantColor: 'bg-gradient-to-r from-purple-600 to-pink-600',
      icon: <Sparkles className="w-4 h-4" />,
    },
    {
      id: 5,
      discount: '40% Off Today Only',
      headline: 'Artisan Bread Loaves',
      description:
        'Traditional sourdough and specialty breads baked with organic ingredients. Crusty outside, soft inside.',
      image:
        'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=800&h=600&fit=crop&crop=center',
      dominantColor: 'bg-gradient-to-r from-amber-800 to-yellow-700',
      icon: <Crown className="w-4 h-4" />,
    },
    {
      id: 6,
      discount: '50% Off Happy Hour',
      headline: 'French Macarons',
      description:
        'Delicate almond cookies with smooth ganache filling. Available in 12 exquisite flavors including lavender and pistachio.',
      image:
        'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=800&h=600&fit=crop&crop=center',
      dominantColor: 'bg-gradient-to-r from-teal-500 to-cyan-500',
      icon: <Star className="w-4 h-4" />,
    },
  ];

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index);
  }, []);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, nextSlide]);

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prevSlide();
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === ' ') {
        e.preventDefault();
        setIsAutoPlaying((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide]);

  return (
    <section
      className="relative h-screen max-h-[600px] min-h-[500px] w-full overflow-hidden bg-gradient-to-br from-gray-50 to-white"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
      role="region"
      aria-label="Hero carousel"
    >
      {/* Slides Container */}
      <div
        className="flex h-full transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className="flex-shrink-0 w-full h-full flex items-center"
            aria-hidden={index !== currentSlide}
          >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-full">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 h-full items-center">
                {/* Left Column - Text Content */}
                <div className="space-y-6 order-2 lg:order-1 text-center lg:text-left">
                  {/* Discount Badge */}
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-full text-sm font-medium animate-pulse">
                    {slide.icon}
                    <span>{slide.discount}</span>
                  </div>

                  {/* Headline */}
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                    <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                      {slide.headline}
                    </span>
                  </h1>

                  {/* Description */}
                  <p className="text-lg sm:text-xl text-gray-600 max-w-lg mx-auto lg:mx-0 leading-relaxed">
                    {slide.description}
                  </p>

                  {/* CTA Button */}
                  <div className="pt-4">
                    <button
                      className={`inline-flex items-center px-6 py-2 text-white font-semibold rounded-md transition-all duration-300 transform hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-opacity-50 ${slide.dominantColor} shadow-lg`}
                      aria-label={`Shop ${slide.headline} now`}
                    >
                      Shop Now
                    </button>
                  </div>
                </div>

                {/* Right Column - Image */}
                <div className="order-1 lg:order-2 h-full flex items-center justify-center relative">
                  {/* Background circle */}
                  <div className="absolute w-[400px] h-[400px] lg:w-[500px] lg:h-[500px] bg-white/30 rounded-full z-0" />

                  {/* Product image */}
                  <img
                    src={slide.image}
                    alt={slide.headline}
                    className="relative z-10 w-[280px] lg:w-[380px] object-contain"
                    loading={index === 0 ? 'eager' : 'lazy'}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/90 text-gray-800 shadow-lg hover:bg-white hover:scale-110 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-300"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/90 text-gray-800 shadow-lg hover:bg-white hover:scale-110 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-300"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Pagination Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-300 ${
              index === currentSlide
                ? 'bg-white scale-125 shadow-lg'
                : 'bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Auto-play Indicator */}
      <div className="absolute top-4 right-4 flex items-center gap-2 text-white/80 text-sm">
        <div
          className={`w-2 h-2 rounded-full ${
            isAutoPlaying ? 'bg-green-400 animate-pulse' : 'bg-gray-400'
          }`}
        ></div>
        <span>{isAutoPlaying ? 'Auto' : 'Manual'}</span>
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 h-1 bg-white/20 w-full">
        <div
          className="h-full bg-white transition-all duration-300 ease-linear"
          style={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
        ></div>
      </div>
    </section>
  );
};

export default HeroCarousel;
