import { Link } from 'react-router-dom';

const GistCard = () => {
  return (
    <>
      <article className="overflow-hidden rounded-lg border border-gray-100 bg-white shadow-xs">
        <img
          alt=""
          src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
          className="h-56 w-full object-cover"
        />

        <div className="p-4 sm:p-6">
          <Link to="/">
            <h3 className="text-lg font-medium text-gray-900">
              Discover Our Delicious Cakes
            </h3>
          </Link>

          <p className="mt-2 line-clamp-3 text-sm/relaxed text-gray-500">
            Explore our wide variety of cakes made with the finest ingredients.
            Whether you're celebrating a special occasion or just craving
            something sweet, we have the perfect cake for you.
          </p>

          <Link
            to="/"
            className="group mt-4 inline-flex items-center gap-1 text-sm font-medium text-blue-600"
          >
            Find out more
            <span
              aria-hidden="true"
              className="block transition-all group-hover:ms-0.5 rtl:rotate-180"
            >
              &rarr;
            </span>
          </Link>
        </div>
      </article>
    </>
  );
};

export default GistCard;
