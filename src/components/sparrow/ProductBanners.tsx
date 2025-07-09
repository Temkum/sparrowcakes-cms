import { Button } from '@/components/ui/button';
import { BannerProps } from '@/types';
import { banners } from '@/utilities/data';

function ProductBanner({
  title,
  discount,
  image,
  backgroundColor,
  onClick,
}: BannerProps) {
  return (
    <div
      className={`${backgroundColor} rounded-2xl overflow-hidden relative h-[280px] flex items-center`}
    >
      {/* Decorative circles */}
      <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-black/5 translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-40 h-40 rounded-full bg-black/5 -translate-x-1/2 translate-y-1/2" />

      {/* Content */}
      <div className="flex-1 z-10 p-8">
        <h3 className="text-2xl font-bold mb-4 whitespace-pre-line leading-tight">
          {title}
        </h3>
        <p className="mb-6">
          <span className="text-emerald-500 text-3xl font-bold">
            {discount}%
          </span>
          <span className="text-gray-600 ml-2">Off on first order</span>
        </p>
        <Button
          onClick={onClick}
          className="bg-emerald-500 hover:bg-black text-white"
        >
          Shop Now
        </Button>
      </div>

      {/* Image */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2">
        <div className="relative w-[280px] h-[230px] rounded-full overflow-hidden bg-black">
          <img
            src={image || '/placeholder.svg'}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}

export default function ProductBanners() {
  return (
    <section className="py-12 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {banners.map((banner, index) => (
            <ProductBanner
              key={index}
              {...banner}
              onClick={() => console.log(`Clicked on banner ${index + 1}`)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
