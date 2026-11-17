import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  FaBoxOpen,
  FaCheckCircle,
  FaExclamationTriangle,
  FaTruck,
  FaUndoAlt,
} from "react-icons/fa";
import HeroBanner from "./HeroBanner";
import ProductCard from "../shared/ProductCard";
import Loader from "../shared/Loader";
import { fetchProducts } from "../../store/actions";

const categoryCards = [
  { name: "Women", emoji: "👗", link: "/products?category=Women" },
  { name: "Men", emoji: "👕", link: "/products?category=Men" },
  { name: "Footwear", emoji: "👟", link: "/products?category=Footwear" },
  { name: "Accessories", emoji: "👜", link: "/products?category=Accessories" },
  { name: "Skincare", emoji: "🧴", link: "/products?category=Skincare" },
  { name: "Makeup", emoji: "💄", link: "/products?category=Makeup" },
  { name: "Haircare", emoji: "💇", link: "/products?category=Haircare" },
  { name: "Fragrance", emoji: "🌸", link: "/products?category=Fragrance" },
];

const trustItems = [
  { icon: FaTruck, title: "Cash on Delivery", text: "Nationwide, Rs. 199 only" },
  { icon: FaUndoAlt, title: "7-day returns", text: "Easy exchange policy" },
  { icon: FaCheckCircle, title: "100% authentic", text: "Original products only" },
  { icon: FaBoxOpen, title: "2–4 days", text: "Karachi, Lahore, Islamabad" },
];

const SectionHead = ({ title, subtitle, link = "/products" }) => (
  <div className="flex items-end justify-between gap-4 mb-5">
    <div>
      <h2 className="font-display text-[26px] sm:text-[31px] text-ink leading-none">{title}</h2>
      {subtitle && <p className="text-[12.5px] text-muted mt-2">{subtitle}</p>}
    </div>
    <Link
      to={link}
      className="text-[10.5px] tracking-[0.18em] uppercase border-b border-ink pb-0.5 shrink-0 hover:text-terra hover:border-terra transition"
    >
      View all
    </Link>
  </div>
);

const Home = () => {
  const dispatch = useDispatch();
  const { products } = useSelector((state) => state.products);
  const { isLoading, errorMessage } = useSelector((state) => state.errors);

  useEffect(() => {
    dispatch(fetchProducts("pageSize=48&pageNumber=0&sortBy=productId&sortOrder=asc"));
  }, [dispatch]);

  const list = products || [];
  const fashion = list.filter((p) => p.department === "FASHION");
  const beauty = list.filter((p) => p.department === "BEAUTY");
  const trending = [...fashion.slice(0, 4), ...beauty.slice(0, 4)];

  return (
    <div className="pb-4">
      <HeroBanner />

      {/* Trust strip */}
      <section className="rangva-container px-4 lg:px-6 mt-5">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {trustItems.map((item) => (
            <div
              key={item.title}
              className="flex items-start gap-3 bg-white border border-line rounded-xl px-4 py-3"
            >
              <item.icon className="text-terra mt-0.5 shrink-0" size={17} />
              <div>
                <div className="text-[12.5px] font-semibold text-ink">{item.title}</div>
                <div className="text-[11.5px] text-muted mt-0.5">{item.text}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="rangva-container px-4 lg:px-6 mt-11">
        <SectionHead
          title="Shop by category"
          subtitle="Fashion aur beauty — dono ek hi jagah"
        />
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {categoryCards.map((cat) => (
            <Link
              key={cat.name}
              to={cat.link}
              className="bg-white border border-line rounded-xl px-2 py-4 text-center hover:-translate-y-1 hover:shadow-[0_14px_28px_-20px_rgba(28,26,23,0.6)] hover:border-[#d9c9b7] transition"
            >
              <div className="text-[24px]">{cat.emoji}</div>
              <div className="text-[12px] font-semibold mt-2">{cat.name}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Trending */}
      <section className="rangva-container px-4 lg:px-6 mt-12">
        <SectionHead title="Trending this week" subtitle="Fashion aur beauty ke bestsellers" />
        {isLoading && !products ? (
          <div className="flex justify-center py-16"><Loader /></div>
        ) : errorMessage ? (
          <div className="flex justify-center items-center h-[180px] text-ink">
            <FaExclamationTriangle className="mr-2" />
            <span>{errorMessage}</span>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
            {trending.map((item) => (
              <ProductCard key={item.productId} {...item} />
            ))}
          </div>
        )}
      </section>

      {/* Department split */}
      <section className="rangva-container px-4 lg:px-6 mt-12 grid md:grid-cols-2 gap-4">
        <Link
          to="/products?department=FASHION"
          className="group relative rounded-2xl overflow-hidden min-h-[220px] bg-sand"
        >
          <img
            src={`${import.meta.env.VITE_BACK_END_URL}/images/u_1487222477894-8943e31ef7b2.jpg`}
            alt="Fashion"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink/80 via-ink/40 to-transparent" />
          <div className="relative p-8 text-white max-w-[280px]">
            <div className="text-[9.5px] tracking-[0.26em] uppercase text-white/70">Fashion</div>
            <h3 className="font-display text-[30px] leading-tight mt-2">Everyday essentials</h3>
            <p className="text-[12px] text-white/80 mt-2">Kurtas, denim, footwear aur accessories</p>
            <span className="inline-block mt-5 text-[10.5px] tracking-[0.16em] uppercase border-b border-white/70 pb-0.5">
              Shop clothing
            </span>
          </div>
        </Link>

        <Link
          to="/products?department=BEAUTY"
          className="group relative rounded-2xl overflow-hidden min-h-[220px] bg-sand"
        >
          <img
            src={`${import.meta.env.VITE_BACK_END_URL}/images/u_1598440947619-2c35fc9aa908.jpg`}
            alt="Beauty"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#4a2c2a]/85 via-[#4a2c2a]/40 to-transparent" />
          <div className="relative p-8 text-white max-w-[280px]">
            <div className="text-[9.5px] tracking-[0.26em] uppercase text-white/70">Beauty</div>
            <h3 className="font-display text-[30px] leading-tight mt-2">Skin &amp; glow</h3>
            <p className="text-[12px] text-white/80 mt-2">Skincare, makeup, haircare aur fragrance</p>
            <span className="inline-block mt-5 text-[10.5px] tracking-[0.16em] uppercase border-b border-white/70 pb-0.5">
              Shop beauty
            </span>
          </div>
        </Link>
      </section>

      {/* Beauty new in */}
      <section className="rangva-container px-4 lg:px-6 mt-12">
        <SectionHead
          title="New in beauty"
          subtitle="Skincare aur makeup ke fresh arrivals"
          link="/products?department=BEAUTY&sortby=desc"
        />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
          {beauty.slice(0, 4).map((item) => (
            <ProductCard key={item.productId} {...item} />
          ))}
        </div>
      </section>

      {/* Promo strip */}
      <section className="rangva-container px-4 lg:px-6 mt-12 grid sm:grid-cols-3 gap-4">
        <div className="rounded-2xl bg-[#EFE4D4] p-7 min-h-[160px] flex flex-col justify-end relative overflow-hidden">
          <span className="absolute right-2 top-2 text-[68px] opacity-25">🌙</span>
          <h4 className="font-display text-[23px] leading-tight">Eid Edit 2026</h4>
          <p className="text-[11.5px] text-[#5f5449] mt-1.5">Festive lawn, kurtas &amp; gift sets</p>
        </div>
        <div className="rounded-2xl bg-[#F2E2E0] p-7 min-h-[160px] flex flex-col justify-end relative overflow-hidden">
          <span className="absolute right-2 top-2 text-[68px] opacity-25">✨</span>
          <h4 className="font-display text-[23px] leading-tight">Glow Week</h4>
          <p className="text-[11.5px] text-[#5f5449] mt-1.5">Skincare up to 40% off</p>
        </div>
        <div className="rounded-2xl bg-[#E7EDE2] p-7 min-h-[160px] flex flex-col justify-end relative overflow-hidden">
          <span className="absolute right-2 top-2 text-[68px] opacity-25">🎁</span>
          <h4 className="font-display text-[23px] leading-tight">Gift Hampers</h4>
          <p className="text-[11.5px] text-[#5f5449] mt-1.5">Beauty + fashion combos</p>
        </div>
      </section>
    </div>
  );
};

export default Home;
