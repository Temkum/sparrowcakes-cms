import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { Link } from 'react-router-dom';
import StarRating from './StarRating';
import { Product, ProductDiscountCarouselProps } from '@/types';

const ProductDiscountCarousel: React.FC<ProductDiscountCarouselProps> = ({
  products,
}) => {
  return (
    <Swiper
      modules={[Navigation, Pagination, Autoplay]}
      spaceBetween={30}
      breakpoints={{
        640: { slidesPerView: 1 },
        768: { slidesPerView: 2 },
        1024: { slidesPerView: 3 },
      }}
    >
      {products.map((product: Product) => {
        const discountedPrice = (
          product.finalPrice *
          (1 - product.discount / 100)
        ).toFixed(2);
        return (
          <SwiperSlide key={product.id}>
            <div className="add-more-item item active">
              <Link to="#" className="gi-btn-2">
                +
              </Link>
              <div className="add-more-img">
                <img
                  src={`/assets/images/${product.image}`}
                  alt={product.title}
                />
              </div>
              <div className="add-more-info">
                <h5>{product.title}</h5>
                <StarRating item={{ rating: product.rating }} />
                <span className="gi-price">
                  <span className="new-price">${discountedPrice}</span>
                  <span className="old-price">${product.finalPrice}</span>
                </span>
              </div>
            </div>
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
};

export default ProductDiscountCarousel;
