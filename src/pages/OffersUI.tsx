import { useState, useEffect, useMemo } from 'react';
import useOffersStore from '@/store/offer-store';
import useProductStore from '@/store/product-store';
import { transformApiResponseToOffer } from '@/utilities/offer-transform';
import OfferCard from '@/components/offers/OfferCard';
import ComingSoon from '@/components/offers/ComingSoon';
import FilterBar from '@/components/offers/FilterBar';

const OffersUI = () => {
  const { offers, loadActiveOffers, loading } = useOffersStore();
  const { products, loadProducts } = useProductStore();
  const [sortBy, setSortBy] = useState('discount_desc');

  useEffect(() => {
    loadActiveOffers();
    loadProducts();
  }, [loadActiveOffers, loadProducts]);

  // Transform products to offers if needed
  const productOffers = useMemo(() => {
    return products.map(transformApiResponseToOffer);
  }, [products]);

  // Combine store offers and product offers
  const allOffers = useMemo(() => {
    return [...offers, ...productOffers];
  }, [offers, productOffers]);

  // Handle offer expiration
  const handleOfferExpire = (offerId: number) => {
    // You might want to update this to use your store's updateOffer method
    console.log(`Offer ${offerId} expired`);
  };

  // Filter and sort offers
  const filteredAndSortedOffers = useMemo(() => {
    const filtered = allOffers.filter((offer) => offer.is_active);

    // Apply sorting
    const calculateDiscountedPrice = (offer: { product?: { price: number }, discount_type?: string, discount_value: number }) => {
      if (!offer.product) return 0;
      if (offer.discount_type === 'percentage') {
        return offer.product.price - (offer.product.price * offer.discount_value) / 100;
      }
      return offer.product.price - offer.discount_value;
    };

    return [...filtered].sort((a, b) => {
      const aPrice = calculateDiscountedPrice(a);
      const bPrice = calculateDiscountedPrice(b);
      const aSavings = a.product ? a.product.price - aPrice : 0;
      const bSavings = b.product ? b.product.price - bPrice : 0;

      switch (sortBy) {
        case 'discount_desc':
          return bSavings - aSavings;
        case 'discount_asc':
          return aSavings - bSavings;
        case 'time_asc':
          return new Date(a.end_time).getTime() - new Date(b.end_time).getTime();
        case 'time_desc':
          return new Date(b.end_time).getTime() - new Date(a.end_time).getTime();
        case 'price_asc':
          return aPrice - bPrice;
        case 'price_desc':
          return bPrice - aPrice;
        default:
          return 0;
      }
    });
  }, [allOffers, sortBy]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

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
                No active offers at the moment. Check back soon for sweet deals!
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
