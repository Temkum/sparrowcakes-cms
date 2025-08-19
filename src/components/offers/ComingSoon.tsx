import { Calendar } from 'lucide-react';
import useProductStore from '@/store/product-store';
import { useEffect, useState } from 'react';

interface UpcomingOffer {
  id: number;
  name: string;
  description: string;
  startDate: string;
  discount: string;
  imageUrl: string;
}

const ComingSoon = () => {
  const { products } = useProductStore();
  const [upcomingOffers, setUpcomingOffers] = useState<UpcomingOffer[]>([]);

  useEffect(() => {
    // Transform upcoming products (those with future availability dates) into offers
    const now = new Date();
    const upcomingProducts = products.filter((product) => {
      if (!product.availableTo) return false;
      const availabilityDate = new Date(product.availableTo);
      return availabilityDate > now;
    });

    const transformedOffers = upcomingProducts.map((product) => ({
      id: product.id,
      name: product.name,
      description: product.description
        ? product.description.replace(/<[^>]*>/g, '').substring(0, 100) + '...'
        : 'Special limited-time offer',
      startDate: product.availableTo ? new Date(product.availableTo).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }) : 'Coming Soon',
      discount:
        product.discount > 0
          ? `Up to ${Math.floor((product.discount / product.price) * 100)}% OFF`
          : 'New Arrival',
      imageUrl: product.imageUrls?.[0] || '/placeholder-cake.jpg',
    }));

    // Add default offers if no upcoming products found
    if (transformedOffers.length === 0) {
      setUpcomingOffers([
        {
          id: 1,
          name: 'Holiday Special Collection',
          description: 'Festive cakes and desserts for the upcoming season',
          startDate: new Date(
            Date.now() + 7 * 24 * 60 * 60 * 1000
          ).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          }),
          discount: '25% OFF',
          imageUrl: '/holiday-special.jpg',
        },
        {
          id: 2,
          name: 'New Signature Flavors',
          description: 'Exciting new cake flavors coming soon',
          startDate: new Date(
            Date.now() + 14 * 24 * 60 * 60 * 1000
          ).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          }),
          discount: 'Launch Special',
          imageUrl: '/new-flavors.jpg',
        },
      ]);
    } else {
      setUpcomingOffers(transformedOffers.slice(0, 2)); // Show max 2 upcoming offers
    }
  }, [products]);

  return (
    <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-6 border border-orange-200">
      <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
        <Calendar className="w-5 h-5 text-orange-600" />
        Coming Soon
      </h3>
      <div className="grid md:grid-cols-2 gap-4">
        {upcomingOffers.map((offer) => (
          <div
            key={offer.id}
            className="bg-white rounded-lg p-4 shadow-sm flex gap-4"
          >
            <div className="flex-shrink-0">
              <img
                src={offer.imageUrl}
                alt={offer.name}
                className="w-20 h-20 object-cover rounded-md"
              />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">{offer.name}</h4>
              <p className="text-gray-600 text-sm mb-2">{offer.description}</p>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Starts: {offer.startDate}</span>
                <span
                  className={`px-2 py-1 rounded-full font-medium ${
                    offer.discount.includes('%')
                      ? 'bg-orange-100 text-orange-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  {offer.discount}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ComingSoon;
