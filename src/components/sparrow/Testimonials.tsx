import { TestimonialCard } from './TestimonialCard';
import { testimonials } from '@/utilities/data';

const Testimonials = () => {
  return (
    <div className="bg-white dark:bg-gray-100 py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Great Words From People
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our products are designed to be easy to use, and easy to love, no
            matter how you use them. And with our commitment to quality, you can
            trust that they'll be durable and long-lasting.
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
