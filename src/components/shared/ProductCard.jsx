import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { FaHeart, FaRegHeart, FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { addToCart, toggleWishlist } from "../../store/actions";
import { formatPrice } from "../../utils/formatPrice";
import truncateText from "../../utils/truncateText";

const Stars = ({ rating = 0, count = 0 }) => {
  const full = Math.floor(rating);
  const half = rating - full >= 0.4;
  return (
    <div className="flex items-center gap-1 text-[11px]">
      <span className="flex items-center gap-[1px] text-gold">
        {[1, 2, 3, 4, 5].map((i) => {
          if (i <= full) return <FaStar key={i} />;
          if (i === full + 1 && half) return <FaStarHalfAlt key={i} />;
          return <FaRegStar key={i} className="text-[#d8cfc2]" />;
        })}
      </span>
      <span className="text-muted">({count || 0})</span>
    </div>
  );
};

const ProductCard = ({
  productId,
  productName,
  image,
  description,
  quantity,
  price,
  discount,
  specialPrice,
  brand,
  department,
  categoryName,
  variants = [],
  avgRating = 0,
  reviewCount = 0,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const wishlistIds = useSelector((state) => state.wishlist?.ids || []);
  const isSaved = wishlistIds.includes(productId);
  const isAvailable = Number(quantity) > 0;

  const off = price > 0 ? Math.round(((price - specialPrice) / price) * 100) : 0;
  const singleVariant = variants.length === 1 ? variants[0] : null;
  const needsChoice = variants.length > 1;

  const handleAdd = (e) => {
    e.stopPropagation();
    if (needsChoice) {
      navigate(`/products/${productId}`);
      return;
    }
    dispatch(
      addToCart(
        {
          productId,
          productName,
          image,
          description,
          quantity,
          price,
          specialPrice,
          variantLabel: singleVariant?.label,
        },
        1,
        toast,
      ),
    );
  };

  return (
    <div className="group bg-white border border-line rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_22px_40px_-28px_rgba(28,26,23,0.55)]">
      <div
        className="relative aspect-[4/5] overflow-hidden cursor-pointer bg-sand"
        onClick={() => navigate(`/products/${productId}`)}
      >
        <img
          src={image}
          alt={productName}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {off > 0 && (
          <span className="absolute top-3 left-3 bg-terra text-white text-[9px] tracking-[0.14em] uppercase px-2.5 py-1 rounded-full">
            -{off}%
          </span>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            dispatch(toggleWishlist(productId, toast));
          }}
          aria-label="Save to wishlist"
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/95 border border-line grid place-items-center text-ink hover:text-terra transition"
        >
          {isSaved ? <FaHeart size={13} className="text-terra" /> : <FaRegHeart size={13} />}
        </button>
        {!isAvailable && (
          <div className="absolute inset-0 bg-white/60 grid place-items-center">
            <span className="bg-ink text-white text-[10px] tracking-[0.16em] uppercase px-3 py-1.5 rounded-full">
              Sold out
            </span>
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="text-[9.5px] tracking-[0.18em] uppercase text-muted mb-1.5">
          {department === "BEAUTY" ? "Beauty" : "Fashion"}
          {categoryName ? ` · ${categoryName}` : ""}
        </div>

        <h3
          className="text-[14px] font-semibold leading-snug mb-1.5 cursor-pointer hover:text-terra transition-colors"
          onClick={() => navigate(`/products/${productId}`)}
        >
          {truncateText(productName, 46)}
        </h3>

        <Stars rating={avgRating} count={reviewCount} />

        <div className="flex flex-wrap gap-1.5 mt-2.5 mb-3 min-h-[22px]">
          {variants.slice(0, 5).map((v) => (
            <span
              key={v.variantId}
              className={`text-[10px] border border-line px-2 py-[3px] rounded ${
                Number(v.stock) > 0 ? "text-[#5c5349]" : "text-[#c6bfb6] line-through"
              }`}
            >
              {v.label}
            </span>
          ))}
          {variants.length > 5 && (
            <span className="text-[10px] text-muted px-1 py-[3px]">+{variants.length - 5}</span>
          )}
        </div>

        <div className="flex items-end justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-[15px] font-bold text-ink">{formatPrice(specialPrice)}</span>
              {off > 0 && (
                <span className="text-[11px] text-[#b6ada2] line-through">{formatPrice(price)}</span>
              )}
            </div>
            {brand && <div className="text-[10px] text-muted mt-0.5">{brand}</div>}
          </div>
          <button
            onClick={handleAdd}
            disabled={!isAvailable}
            className={`px-3 py-2 rounded-lg border text-[10px] tracking-[0.12em] uppercase font-semibold transition ${
              isAvailable
                ? "border-ink text-ink hover:bg-ink hover:text-white"
                : "border-line text-[#c6bfb6] cursor-not-allowed"
            }`}
          >
            {isAvailable ? (needsChoice ? "Select" : "Add") : "Sold out"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
