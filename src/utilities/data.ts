import { DollarSign, Headphones, Package, Truck } from 'lucide-react';
import React from 'react';

export const testimonials = [
  {
    name: 'Stephen Smith',
    role: 'Co Founder',
    quote:
      'elusmpsu dolor sit amet, conse cte tur ng elit, sed do eiusmod tem lacus vel facilisis.',
    rating: 5,
    image: '/assets/profiles/tk.jpg',
  },
  {
    name: 'Lorem Robinson',
    role: 'Manager',
    quote:
      'elusmpsu dolor sit amet, conse cte tur ng elit, sed do eiusmod tem lacus vel facilisis.',
    rating: 3,
    image: '/assets/profiles/ceci.jpg',
  },
  {
    name: 'Saddika Alard',
    role: 'Team Leader',
    quote:
      'elusmpsu dolor sit amet, conse cte tur ng elit, sed do eiusmod tem lacus vel facilisis.',
    rating: 5,
    image: '/assets/profiles/annyia.jpg',
  },
];

export const blogPosts = [
  {
    author: 'Admin',
    category: 'Snacks',
    title: 'Urna pretium elit mauris cursus at elit Vestibulum',
    image: '/assets/images/2_4.jpg',
    date: {
      day: 10,
      month: 'OCT',
    },
    slug: '/blog/urna-pretium',
  },
  {
    author: 'Chef Maria',
    category: 'Healthy Eating',
    title: 'Mediterranean Bowl with Grilled Vegetables',
    image: '/assets/images/3_4.jpg',
    date: {
      day: 12,
      month: 'OCT',
    },
    slug: '/blog/mediterranean-bowl',
  },
  {
    author: 'Nutritionist Sam',
    category: 'Nutrition',
    title: 'Benefits of Plant-Based Protein Sources',
    image: '/assets/images/8_1.jpg',
    date: {
      day: 15,
      month: 'OCT',
    },
    slug: '/blog/plant-protein',
  },
  {
    author: 'Food Editor',
    category: 'Recipes',
    title: 'Quick and Easy Lunch Box Ideas',
    image: '/assets/images/5.jpg',
    date: {
      day: 18,
      month: 'OCT',
    },
    slug: '/blog/lunch-box-ideas',
  },
  {
    author: 'Chef John',
    category: 'Cooking Tips',
    title: 'Master the Art of Meal Prepping',
    image: '/assets/images/3_4.jpg',
    date: {
      day: 20,
      month: 'OCT',
    },
    slug: '/blog/meal-prep',
  },
  {
    author: 'Health Coach',
    category: 'Wellness',
    title: 'Balanced Nutrition for Active Lifestyle',
    image: '/assets/images/3_4.jpg',
    date: {
      day: 22,
      month: 'OCT',
    },
    slug: '/blog/balanced-nutrition',
  },
];

export const products: Product[] = [
  {
    id: '1',
    title: 'Best snakes with hazel nut mix pack 200gm',
    category: 'Snacks',
    price: 120.25,
    originalPrice: 123.25,
    rating: 4.5,
    image: '/assets/images/10_1.jpg?height=400&width=400',
  },
  {
    id: '2',
    title: 'Organic Mixed Nuts Premium Selection',
    category: 'Snacks',
    price: 89.99,
    originalPrice: 99.99,
    rating: 3,
    image: '/assets/images/9.jpg?height=400&width=400',
  },
  {
    id: '3',
    title: 'Fresh Citrus Fruit Basket',
    category: 'Fruits',
    price: 45.5,
    originalPrice: 50.0,
    rating: 4.2,
    image: '/assets/images/3_2.jpg?height=400&width=400',
  },
  {
    id: '4',
    title: 'Artisanal Dark Chocolate Collection',
    category: 'Sweets',
    price: 35.75,
    originalPrice: 40.0,
    rating: 4.9,
    image: '/assets/images/1_1.jpg?height=400&width=400',
  },
  {
    id: '5',
    title: 'Premium Trail Mix Pack',
    category: 'Snacks',
    price: 67.5,
    originalPrice: 75.0,
    rating: 4.6,
    image: '/assets/images/3_4.jpg?height=400&width=400',
  },
  {
    id: '6',
    title: 'Gourmet Coffee Beans Selection',
    category: 'Beverages',
    price: 95.0,
    originalPrice: 105.0,
    rating: 4.7,
    image: '/assets/images/17.jpg?height=400&width=400',
  },
  {
    id: '7',
    title: 'Organic Dried Fruit Medley',
    category: 'Snacks',
    price: 28.99,
    originalPrice: 32.99,
    rating: 4.4,
    image: '/assets/images/11.jpg?height=400&width=400',
  },
  {
    id: '8',
    title: 'Premium Assorted Tea Collection',
    category: 'Beverages',
    price: 55.25,
    originalPrice: 60.0,
    rating: 4.3,
    image: '/assets/images/2_2.jpg?height=400&width=400',
  },
];

export const services: Service[] = [
  {
    icon: React.createElement(Package, {
      className: 'w-8 h-8 text-emerald-500',
    }),
    title: 'Product Packing',
    description: 'Lorem ipsum dolor sit amet, consectetur adipisicing.',
  },
  {
    icon: React.createElement(Headphones, {
      className: 'w-8 h-8 text-emerald-500',
    }),
    title: '24X7 Support',
    description: 'Lorem ipsum dolor sit amet, consectetur adipisicing.',
  },
  {
    icon: React.createElement(Truck, {
      className: 'w-8 h-8 text-emerald-500',
    }),
    title: 'Delivery in 5 Days',
    description: 'Lorem ipsum dolor sit amet, consectetur adipisicing.',
  },
  {
    icon: React.createElement(DollarSign, {
      className: 'w-8 h-8 text-emerald-500',
    }),
    title: 'Payment Secure',
    description: 'Lorem ipsum dolor sit amet, consectetur adipisicing.',
  },
];

export const banners: BannerProps[] = [
  {
    title: 'Fresh & Healthy\nOrganic Fruits',
    discount: 35,
    image: '/assets/images/1_1.jpg',
    backgroundColor: 'bg-[#ffd6d6]',
  },
  {
    title: 'Healthy\nBakery Products',
    discount: 30,
    image: '/assets/images/5_1.jpg',
    backgroundColor: 'bg-[#d6f5e6]',
  },
  {
    title: 'Fresh\nSnacks & Sweets',
    discount: 20,
    image: '/assets/images/6_1.jpg',
    backgroundColor: 'bg-[#ffe4d6]',
  },
];
