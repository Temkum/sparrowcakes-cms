import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { Link } from 'react-router-dom';

const Carousel: React.FC = () => {
  return (
    <Swiper
      modules={[Navigation, Pagination, Autoplay]}
      navigation
      pagination={{ clickable: true }}
      autoplay={{ delay: 3000 }}
      loop={true}
      spaceBetween={30}
      slidesPerView={3}
      breakpoints={{
        640: { slidesPerView: 1 },
        768: { slidesPerView: 2 },
        1024: { slidesPerView: 3 },
      }}
    >
      <SwiperSlide>
        <div className="add-more-item item active">
          <Link to="#" className="gi-btn-2">
            +
          </Link>
          <div className="add-more-img">
            <img src="/assets/images/8_1.jpg" alt="product" />
          </div>
          <div className="add-more-info">
            <h5>Honey Spiced Nuts</h5>
            <span className="gi-pro-rating">
              <i className="gicon gi-star fill" />
              <i className="gicon gi-star fill" />
              <i className="gicon gi-star fill" />
              <i className="gicon gi-star" />
              <i className="gicon gi-star" />
            </span>
            <span className="gi-price">
              <span className="new-price">$32.00</span>
              <span className="old-price">$45.00</span>
            </span>
          </div>
        </div>
      </SwiperSlide>
      <SwiperSlide>
        <div className="add-more-item">
          <Link to="#" className="gi-btn-2">
            +
          </Link>
          <div className="add-more-img">
            <img src="/assets/images/2_1.jpg" alt="product" />
          </div>
          <div className="add-more-info">
            <h5>Dates Value Pouch</h5>
            <span className="gi-pro-rating">
              <i className="gicon gi-star fill" />
              <i className="gicon gi-star fill" />
              <i className="gicon gi-star fill" />
              <i className="gicon gi-star fill" />
              <i className="gicon gi-star fill" />
            </span>
            <span className="gi-price">
              <span className="new-price">$56.00</span>
              <span className="old-price">$60.00</span>
            </span>
          </div>
        </div>
      </SwiperSlide>
      <SwiperSlide>
        <div className="add-more-item">
          <Link to="#" className="gi-btn-2">
            +
          </Link>
          <div className="add-more-img">
            <img src="/assets/images/5_1.jpg" alt="product" />
          </div>
          <div className="add-more-info">
            <h5>Graps Mix Snack</h5>
            <span className="gi-pro-rating">
              <i className="gicon gi-star fill" />
              <i className="gicon gi-star fill" />
              <i className="gicon gi-star" />
              <i className="gicon gi-star" />
              <i className="gicon gi-star" />
            </span>
            <span className="gi-price">
              <span className="new-price">$28.00</span>
              <span className="old-price">$35.00</span>
            </span>
          </div>
        </div>
      </SwiperSlide>
      <SwiperSlide>
        <div className="add-more-item">
          <Link to="#" className="gi-btn-2">
            +
          </Link>
          <div className="add-more-img">
            <img src="/assets/images/9_1.jpg" alt="product" />
          </div>
          <div className="add-more-info">
            <h5>Roasted Almonds Pack</h5>
            <span className="gi-pro-rating">
              <i className="gicon gi-star fill" />
              <i className="gicon gi-star fill" />
              <i className="gicon gi-star fill" />
              <i className="gicon gi-star fill" />
              <i className="gicon gi-star fill" />
            </span>
            <span className="gi-price">
              <span className="new-price">$16.00</span>
              <span className="old-price">$23.00</span>
            </span>
          </div>
        </div>
      </SwiperSlide>
    </Swiper>
  );
};

export default Carousel;
