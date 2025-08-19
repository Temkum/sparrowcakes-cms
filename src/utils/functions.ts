import { Product } from '@/types';
import { v4 as uuidv4 } from 'uuid'; // For generating unique IDs

export const generateRandomProducts = (count: number): Product[] => {
  const products: Product[] = [];
 
  const sampleTitles = [
    "Potato Chips 52g, American Cream & Onion Flavour.",
    "Crunchy Chips & Snacks",
    "Premium Salted Cashews, Rich in Protein & Fiber.",
    "Organic Almonds, 1kg Pack, A-grade Quality.",
    "Crunchy Granola Bars, Honey & Oats, Pack of 6.",
    "Dark Chocolate Cookies, Soft & Chewy, 500g."
  ];

  const sampleDescriptions = [
    "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    "High-quality snacks for any occasion. Perfect for parties and gatherings.",
    "Rich in taste, healthy, and packed with essential nutrients.",
    "Made from premium ingredients, ensuring excellent quality and flavor.",
    "A delightful treat for your taste buds with unmatched freshness."
  ];

  const sampleFeatures = [
    { key: "Closure", value: "Hook & Loop" },
    { key: "Sole", value: "Polyvinyl Chloride" },
    { key: "Width", value: "Medium" },
    { key: "Outer Material", value: "A-Grade Standard Quality" },
  ];

  const weightOptions = [250, 500, 1, 2];

  const sampleImages = [
    "8_1.jpg",
    "5_1.jpg",
    "2_1.jpg",
    "8_1.jpg",
  ]
  
  for (let i = 0; i < count; i++) {
    const randomTitleIndex = Math.floor(Math.random() * sampleTitles.length);
    const randomDescriptionIndex = Math.floor(Math.random() * sampleDescriptions.length);
    const finalPrice = Math.floor((Math.random() * 500 + 50));
    const discount = Math.floor(Math.random() * 80) + 10;

    products.push({
      id: uuidv4(),
      title: sampleTitles[randomTitleIndex],
      rating: Math.floor(Math.random() * 5) + 1, // Random rating between 1-5
      totalRatings: Math.floor(Math.random() * 1000) + 1, // Random total ratings
      finalPrice: finalPrice,
      discount: discount,
      mrp: `${(Math.random() * 3000 + 1000).toFixed(2)}`,
      sku: `${Math.random().toString(36).substring(7).toUpperCase()}`,
      stockStatus: Math.random() > 0.5 ? "IN STOCK" : "OUT OF STOCK",
      description: sampleDescriptions[randomDescriptionIndex],
      features: sampleFeatures,
      weightOptions: weightOptions,
      image: sampleImages[i],
      quantity: 1,
      actions: {
        addToCart: true,
        wishlist: true,
        quickView: true,
      },
    });
  }

  return products;
};
