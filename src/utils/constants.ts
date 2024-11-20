import { Apple, Cake, CakeSlice, Cherry, CupSoda, Milk } from 'lucide-react';
import React from 'react';

export const locations = [
  {
    title: 'Current Location',
  },
  {
    title: 'Los Angeles',
  },
  {
    title: 'Chicago',
  },
  {
    title: 'Houston',
  },
  {
    title: 'Phoenix',
  },
  {
    title: 'San Diego',
  },
];

export const mainMenu = [
  {
    title: 'Home',
    link: '/',
    subMenu: [],
  },
  {
    title: 'Shop',
    link: '/shop',
    subMenu: [
      { text: 'Cakes', link: '' },
      { text: 'Cupcakes', link: '' },
      { text: 'Pastries', link: '' },
    ],
  },
  {
    title: 'Categories',
    link: '/categories',
    subMenu: [
      { text: 'Wedding Cakes', link: '' },
      { text: 'Birthday Cakes', link: '' },
      { text: 'Anniversaries', link: '' },
      { text: 'Graduations', link: '' },
      { text: 'Special Occasions', link: '' },
    ],
  },
  {
    title: 'Special Offers',
    link: '/special-offers',
    subMenu: [
      { text: 'Weekend Offers', link: '' },
      { text: 'Wedding Offers', link: '' },
      { text: 'Birthday Offers', link: '' },
      { text: 'Special Offers', link: '' },
    ],
  },
  {
    title: 'About us',
    link: '/about-us',
    subMenu: [{ text: 'Blog', link: '' }],
  },
];

export const categories = [
  {
    id: 1,
    title: 'Fruits',
    itemCount: 320,
    discount: '30%',
    // icon: <Apple size={90} strokeWidth={1} color="#5caf90" />,
    icon: React.createElement(Apple, {
      size: 60,
      strokeWidth: 0.75,
      color: '#5caf90',
    }),

    link: '#',
  },
  {
    id: 2,
    title: 'Bakery',
    itemCount: 65,
    icon: React.createElement(Cake, {
      size: 60,
      strokeWidth: 1,
      color: '#5caf90',
    }),

    link: '#',
  },
  {
    id: 3,
    title: 'Vegetables',
    itemCount: 548,
    discount: '15%',
    icon: React.createElement(Cherry, {
      size: 60,
      strokeWidth: 0.75,
      color: '#5caf90',
    }),
    link: '#',
  },
  {
    id: 4,
    title: 'Dairy & Milk',
    itemCount: 48,
    discount: '10%',
    // icon: <Coffee size={90} strokeWidth={1} color="#5caf90" />,
    icon: React.createElement(Milk, {
      size: 60,
      strokeWidth: 0.75,
      color: '#5caf90',
    }),
    link: '#',
  },
  {
    id: 5,
    title: 'Snack & Spice',
    itemCount: 59,
    icon: React.createElement(CakeSlice, {
      size: 60,
      strokeWidth: 0.75,
      color: '#5caf90',
    }),
    link: '#',
  },
  {
    id: 6,
    title: 'Juice & Drinks',
    itemCount: 845,
    icon: React.createElement(CupSoda, {
      size: 60,
      strokeWidth: 0.75,
      color: '#5caf90',
    }),
    link: '#',
  },
  // {
  //   id: 7,
  //   title: 'Seafood',
  //   itemCount: 652,
  //   icon: <Shrimp size={90} strokeWidth={1} color="#5caf90" />,
  //   link: '#',
  // },
  // {
  //   id: 8,
  //   title: 'Fast Food',
  //   itemCount: 253,
  //   discount: '20%',
  //   icon: <Popcorn size={90} strokeWidth={1} color="#5caf90" />,
  //   link: '#',
  // },
  // {
  //   id: 9,
  //   title: 'Eggs',
  //   itemCount: 154,
  //   icon: <Egg size={90} strokeWidth={1} color="#5caf90" />,
  //   link: '#',
  // },
];

export const selectOptions = [
  'clothes', 'Fruits', 'Snacks', 'Dairy', 'Seafood', 'Fastfood', 'Toys',
];


export const productData = [
  {
    id: 1,
    category: "chips & fries",
    name: "Crunchy Triangle Chips Snacks",
    description: "Contrary to popular belief, Lorem Ipsum is not simply random text...",
    images: {
      main: "/assets/images/1_1.jpg",
      hover: "/assets/images/1_2.jpg"
    },
    price: {
      new: "$59.00",
      old: "$87.00"
    },
    rating: 4,
    flags: "new"
  },
  {
    id: 2,
    category: "Dried Fruits",
    name: "Californian Almonds Value Pack",
    description: "Contrary to popular belief, Lorem Ipsum is not simply random text...",
    images: {
      main: "/assets/images/3_1.jpg",
      hover: "/assets/images/3_2.jpg"
    },
    price: {
      new: "$58.00",
      old: "$65.00"
    },
    rating: 3,
    flags: "sale"
  },
  {
    id: 3,
    category: "Foods",
    name: "Banana Chips Snacks & Spices",
    description: "Contrary to popular belief, Lorem Ipsum is not simply random text...",
    images: {
      main: "/assets/images/4_1.jpg",
      hover: "/assets/images/4_2.jpg"
    },
    price: {
      new: "$45.00",
      old: "$50.00"
    },
    rating: 2,
    flags: "new"
  },
  {
    id: 4,
    category: "Snacks",
    name: "Berry & Graps Mix Snack",
    description: "Contrary to popular belief, Lorem Ipsum is not simply random text...",
    images: {
      main: "/assets/images/5_1.jpg",
      hover: "/assets/images/5_2.jpg"
    },
    price: {
      new: "$25.00",
      old: "$35.00"
    },
    rating: 5,
    flags: "new"
  },
  {
    id: 5,
    category: "Dried Fruits",
    name: "Mixed Nuts Seeds & Berries Pack",
    description: "Contrary to popular belief, Lorem Ipsum is not simply random text...",
    images: {
      main: "/assets/images/6_1.jpg",
      hover: "/assets/images/6_2.jpg"
    },
    price: {
      new: "$45.00",
      old: "$56.00"
    },
    rating: 4,
    flags: "sale"
  },
  {
    id: 6,
    category: "Foods",
    name: "Mixed Nuts & Almonds Dry Fruits",
    description: "Contrary to popular belief, Lorem Ipsum is not simply random text...",
    images: {
      main: "/assets/images/7_1.jpg",
      hover: "/assets/images/7_2.jpg"
    },
    price: {
      new: "$49.00",
      old: "$65.00"
    },
    rating: 2,
    flags: 'new'
 },
  {
    id: 7,
    category: "Snacks",
    name: "Smoked Honey Spiced Nuts",
    description: "Contrary to popular belief, Lorem Ipsum is not simply random text...",
    images: {
      main: "/assets/images/8_1.jpg",
      hover: "/assets/images/8_2.jpg"
    },
    price: {
      new: "$32.00",
      old: "$45.00"
    },
    rating: 4,
    flags: 'sale'
  },
  {
    id: 8,
    category: "Dried Fruits",
    name: "Dates Value Pack Pouch",
    description: "Contrary to popular belief, Lorem Ipsum is not simply random text...",
    images: {
      main: "/assets/images/2_1.jpg",
      hover: "/assets/images/2_2.jpg"
    },
    price: {
      new: "$78.00",
      old: "$85.00"
    },
    rating: 3.25,
    flags: "sale"
  }
];
