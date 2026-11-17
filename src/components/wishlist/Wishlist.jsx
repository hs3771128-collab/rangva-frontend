import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import toast from "react-hot-toast";
import { fetchWishlist, toggleWishlist } from "../../store/actions";
import { formatPrice } from "../../utils/formatPrice";
import Skeleton from "../shared/Skeleton";

const Wishlist = () => {
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.wishlist);
  const { user } = useSelector((state) => state.auth);
  const { isLoading } = useSelector((state) => state.errors);

  useEffect(() => {
    if (user) {
      dispatch(fetchWishlist());
    }
  }, [dispatch, user]);

  if (!user) {
    return (
      <div className="rangva-container px-4 py-24 text-center">
        <FaRegHeart className="mx-auto text-terra mb-4" size={40} />
        <h1 className="font-display text-[30px] mb-2">Your wishlist</h1>
        <p className="text-[13px] text-muted mb-6">
          Wishlist dekhne ke liye pehle login karein.
        </p>
        <Link
          to="/login"
          className="inline-flex h-11 px-7 items-center rounded-full bg-ink text-white text-[11.5px] tracking-[0.16em] uppercase font-semibold hover:bg-terra transition"
        >
          Login
        </Link>
      </div>
    );
  }

  return (
    <div className="rangva-container px-4 lg:px-6 py-10 min-h-[70vh]">
      <div className="flex items-end justify-between mb-7 gap-4">
        <div>
          <h1 className="font-display text-[30px] sm:text-[38px] leading-none">Your wishlist</h1>
          <p className="text-[12.5px] text-muted mt-2">
            {items.length} item{items.length === 1 ? "" : "s"} saved for later
          </p>
        </div>
        <Link
          to="/products"
          className="text-[10.5px] tracking-[0.18em] uppercase border-b border-ink pb-0.5 hover:text-terra hover:border-terra"
        >
          Continue shopping
        </Link>
      </div>

      {isLoading && items.length === 0 ? (
        <Skeleton />
      ) : items.length === 0 ? (
        <div className="bg-white border border-line rounded-2xl p-12 text-center">
          <FaRegHeart className="mx-auto text-[#c6bfb6] mb-4" size={40} />
          <h2 className="font-display text-[22px] mb-2">Wishlist khali hai</h2>
          <p className="text-[13px] text-muted mb-6">
            Jo pasand aaye, us par dil ke nishan dabayen — yahan save ho jayega.
          </p>
          <Link
            to="/products"
            className="inline-flex h-11 px-7 items-center rounded-full bg-ink text-white text-[11.5px] tracking-[0.16em] uppercase font-semibold hover:bg-terra transition"
          >
            Browse products
          </Link>
        </div>
      ) : (
        <div className="bg-white border border-line rounded-2xl overflow-hidden">
          {items.map((item) => {
            const off = item.price > 0
              ? Math.round(((item.price - item.specialPrice) / item.price) * 100)
              : 0;
            return (
              <div
                key={item.productId}
                className="flex items-center gap-4 p-4 border-b border-line last:border-0 flex-wrap sm:flex-nowrap"
              >
                <Link to={`/products/${item.productId}`} className="shrink-0">
                  <img
                    src={item.image}
                    alt={item.productName}
                    className="w-[76px] h-[95px] object-cover rounded-lg border border-line bg-sand"
                  />
                </Link>

                <div className="flex-1 min-w-[150px]">
                  <div className="text-[9.5px] tracking-[0.18em] uppercase text-muted">
                    {item.brand || "Rangva"} · {item.department === "BEAUTY" ? "Beauty" : "Fashion"}
                  </div>
                  <Link
                    to={`/products/${item.productId}`}
                    className="text-[14px] font-semibold text-ink hover:text-terra transition"
                  >
                    {item.productName}
                  </Link>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-[14px] font-bold text-ink">{formatPrice(item.specialPrice)}</span>
                    {off > 0 && (
                      <span className="text-[11px] text-[#b6ada2] line-through">{formatPrice(item.price)}</span>
                    )}
                  </div>
                  <div className="text-[11px] mt-1">
                    {Number(item.quantity) > 0 ? (
                      <span className="text-sage">In stock</span>
                    ) : (
                      <span className="text-terra">Sold out</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    to={`/products/${item.productId}`}
                    className="h-9 px-4 grid place-items-center rounded-lg bg-ink text-white text-[10.5px] tracking-[0.14em] uppercase font-semibold hover:bg-terra transition"
                  >
                    View
                  </Link>
                  <button
                    onClick={() => dispatch(toggleWishlist(item.productId, toast))}
                    className="w-9 h-9 grid place-items-center rounded-lg border border-line text-terra hover:bg-[#f7e6e1] transition"
                    aria-label="Remove from wishlist"
                  >
                    <FaHeart size={13} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
