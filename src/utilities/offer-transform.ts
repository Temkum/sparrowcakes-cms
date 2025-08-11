import { Offer } from '@/types/offer';
import { Product } from '@/types/product';

interface ApiOfferResponse {
  id: number;
  name: string;
  product_id: number;
  description?: string;
  price: string | number;
  image_urls?: string[];
  discount: string | number;
  availability: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Function to transform either an ApiOfferResponse or a Product to an Offer
export const transformApiResponseToOffer = (
  response: ApiOfferResponse | Product
): Offer => {
  // Check if the response is a Product type
  const isProduct = 'slug' in response;

  if (isProduct) {
    const product = response as Product;
    // Ensure price is a number
    const price = typeof product.price === 'string' ? parseFloat(product.price) : Number(product.price) || 0;
    const discount = typeof product.discount === 'string' ? parseFloat(product.discount) : Number(product.discount) || 0;
    
    return {
      id: product.id,
      name: product.name,
      product_id: product.id,
      product: {
        id: product.id,
        name: product.name,
        description: product.description,
        price: price,
        image_url:
          Array.isArray(product.imageUrls) && product.imageUrls.length > 0
            ? product.imageUrls[0]
            : '',
      },
      discount_type: 'fixed',
      discount_value: discount,
      start_time: new Date().toISOString(),
      end_time:
        typeof product.availability === 'string'
          ? product.availability
          : product.availability?.toISOString() || new Date().toISOString(),
      is_active: product.isActive,
      created_at: product.createdAt || new Date().toISOString(),
      updated_at: product.updatedAt || new Date().toISOString(),
      productId: product.id,
      discountType: 'fixed',
      discountValue: discount,
      startTime: new Date().toISOString(),
      endTime:
        typeof product.availability === 'string'
          ? product.availability
          : product.availability?.toISOString() || new Date().toISOString(),
      isActive: product.isActive,
      createdAt: product.createdAt || new Date().toISOString(),
      updatedAt: product.updatedAt || new Date().toISOString(),
      image_url:
        Array.isArray(product.imageUrls) && product.imageUrls.length > 0
          ? product.imageUrls[0]
          : '',
    };
  }

  // Handle ApiOfferResponse type
  const offer = response as ApiOfferResponse;
  return {
    id: offer.id,
    name: offer.name,
    product_id: offer.product_id,
    product: {
      id: offer.id,
      name: offer.name,
      description: offer.description || '',
      price: Number(offer.price),
      image_url: offer.image_urls?.[0] || '',
    },
    discount_type: 'fixed',
    discount_value: Number(offer.discount),
    start_time: new Date().toISOString(),
    end_time: offer.availability,
    is_active: offer.is_active,
    created_at: offer.created_at,
    updated_at: offer.updated_at,
    productId: offer.id,
    discountType: 'fixed',
    discountValue: Number(offer.discount),
    startTime: new Date().toISOString(),
    endTime: offer.availability,
    isActive: offer.is_active,
    createdAt: offer.created_at,
    updatedAt: offer.updated_at,
    image_url: offer.image_urls?.[0] || '',
  };
};
