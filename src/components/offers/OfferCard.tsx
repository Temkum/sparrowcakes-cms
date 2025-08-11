import { ShoppingCart, Tag } from 'lucide-react';
import { Offer } from '@/types/offer';
import CountdownTimer from './CountdownTimer';

const OfferCard = ({
  offer,
  onExpire,
}: {
  offer: Offer;
  onExpire: (offerId: number) => void;
}) => {
  if (!offer.product) return null;

  const calculateDiscountedPrice = () => {
    if (offer.discount_type === 'percentage') {
      return (
        offer.product!.price -
        (offer.product!.price * offer.discount_value) / 100
      );
    }
    return offer.product!.price - offer.discount_value;
  };

  const discountedPrice = calculateDiscountedPrice();
  const savings = offer.product!.price - discountedPrice;
  const contactText = `Hi, Cakes By Sparrow, I'm interested in the ${offer.product.name}`;

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="relative">
        <img
          src={offer.product.image_url || '/placeholder-cake.jpg'}
          alt={offer.product.name}
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
      </div>

      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-900 mb-2">
          {offer.product.name}
        </h3>
        {offer.product.description && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {offer.product.description.replace(/<[^>]*>/g, '')}
          </p>
        )}

        <div className="flex items-center gap-3 mb-3">
          <span className="text-2xl font-bold text-green-600">
            ${discountedPrice}
          </span>
          <span className="text-lg text-gray-400 line-through">
            ${offer.product.price}
          </span>
          <span className="text-sm text-green-600 bg-green-100 px-2 py-1 rounded-full">
            Save ${savings}
          </span>
        </div>

        <div className="mb-4">
          <CountdownTimer
            endTime={offer.end_time}
            onExpire={() => onExpire(offer.id)}
          />
        </div>

        <a
          href={`https://wa.me/+237653761531?text=${contactText}`}
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

export default OfferCard;
