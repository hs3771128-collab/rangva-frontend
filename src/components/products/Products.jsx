import { FaExclamationTriangle, FaRegSmile } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import ProductCard from "../shared/ProductCard";
import { fetchCategories } from "../../store/actions";
import Filter from "./Filter";
import useProductFilter from "../../hooks/useProductFilter";
import Loader from "../shared/Loader";
import Paginations from "../shared/Paginations";

const Products = () => {
  const { isLoading, errorMessage } = useSelector((state) => state.errors);
  const { products, categories, pagination } = useSelector(
    (state) => state.products,
  );
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  useProductFilter();

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const department = searchParams.get("department");
  const category = searchParams.get("category");
  const keyword = searchParams.get("keyword");

  const heading = keyword
    ? `Search: ${keyword}`
    : category && department
    ? `${department === "BEAUTY" ? "Beauty" : "Fashion"} · ${category}`
    : category
    ? category
    : department === "FASHION"
    ? "Fashion"
    : department === "BEAUTY"
    ? "Beauty"
    : "All products";

  const subtitle = department === "BEAUTY"
    ? "Skincare, makeup, haircare aur fragrance"
    : department === "FASHION"
    ? "Clothing, footwear aur accessories"
    : "Fashion aur beauty — dono ek hi jagah";

  return (
    <div className="rangva-container px-4 lg:px-6 py-8 lg:py-10">
      <div className="mb-6">
        <div className="text-[10px] tracking-[0.22em] uppercase text-terra mb-2">
          Rangva store
        </div>
        <h1 className="font-display text-[30px] sm:text-[38px] leading-none text-ink">
          {heading}
        </h1>
        <p className="text-[12.5px] text-muted mt-2">{subtitle}</p>
      </div>

      <Filter categories={categories ? categories : []} />

      {isLoading ? (
        <div className="flex justify-center py-24">
          <Loader />
        </div>
      ) : errorMessage ? (
        <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
          <FaExclamationTriangle className="text-terra text-2xl" />
          <p className="text-[14px] text-ink">{errorMessage}</p>
          <Link
            to="/products"
            className="mt-1 inline-flex h-10 items-center rounded-full bg-ink px-5 text-[11px] tracking-[0.14em] uppercase font-semibold text-white hover:bg-terra transition"
          >
            Clear filters
          </Link>
        </div>
      ) : (
        <div className="min-h-[500px] mt-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[12px] text-muted">
              {pagination?.totalElements || 0} item
              {(pagination?.totalElements || 0) === 1 ? "" : "s"} found
            </p>
          </div>

          {products && products.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-5">
              {products.map((item) => (
                <ProductCard key={item.productId} {...item} />
              ))}
            </div>
          ) : (
            <div className="bg-white border border-line rounded-2xl py-16 text-center">
              <FaRegSmile className="mx-auto text-[#c6bfb6] mb-4" size={36} />
              <h3 className="font-display text-[22px] mb-1.5">Koi product nahi mila</h3>
              <p className="text-[12.5px] text-muted">
                Filters thora kam karein ya doosra keyword try karein.
              </p>
            </div>
          )}

          <div className="flex justify-center pt-10">
            <Paginations
              numberOfPage={pagination?.totalPages}
              totalProducts={pagination?.totalElements}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
