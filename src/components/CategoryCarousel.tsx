import '@/styles/CategoryCarousel.scss';
import { categories } from '@/utils/constants';

const CategoryCarousel = () => {
  return (
    <section className="gi-category body-bg padding-tb-40 fade-in-up">
      <div className="container">
        <div className="row m-b-minus-15px">
          <div className="col-xl-12 border-content-color">
            <div className="gi-category-block">
              {categories.map((category, index) => (
                <div
                  className={`gi-cat-box gi-cat-box-${(index % 6) + 1}`}
                  key={category.id}
                >
                  <div className="gi-cat-icon">
                    {category.discount && (
                      <span className="gi-lbl">{category.discount}</span>
                    )}
                    <span className="icon">{category.icon}</span>
                    <div className="gi-cat-detail">
                      <a href={category.link}>
                        <h4 className="gi-cat-title">{category.title}</h4>
                      </a>
                      <p className="items">{category.itemCount} Items</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategoryCarousel;
