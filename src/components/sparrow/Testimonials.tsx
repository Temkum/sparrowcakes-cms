import { TestimonialCard } from './TestimonialCard';
import { testimonials } from '@/utilities/data';

const Testimonials = () => {
  return (
    <div className="bg-white dark:bg-gray-100 py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Sweet Words From Our Customers
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our cakes and pastries are crafted with love and the finest
            ingredients. Each bite is a delightful experience, and our
            commitment to quality ensures that every treat is as delicious as it
            is beautiful.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mt-16">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.name} {...testimonial} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
