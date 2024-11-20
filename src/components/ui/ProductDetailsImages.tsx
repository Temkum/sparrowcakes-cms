import { useState } from 'react';
import { Navigation, Pagination, Thumbs } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/thumbs';
import '../../styles/ProductDetailsImages.scss';

const ProductDetailsImages = () => {
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);

  const productImages = [
    { id: 1, image: '/assets/images/4_1.jpg', title: 'Product 1' },
    { id: 2, image: '/assets/images/2_1.jpg', title: 'Product 2' },
    { id: 3, image: '/assets/images/3_1.jpg', title: 'Product 3' },
    { id: 4, image: '/assets/images/1_1.jpg', title: 'Product 4' },
    { id: 5, image: '/assets/images/5_1.jpg', title: 'Product 5' },
  ];

  return (
    <div className="single-pro-img single-pro-img-no-sidebar">
      <div className="single-product-scroll">
        {/* Main Product Swiper */}
        <Swiper
          spaceBetween={10}
          slidesPerView={1}
          //   navigation
          //   pagination={{ clickable: true }}
          modules={[Thumbs, Navigation, Pagination]}
          thumbs={thumbsSwiper ? { swiper: thumbsSwiper } : undefined}
          className="single-product-cover"
        >
          {productImages.map((image, index) => (
            <SwiperSlide key={index}>
              <img src={image.image} alt={`product-${index}`} />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Thumbnail Swiper */}
        <Swiper
          modules={[Thumbs]}
          watchSlidesProgress
          slidesPerView={4}
          spaceBetween={10}
          onSwiper={setThumbsSwiper}
          className="single-nav-thumb"
        >
          {productImages.map((image, index) => (
            <SwiperSlide key={index}>
              <img src={image.image} alt={`thumbnail-${index}`} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default ProductDetailsImages;
