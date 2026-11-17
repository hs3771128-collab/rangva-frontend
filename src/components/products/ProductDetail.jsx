import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import {
  FaCheckCircle,
  FaHeart,
  FaMinus,
  FaPlus,
  FaRegHeart,
  FaRegStar,
  FaStar,
  FaStarHalfAlt,
  FaTruck,
  FaUndoAlt,
} from "react-icons/fa";
import { FiChevronRight } from "react-icons/fi";
import {
  addToCart,
  fetchProductById,
  fetchProductReviews,
  fetchProducts,
  submitProductReview,
  toggleWishlist,
} from "../../store/actions";
import { formatPrice, deliveryFeeFor, FREE_DELIVERY_THRESHOLD } from "../../utils/formatPrice";
import ProductCard from "../shared/ProductCard";
import Skeleton from "../shared/Skeleton";

const Stars = ({ rating = 0, size = 13 }) => (
  <span className="flex items-center gap-[2px] text-gold">
    {[1, 2, 3, 4, 5].map((i) => {
      if (i <= Math.floor(rating)) return <FaStar key={i} size={size} />;
      if (i === Math.floor(rating) + 1 && rating % 1 >= 0.4)
        return <FaStarHalfAlt key={i} size={size} />;
      return <FaRegStar key={i} size={size} className="text-[#d8cfc2]" />;
    })}
  </span>
);

const ProductDetail = () => {
  const { productId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { productDetail, reviews, products } = useSelector((state) => state.products);
  const { isLoading } = useSelector((state) => state.errors);
  const { user } = useSelector((state) => state.auth);
  const wishlistIds = useSelector((state) => state.wishlist?.ids || []);

  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [imageLoaded, setImageLoaded] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ mode: "onTouched", defaultValues: { rating: 5 } });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setSelectedVariant(null);
    setQuantity(1);
    setImageLoaded(false);
    dispatch(fetchProductById(productId));
    dispatch(fetchProductReviews(productId));
  }, [productId, dispatch]);

  const product = productDetail?.productId === Number(productId) ? productDetail : null;

  const variants = product?.variants || [];
  const hasVariants = variants.length > 1;
  const firstAvailable = variants.find((v) => Number(v.stock) > 0) || variants[0];

  useEffect(() => {
    if (product && !selectedVariant && firstAvailable) {
      setSelectedVariant(firstAvailable);
    }
  }, [product, firstAvailable, selectedVariant]);

  useEffect(() => {
    if (product?.categoryName) {
      dispatch(
        fetchProducts(
          `pageSize=8&pageNumber=0&category=${encodeURIComponent(product.categoryName)}`,
        ),
      );
    }
  }, [dispatch, product?.categoryName]);

  const selectedStock = selectedVariant ? Number(selectedVariant.stock) : Number(product?.quantity || 0);
  const maxQuantity = Math.max(1, Math.min(selectedStock || 1, 10));
  const isAvailable = Number(product?.quantity) > 0;

  const off = product && product.price > 0
    ? Math.round(((product.price - product.specialPrice) / product.price) * 100)
    : 0;

  const isSaved = wishlistIds.includes(Number(productId));

  const breakdown = useMemo(() => {
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    (reviews || []).forEach((r) => {
      if (counts[r.rating] !== undefined) counts[r.rating] += 1;
    });
    return counts;
  }, [reviews]);

  const related = (products || [])
    .filter((p) => p.productId !== Number(productId) && p.categoryName === product?.categoryName)
    .slice(0, 4);

  const handleAddToCart = () => {
    if (!user) {
      toast.error("Cart me add karne ke liye pehle login karein");
      navigate("/login");
      return;
    }
    if (hasVariants && !selectedVariant) {
      toast.error("Please size / shade select karein");
      return;
    }
    dispatch(
      addToCart(
        {
          productId: product.productId,
          productName: product.productName,
          image: product.image,
          description: product.description,
          quantity: product.quantity,
          price: product.price,
          specialPrice: product.specialPrice,
          variantLabel: selectedVariant?.label,
        },
        quantity,
        toast,
      ),
    );
  };

  const handleReviewSubmit = (data) => {
    if (!user) {
      toast.error("Review dene ke liye login karein");
      return;
    }
    dispatch(
      submitProductReview(
        productId,
        {
          rating: Number(data.rating),
          title: data.title,
          comment: data.comment,
        },
        toast,
        reset,
      ),
    );
  };

  if (!product) {
    if (isLoading) {
      return (
        <div className="rangva-container px-4 lg:px-6 py-14">
          <Skeleton />
        </div>
      );
    }
    return (
      <div className="rangva-container px-4 py-24 text-center">
        <h2 className="font-display text-2xl mb-3">Product not found</h2>
        <Link to="/products" className="text-terra underline text-sm">
          Back to all products
        </Link>
      </div>
    );
  }

  return (
    <div className="rangva-container px-4 lg:px-6 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center flex-wrap gap-1.5 text-[11.5px] text-muted mb-6">
        <Link to="/" className="hover:text-terra">Home</Link>
        <FiChevronRight size={11} />
        <Link to="/products" className="hover:text-terra">Shop</Link>
        <FiChevronRight size={11} />
        {product.categoryName && (
          <>
            <Link
              to={`/products?category=${encodeURIComponent(product.categoryName)}`}
              className="hover:text-terra"
            >
              {product.categoryName}
            </Link>
            <FiChevronRight size={11} />
          </>
        )}
        <span className="text-ink">{product.productName}</span>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 lg:gap-14">
        {/* Gallery */}
        <div className="lg:sticky lg:top-24 self-start">
          <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-sand border border-line">
            {!imageLoaded && <div className="absolute inset-0 animate-pulse bg-sand" />}
            <img
              src={product.image}
              alt={product.productName}
              onLoad={() => setImageLoaded(true)}
              className="w-full h-full object-cover"
            />
            {off > 0 && (
              <span className="absolute top-4 left-4 bg-terra text-white text-[10px] tracking-[0.16em] uppercase px-3 py-1.5 rounded-full">
                {off}% off
              </span>
            )}
            <button
              onClick={() => dispatch(toggleWishlist(product.productId, toast))}
              aria-label="Wishlist"
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/95 border border-line grid place-items-center hover:text-terra transition"
            >
              {isSaved ? <FaHeart className="text-terra" /> : <FaRegHeart />}
            </button>
          </div>
          <div className="grid grid-cols-3 gap-3 mt-3 text-[11px] text-muted">
            <div className="bg-white border border-line rounded-lg px-3 py-2.5 flex items-center gap-2">
              <FaTruck className="text-terra shrink-0" /> 2–4 din delivery
            </div>
            <div className="bg-white border border-line rounded-lg px-3 py-2.5 flex items-center gap-2">
              <FaCheckCircle className="text-terra shrink-0" /> COD available
            </div>
            <div className="bg-white border border-line rounded-lg px-3 py-2.5 flex items-center gap-2">
              <FaUndoAlt className="text-terra shrink-0" /> 7-day returns
            </div>
          </div>
        </div>

        {/* Info */}
        <div>
          <div className="text-[10px] tracking-[0.2em] uppercase text-terra mb-2">
            {product.brand || "Rangva"} · {product.department === "BEAUTY" ? "Beauty" : "Fashion"}
          </div>
          <h1 className="font-display text-[28px] sm:text-[36px] leading-[1.12] text-ink">
            {product.productName}
          </h1>

          <div className="flex items-center gap-2.5 mt-3">
            <Stars rating={product.avgRating || 0} />
            <span className="text-[12px] text-muted">
              {(product.avgRating || 0).toFixed(1)} · {product.reviewCount || 0} reviews
            </span>
          </div>

          <div className="flex items-baseline gap-3 mt-5">
            <span className="text-[28px] font-bold text-ink">{formatPrice(product.specialPrice)}</span>
            {off > 0 && (
              <>
                <span className="text-[15px] text-[#b6ada2] line-through">{formatPrice(product.price)}</span>
                <span className="text-[11px] font-semibold text-terra bg-[#f7e6e1] px-2 py-1 rounded">
                  Save {formatPrice(product.price - product.specialPrice)}
                </span>
              </>
            )}
          </div>
          <p className="text-[11.5px] text-muted mt-1.5">
            Inclusive of all taxes. {deliveryFeeFor(product.specialPrice) === 0
              ? "Free delivery on this item."
              : `Delivery Rs. 199 — free over ${formatPrice(FREE_DELIVERY_THRESHOLD)}.`}
          </p>

          <p className="text-[13.5px] leading-7 text-[#5f544a] mt-5">{product.description}</p>

          {/* Variants */}
          {variants.length > 0 && (
            <div className="mt-7">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-[11px] tracking-[0.16em] uppercase font-semibold text-ink">
                  {variants[0]?.variantType === "SHADE"
                    ? "Shade"
                    : variants[0]?.variantType === "VOLUME"
                    ? "Size"
                    : variants[0]?.variantType === "SIZE"
                    ? "Size"
                    : "Option"}
                </span>
                {selectedVariant && (
                  <span className="text-[11.5px] text-muted">Selected: {selectedVariant.label}</span>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {variants.map((v) => {
                  const soldOut = Number(v.stock) <= 0;
                  const active = selectedVariant?.variantId === v.variantId;
                  return (
                    <button
                      key={v.variantId}
                      disabled={soldOut}
                      onClick={() => {
                        setSelectedVariant(v);
                        setQuantity(1);
                      }}
                      className={`min-w-[52px] px-4 h-10 rounded-lg border text-[12.5px] font-medium transition ${
                        active
                          ? "border-ink bg-ink text-white"
                          : soldOut
                          ? "border-line text-[#c6bfb6] line-through cursor-not-allowed"
                          : "border-line bg-white text-ink hover:border-ink"
                      }`}
                    >
                      {v.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quantity + add */}
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <div className="flex items-center border border-line rounded-lg bg-white h-11">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-10 h-full grid place-items-center text-ink hover:text-terra"
                aria-label="Decrease"
              >
                <FaMinus size={11} />
              </button>
              <span className="w-9 text-center text-[13px] font-semibold">{quantity}</span>
              <button
                onClick={() =>
                  setQuantity((q) => {
                    if (q >= maxQuantity) {
                      toast.error(`Only ${maxQuantity} available`);
                      return q;
                    }
                    return q + 1;
                  })
                }
                className="w-10 h-full grid place-items-center text-ink hover:text-terra"
                aria-label="Increase"
              >
                <FaPlus size={11} />
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={!isAvailable}
              className={`flex-1 min-w-[180px] h-11 rounded-lg text-[11.5px] tracking-[0.16em] uppercase font-semibold transition ${
                isAvailable
                  ? "bg-ink text-white hover:bg-terra"
                  : "bg-[#ddd5ca] text-white cursor-not-allowed"
              }`}
            >
              {isAvailable ? "Add to cart" : "Sold out"}
            </button>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={!isAvailable}
            className="w-full mt-3 h-11 rounded-lg border border-ink text-[11.5px] tracking-[0.16em] uppercase font-semibold text-ink hover:bg-ink hover:text-white transition disabled:opacity-50"
          >
            Buy it now
          </button>

          <div className="mt-6 bg-white border border-line rounded-xl divide-y divide-line text-[12.5px]">
            <div className="flex items-center gap-3 p-4">
              <FaTruck className="text-terra" />
              <span>
                <b>Cash on Delivery</b> — poore Pakistan me, Rs. 199 delivery
                (Rs. 3,000 se upar free).
              </span>
            </div>
            <div className="flex items-center gap-3 p-4">
              <FaCheckCircle className="text-terra" />
              <span>
                <b>100% authentic</b> — original brands, quality checked before dispatch.
              </span>
            </div>
            <div className="flex items-center gap-3 p-4">
              <FaUndoAlt className="text-terra" />
              <span>
                <b>7-day easy returns</b> — unused item, original packing ke saath.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <section className="mt-14 grid lg:grid-cols-[300px_1fr] gap-8 items-start">
        <div className="bg-white border border-line rounded-2xl p-6">
          <h2 className="font-display text-[22px] text-ink mb-1">Customer reviews</h2>
          <p className="text-[12px] text-muted mb-4">Verified buyers ki raay</p>

          <div className="flex items-end gap-3">
            <div className="text-[46px] leading-none font-display">{(product.avgRating || 0).toFixed(1)}</div>
            <div className="pb-1">
              <Stars rating={product.avgRating || 0} size={14} />
              <div className="text-[11px] text-muted mt-1">{product.reviewCount || 0} reviews</div>
            </div>
          </div>

          <div className="mt-5 space-y-2">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = breakdown[star] || 0;
              const total = reviews?.length || 0;
              const width = total ? (count / total) * 100 : 0;
              return (
                <div key={star} className="flex items-center gap-2 text-[11px] text-muted">
                  <span className="w-3">{star}</span>
                  <FaStar size={10} className="text-gold" />
                  <div className="flex-1 h-1.5 bg-sand rounded-full overflow-hidden">
                    <div className="h-full bg-terra" style={{ width: `${width}%` }} />
                  </div>
                  <span className="w-4 text-right">{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div>
          {/* Write review */}
          <div className="bg-white border border-line rounded-2xl p-6 mb-6">
            <h3 className="font-display text-[20px] mb-1">Write a review</h3>
            <p className="text-[12px] text-muted mb-4">
              {user ? "Apna experience share karein — 1 review per product." : "Review dene ke liye login karein."}
            </p>

            {user ? (
              <form onSubmit={handleSubmit(handleReviewSubmit)} className="space-y-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[12px] font-semibold text-ink">Rating</label>
                  <select
                    {...register("rating", { required: "Rating required" })}
                    className="h-10 px-3 rounded-lg border border-line bg-ivory text-[13px] outline-none"
                  >
                    {[5, 4, 3, 2, 1].map((r) => (
                      <option key={r} value={r}>{r} star{r > 1 ? "s" : ""}</option>
                    ))}
                  </select>
                  {errors.rating && <p className="text-[11px] text-red-600">{errors.rating.message}</p>}
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[12px] font-semibold text-ink">Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Perfect summer kurta"
                    {...register("title", { required: "Title required" })}
                    className="h-10 px-3 rounded-lg border border-line bg-ivory text-[13px] outline-none"
                  />
                  {errors.title && <p className="text-[11px] text-red-600">{errors.title.message}</p>}
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[12px] font-semibold text-ink">Your review</label>
                  <textarea
                    rows={3}
                    placeholder="Fabric, fit, delivery — jo acha ya bura laga likh dein…"
                    {...register("comment", {
                      required: "Review likhna zaroori hai",
                      minLength: { value: 10, message: "Kam az kam 10 characters" },
                    })}
                    className="px-3 py-2 rounded-lg border border-line bg-ivory text-[13px] outline-none resize-none"
                  />
                  {errors.comment && <p className="text-[11px] text-red-600">{errors.comment.message}</p>}
                </div>

                <button
                  type="submit"
                  className="px-6 h-10 rounded-lg bg-ink text-white text-[11.5px] tracking-[0.16em] uppercase font-semibold hover:bg-terra transition"
                >
                  Post review
                </button>
              </form>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center h-10 px-5 rounded-lg bg-ink text-white text-[11.5px] tracking-[0.16em] uppercase font-semibold hover:bg-terra transition"
              >
                Login to review
              </Link>
            )}
          </div>

          {/* Review list */}
          <div className="space-y-3">
            {(reviews || []).length === 0 && (
              <div className="bg-white border border-line rounded-2xl p-8 text-center text-[13px] text-muted">
                Abhi koi review nahi — pehla review aap ka ho sakta hai.
              </div>
            )}
            {(reviews || []).map((review) => (
              <div key={review.reviewId} className="bg-white border border-line rounded-xl p-5">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-sand grid place-items-center text-[12px] font-semibold text-ink uppercase">
                      {review.userName?.slice(0, 1) || "R"}
                    </div>
                    <div>
                      <div className="text-[13px] font-semibold text-ink">{review.userName}</div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Stars rating={review.rating} size={10} />
                        {review.verifiedPurchase && (
                          <span className="text-[9.5px] text-sage flex items-center gap-1">
                            <FaCheckCircle size={9} /> Verified purchase
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <span className="text-[10.5px] text-muted">
                    {review.createdAt ? new Date(review.createdAt).toLocaleDateString("en-PK") : ""}
                  </span>
                </div>
                {review.title && (
                  <h4 className="mt-3 text-[13.5px] font-semibold text-ink">{review.title}</h4>
                )}
                <p className="mt-1 text-[13px] leading-6 text-[#5f544a]">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-14">
          <div className="flex items-end justify-between mb-5">
            <h2 className="font-display text-[26px] text-ink">More in {product.categoryName}</h2>
            <Link
              to={`/products?category=${encodeURIComponent(product.categoryName)}`}
              className="text-[10.5px] tracking-[0.18em] uppercase border-b border-ink pb-0.5 hover:text-terra hover:border-terra"
            >
              View all
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {related.map((item) => (
              <ProductCard key={item.productId} {...item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetail;
