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

export const products: ProductDisplay[] = [
  {
    id: '1',
    title: 'Best snakes with hazel nut mix pack 200gm',
    category: 'Snacks',
    price: 120.25,
    originalPrice: 123.25,
    rating: 4.5,
    image: '/assets/images/10_1.jpg?height=400&width=400',
    display: true,
  },
  {
    id: '2',
    title: 'Organic Mixed Nuts Premium Selection',
    category: 'Snacks',
    price: 89.99,
    originalPrice: 99.99,
    rating: 3,
    image: '/assets/images/9.jpg?height=400&width=400',
    display: true,
  },
  {
    id: '3',
    title: 'Fresh Citrus Fruit Basket',
    category: 'Fruits',
    price: 45.5,
    originalPrice: 50.0,
    rating: 4.2,
    image: '/assets/images/3_2.jpg?height=400&width=400',
    display: false,
  },
  {
    id: '4',
    title: 'Artisanal Dark Chocolate Collection',
    category: 'Sweets',
    price: 35.75,
    originalPrice: 40.0,
    rating: 4.9,
    image: '/assets/images/1_1.jpg?height=400&width=400',
    display: true,
  },
  {
    id: '5',
    title: 'Premium Trail Mix Pack',
    category: 'Snacks',
    price: 67.5,
    originalPrice: 75.0,
    rating: 4.6,
    image: '/assets/images/3_4.jpg?height=400&width=400',
    display: false,
  },
  {
    id: '6',
    title: 'Gourmet Coffee Beans Selection',
    category: 'Beverages',
    price: 95.0,
    originalPrice: 105.0,
    rating: 4.7,
    image: '/assets/images/17.jpg?height=400&width=400',
    display: true,
  },
  {
    id: '7',
    title: 'Organic Dried Fruit Medley',
    category: 'Snacks',
    price: 28.99,
    originalPrice: 32.99,
    rating: 4.4,
    image: '/assets/images/11.jpg?height=400&width=400',
    display: true,
  },
  {
    id: '8',
    title: 'Premium Assorted Tea Collection',
    category: 'Beverages',
    price: 55.25,
    originalPrice: 60.0,
    rating: 4.3,
    image: '/assets/images/2_2.jpg?height=400&width=400',
    display: true,
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

export const categories: CategoryForDisplay[] = [
  {
    id: 'cake-milk',
    name: 'Cake & Milk',
    itemCount: 65,
    banners: [
      {
        image: '/assets/images/3.jpg?height=400&width=600',
        discount: 50,
        title: 'Cake',
        position: 'left',
      },
      {
        image: '/assets/images/4.jpg?height=400&width=600',
        discount: 40,
        title: 'Milk',
        position: 'right',
      },
    ],
  },
  {
    id: 'fresh-meat',
    name: 'Fresh Meat',
    itemCount: 30,
    banners: [
      {
        image: '/placeholder.svg?height=400&width=600',
        discount: 30,
        title: 'Fresh Meat',
        position: 'left',
      },
      {
        image: '/placeholder.svg?height=400&width=600',
        discount: 25,
        title: 'Premium Cuts',
        position: 'right',
      },
    ],
  },
  {
    id: 'vegetables',
    name: 'Vegetables',
    itemCount: 25,
    banners: [
      {
        image: '/placeholder.svg?height=400&width=600',
        discount: 45,
        title: 'Fresh Vegetables',
        position: 'left',
      },
      {
        image: '/placeholder.svg?height=400&width=600',
        discount: 35,
        title: 'Organic Produce',
        position: 'right',
      },
    ],
  },
  {
    id: 'apple-mango',
    name: 'Apple & Mango',
    itemCount: 45,
    banners: [
      {
        image: '/placeholder.svg?height=400&width=600',
        discount: 20,
        title: 'Fresh Fruits',
        position: 'left',
      },
      {
        image: '/placeholder.svg?height=400&width=600',
        discount: 15,
        title: 'Seasonal Picks',
        position: 'right',
      },
    ],
  },
  {
    id: 'strawberry',
    name: 'Strawberry',
    itemCount: 68,
    banners: [
      {
        image: '/placeholder.svg?height=400&width=600',
        discount: 40,
        title: 'Fresh Strawberries',
        position: 'left',
      },
      {
        image: '/placeholder.svg?height=400&width=600',
        discount: 30,
        title: 'Berry Mix',
        position: 'right',
      },
    ],
  },
];

export const slides: Slide[] = [
  {
    tag: 'Organic Vegetables',
    tagPercentage: '100%',
    title: 'The best way to stuff your wallet.',
    description:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Amet reiciendis beatae consequuntur.',
    image: '/assets/images/1_1.jpg',
    backgroundColor: '#f8e7dd',
  },
  {
    tag: 'Fresh Fruits',
    tagPercentage: '100%',
    title: 'Natural and healthy fruits for you.',
    description:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Amet reiciendis beatae consequuntur.',
    image: '/assets/images/banner.jpg',
    backgroundColor: '#e7f8dd',
  },
  {
    tag: 'Organic Products',
    tagPercentage: '100%',
    title: 'The best organic products selection.',
    description:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Amet reiciendis beatae consequuntur.',
    image: '/assets/images/tab-1.jpg',
    backgroundColor: '#dde7f8',
  },
];

export const ordersData: OrdersProp[] = [
  {
    id: '1',
    number: 'OR571702',
    customer: 'Dahlia Conroy',
    status: 'Processing',
    currency: 'USD',
    totalPrice: 1261.25,
    shippingCost: 323.42,
    orderDate: 'Feb 29, 2024',
  },
  {
    id: '2',
    number: 'OR323020',
    customer: 'Mitchel Moen',
    status: 'Delivered',
    currency: 'Saudi Riyal',
    totalPrice: 104.0,
    shippingCost: 103.23,
    orderDate: 'Apr 19, 2024',
  },
  // Add more orders as needed
];

export const dbCategories = [
  { id: 1, name: 'Category 1' },
  { id: 2, name: 'Category 2' },
  { id: 3, name: 'Category 3' },
  { id: 4, name: 'Category 4' },
  { id: 5, name: 'Category 5' },
  { id: 6, name: 'Category 6' },
  { id: 7, name: 'Category 7' },
  { id: 8, name: 'Category 8' },
  { id: 9, name: 'Category 9' },
  { id: 10, name: 'Category 10' },
];
