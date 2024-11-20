import Footer from '@/components/Footer';
import Header from '@/components/Header';
import '../styles/style.css';
import ShopTop from '@/components/ShopTop';
import SelectOptions from '@/components/ui/SelectOptions';
import Products from '@/components/Products';
import Sidebar from '@/components/Sidebar';

const Shop = () => {
  return (
    <>
      <Header />
      <section className="gi-shop padding-tb-30">
        <div className="container">
          <div className="row">
            <div className="gi-shop-rightside col-lg-12 col-md-12 margin-b-30">
              {/* Shop Top Start */}
              <ShopTop />
              {/* Shop Top End */}
              {/* Select Bar Start */}
              <SelectOptions />
              {/* Select Bar End */}
              {/* Shop content Start */}
              <Products />
              {/*Shop content End */}
            </div>
            {/* Sidebar Area Start */}
            <Sidebar />
            {/* Sidebar Area End */}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Shop;
