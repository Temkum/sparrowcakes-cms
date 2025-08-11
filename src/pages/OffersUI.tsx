import { useState, useEffect, useMemo } from 'react';
import { Clock, ShoppingCart, Filter, Star, Tag, Calendar } from 'lucide-react';
import { Offer } from '@/types/offer';

// Mock data for demonstration
const mockOffers = [
  {
    id: 1,
    product_id: 'cake-001',
    product_name: 'Chocolate Fudge Cake',
    product_description: 'Rich, decadent chocolate cake with layers of fudge',
    product_image:
      'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop',
    original_price: 45.0,
    discount_type: 'percentage',
    discount_value: 25,
    start_time: new Date(Date.now() - 86400000).toISOString(), // Started 1 day ago
    end_time: new Date(Date.now() + 172800000).toISOString(), // Ends in 2 days
    is_active: true,
    category: 'cakes',
  },
  {
    id: 2,
    product_id: 'pastry-002',
    product_name: 'French Croissant Box',
    product_description: 'Buttery, flaky croissants baked fresh daily',
    product_image:
      'https://images.unsplash.com/photo-1555507036-ab794f4afe5c?w=400&h=300&fit=crop',
    original_price: 18.0,
    discount_type: 'fixed',
    discount_value: 5.0,
    start_time: new Date(Date.now() - 43200000).toISOString(), // Started 12 hours ago
    end_time: new Date(Date.now() + 86400000).toISOString(), // Ends in 1 day
    is_active: true,
    category: 'pastries',
  },
  {
    id: 3,
    product_id: 'cake-003',
    product_name: 'Red Velvet Cupcakes',
    product_description: 'Classic red velvet with cream cheese frosting',
    product_image:
      'https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?w=400&h=300&fit=crop',
    original_price: 24.0,
    discount_type: 'percentage',
    discount_value: 30,
    start_time: new Date(Date.now() - 21600000).toISOString(), // Started 6 hours ago
    end_time: new Date(Date.now() + 43200000).toISOString(), // Ends in 12 hours
    is_active: true,
    category: 'cupcakes',
  },
  {
    id: 4,
    product_id: 'pastry-004',
    product_name: 'Seasonal Fruit Tarts',
    product_description: 'Fresh seasonal fruits on vanilla custard base',
    product_image:
      'https://images.unsplash.com/photo-1508736793731-5fb5f4078369?w=400&h=300&fit=crop',
    original_price: 32.0,
    discount_type: 'percentage',
    discount_value: 20,
    start_time: new Date(Date.now() - 10800000).toISOString(), // Started 3 hours ago
    end_time: new Date(Date.now() + 259200000).toISOString(), // Ends in 3 days
    is_active: true,
    category: 'tarts',
  },
  {
    id: 5,
    product_id: 'cake-005',
    product_name: 'Tiramisu Cake',
    product_description: 'Coffee-soaked layers with mascarpone cream',
    product_image:
      'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=300&fit=crop',
    original_price: 38.0,
    discount_type: 'fixed',
    discount_value: 8.0,
    start_time: new Date(Date.now() - 7200000).toISOString(), // Started 2 hours ago
    end_time: new Date(Date.now() + 21600000).toISOString(), // Ends in 6 hours
    is_active: true,
    category: 'cakes',
  },
];

// Countdown Timer Component
const CountdownTimer = ({
  endTime,
  onExpire,
}: {
  endTime: string;
  onExpire: (offerId: number) => void;
}) => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const end = new Date(endTime).getTime();
      const difference = end - now;

      if (difference > 0) {
        const hours = Math.floor(difference / (1000 * 60 * 60));
        const minutes = Math.floor(
          (difference % (1000 * 60 * 60)) / (1000 * 60)
        );
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ hours, minutes, seconds });
      } else {
        setIsExpired(true);
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [endTime, onExpire]);

  if (isExpired) {
    return (
      <div className="bg-red-100 border border-red-300 rounded-lg px-3 py-2">
        <span className="text-red-600 font-semibold text-sm">
          Offer Expired
        </span>
      </div>
    );
  }

  return (
    <div className="bg-orange-50 border border-gray-200 rounded-lg px-3 py-2 flex items-center gap-2">
      <Clock className="w-4 h-4 text-gray-600" />
      <span className="text-gray-800 font-mono font-semibold">
        {String(timeLeft.hours).padStart(2, '0')}:
        {String(timeLeft.minutes).padStart(2, '0')}:
        {String(timeLeft.seconds).padStart(2, '0')}
      </span>
    </div>
  );
};

// Offer Card Component
const OfferCard = ({ offer, onExpire }: { offer: any; onExpire: any }) => {
  const calculateDiscountedPrice = (
    originalPrice: number,
    discountType: string,
    discountValue: number
  ) => {
    if (discountType === 'percentage') {
      return originalPrice - (originalPrice * discountValue) / 100;
    }
    return originalPrice - discountValue;
  };

  const discountedPrice = calculateDiscountedPrice(
    offer.original_price,
    offer.discount_type,
    offer.discount_value
  );
  const savings = offer.original_price - discountedPrice;

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="relative">
        <img
          src={offer.product_image}
          alt={offer.product_name}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full flex items-center gap-1">
          <Tag className="w-3 h-3" />
          <span className="text-sm font-semibold">
            {offer.discount_type === 'percentage'
              ? `${offer.discount_value}% OFF`
              : `$${offer.discount_value} OFF`}
          </span>
        </div>
        <div className="absolute top-3 right-3">
          <div className="bg-white/90 backdrop-blur-sm rounded-lg p-1">
            <Star className="w-4 h-4 text-yellow-500 fill-current" />
          </div>
        </div>
      </div>

      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-900 mb-2">
          {offer.product_name}
        </h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {offer.product_description}
        </p>

        <div className="flex items-center gap-3 mb-3">
          <span className="text-2xl font-bold text-green-600">
            ${discountedPrice.toFixed(2)}
          </span>
          <span className="text-lg text-gray-400 line-through">
            ${offer.original_price.toFixed(2)}
          </span>
          <span className="text-sm text-green-600 bg-green-100 px-2 py-1 rounded-full">
            Save ${savings.toFixed(2)}
          </span>
        </div>

        <div className="mb-4">
          <CountdownTimer
            endTime={offer.end_time}
            onExpire={() => onExpire(offer.id)}
          />
        </div>

        <a
          href={`https://wa.me/+237653761531?text=Hi%2CSparrow%20Cakes%2CI'm%20interested%20in%20the%20${offer.product_name}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <button className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors duration-200">
            <ShoppingCart className="w-4 h-4" />
            Order now
          </button>
        </a>
      </div>
    </div>
  );
};

// Filter Component
const FilterBar = ({
  categories,
  selectedCategory,
  onCategoryChange,
  sortBy,
  onSortChange,
}: {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
}) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">Filter by:</span>
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="border border-transparent rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-green-300 bg-transparent border-gray-400 cursor-pointer"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="border border-transparent rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 bg-transparent border-gray-400 cursor-pointer"
          >
            <option value="discount_desc">Highest Discount</option>
            <option value="discount_asc">Lowest Discount</option>
            <option value="time_asc">Ending Soon</option>
            <option value="time_desc">Most Time Left</option>
            <option value="price_asc">Lowest Price</option>
            <option value="price_desc">Highest Price</option>
          </select>
        </div>
      </div>
    </div>
  );
};

// Coming Soon Section
const ComingSoon = () => {
  const upcomingOffers = [
    {
      name: 'Holiday Cake Collection',
      description: 'Special holiday-themed cakes and desserts',
      startDate: 'Dec 15, 2024',
      discount: 'Up to 35% OFF',
    },
    {
      name: 'New Year Cookie Boxes',
      description: 'Festive cookie assortments for celebrations',
      startDate: 'Dec 28, 2024',
      discount: 'Buy 2 Get 1 Free',
    },
  ];

  return (
    <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-6 border border-orange-200">
      <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
        <Calendar className="w-5 h-5 text-orange-600" />
        Coming Soon
      </h3>
      <div className="grid md:grid-cols-2 gap-4">
        {upcomingOffers.map((offer, index) => (
          <div key={index} className="bg-white rounded-lg p-4 shadow-sm">
            <h4 className="font-semibold text-gray-900 mb-1">{offer.name}</h4>
            <p className="text-gray-600 text-sm mb-2">{offer.description}</p>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">Starts: {offer.startDate}</span>
              <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full font-medium">
                {offer.discount}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Main Component
const OffersUI = () => {
  const [offers, setOffers] = useState(mockOffers);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('discount_desc');

  // Get unique categories
  const categories = useMemo(() => {
    return [...new Set(offers.map((offer) => offer.category))];
  }, [offers]);

  // Handle offer expiration
  const handleOfferExpire = (offerId: number) => {
    setOffers((prevOffers) =>
      prevOffers.map((offer) =>
        offer.id === offerId ? { ...offer, is_active: false } : offer
      )
    );

    // In a real app, you would call the backend API here
    // API.patch(`/offers/${offerId}`, { is_active: false });
  };

  // Filter and sort offers
  const filteredAndSortedOffers = useMemo(() => {
    let filtered = offers.filter((offer) => offer.is_active);

    // Apply category filter
    if (selectedCategory) {
      filtered = filtered.filter(
        (offer) => offer.category === selectedCategory
      );
    }

    // Apply sorting
    const calculateDiscountedPrice = (offer: Offer) => {
      if (offer.discountType === 'percentage') {
        return (
          offer.originalPrice -
          (offer.originalPrice * offer.discountValue) / 100
        );
      }
      return offer.originalPrice - offer.discountValue;
    };

    const calculateSavingsPercent = (offer: Offer) => {
      const discountedPrice = calculateDiscountedPrice(offer);
      return (
        ((offer.originalPrice - discountedPrice) / offer.originalPrice) * 100
      );
    };

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'discount_desc':
          return calculateSavingsPercent(b) - calculateSavingsPercent(a);
        case 'discount_asc':
          return calculateSavingsPercent(a) - calculateSavingsPercent(b);
        case 'time_asc':
          return new Date(a.endTime) - new Date(b.endTime);
        case 'time_desc':
          return new Date(b.endTime) - new Date(a.endTime);
        case 'price_asc':
          return calculateDiscountedPrice(a) - calculateDiscountedPrice(b);
        case 'price_desc':
          return calculateDiscountedPrice(b) - calculateDiscountedPrice(a);
        default:
          return 0;
      }
    });

    return filtered;
  }, [offers, selectedCategory, sortBy]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-25 via-white to-red-25 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Sweet Deals & Offers
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Don't miss out on our delicious discounts! Fresh baked goods at
            unbeatable prices, but hurry - these offers won't last long!
          </p>
        </div>

        {/* Filter Bar */}
        <FilterBar
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />

        {/* Active Offers Count */}
        <div className="mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold text-gray-900">
                {filteredAndSortedOffers.length} Active Offers Available
              </span>
              <span className="text-sm text-gray-500">
                Updated in real-time
              </span>
            </div>
          </div>
        </div>

        {/* Offers Grid */}
        {filteredAndSortedOffers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {filteredAndSortedOffers.map((offer) => (
              <OfferCard
                key={offer.id}
                offer={offer}
                onExpire={handleOfferExpire}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="bg-white rounded-xl shadow-lg border border-green-100 p-8 max-w-md mx-auto">
              <div className="text-6xl mb-4">🍰</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No Active Offers
              </h3>
              <p className="text-gray-600">
                {selectedCategory
                  ? `No offers available in the "${selectedCategory}" category right now.`
                  : 'No active offers at the moment. Check back soon for sweet deals!'}
              </p>
            </div>
          </div>
        )}

        {/* Coming Soon Section */}
        <ComingSoon />
      </div>
    </div>
  );
};

export default OffersUI;
