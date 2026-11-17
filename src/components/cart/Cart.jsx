import { FaArrowLeft, FaShoppingBag, FaTruck } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import ItemContent from "./ItemContent";
import CartEmpty from "./CartEmpty";
import { deliveryFeeFor, formatPrice, FREE_DELIVERY_THRESHOLD } from "../../utils/formatPrice";

const Cart = () => {
  const { cart, totalPrice } = useSelector((state) => state.carts);

  if (!cart || cart.length === 0) return <CartEmpty />;

  const subtotal = Number(totalPrice || 0);
  const delivery = deliveryFeeFor(subtotal);

  return (
    <div className="rangva-container px-4 lg:px-6 py-10 min-h-[70vh]">
      <div className="flex items-end justify-between gap-4 mb-7">
        <div>
          <div className="text-[10px] tracking-[0.22em] uppercase text-terra mb-2">
            Your bag
          </div>
          <h1 className="font-display text-[30px] sm:text-[38px] leading-none text-ink">
            Shopping cart
          </h1>
          <p className="text-[12.5px] text-muted mt-2">
            {cart.length} item{cart.length === 1 ? "" : "s"} — checkout se pehle review karein.
          </p>
        </div>
        <Link
          to="/products"
          className="hidden sm:flex items-center gap-2 text-[10.5px] tracking-[0.16em] uppercase text-ink border-b border-ink pb-0.5 hover:text-terra hover:border-terra transition"
        >
          <FaArrowLeft size={10} /> Continue shopping
        </Link>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Items */}
        <div className="lg:col-span-2">
          <div className="hidden md:grid grid-cols-[1fr_90px_130px_100px] gap-4 px-4 pb-3 text-[10px] tracking-[0.16em] uppercase text-muted border-b border-line">
            <div>Product</div>
            <div className="text-center">Price</div>
            <div className="text-center">Quantity</div>
            <div className="text-right">Total</div>
          </div>

          <div className="divide-y divide-line bg-white border border-line rounded-2xl mt-3 overflow-hidden">
            {cart.map((item) => (
              <ItemContent key={`${item.productId}-${item.variantLabel || "one"}`} {...item} />
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="bg-white border border-line rounded-2xl p-5 h-fit lg:sticky lg:top-24">
          <h2 className="font-display text-[22px] text-ink mb-4">Order summary</h2>

          <div className="space-y-2.5 text-[12.5px]">
            <div className="flex justify-between">
              <span className="text-muted">Subtotal</span>
              <span className="text-ink font-medium">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Delivery</span>
              <span className="text-ink font-medium">
                {delivery === 0 ? "Free" : formatPrice(delivery)}
              </span>
            </div>
          </div>

          {delivery > 0 ? (
            <div className="mt-3 bg-ivory border border-line rounded-lg px-3 py-2 text-[11px] text-muted flex items-start gap-2">
              <FaTruck className="text-terra mt-0.5 shrink-0" size={11} />
              <span>
                {formatPrice(FREE_DELIVERY_THRESHOLD - subtotal)} aur add karein —
                delivery free.
              </span>
            </div>
          ) : (
            <div className="mt-3 bg-[#edf2ea] border border-[#d9e3d3] rounded-lg px-3 py-2 text-[11px] text-[#3f5138] flex items-center gap-2">
              <FaTruck size={11} /> Free delivery unlocked
            </div>
          )}

          <div className="border-t border-line mt-4 pt-4 flex items-baseline justify-between">
            <span className="text-[11.5px] tracking-[0.14em] uppercase font-semibold text-ink">
              Total
            </span>
            <span className="text-[22px] font-bold text-ink">{formatPrice(subtotal + delivery)}</span>
          </div>

          <Link to="/checkout" className="block mt-5">
            <button className="w-full h-11 rounded-full bg-ink text-white text-[11.5px] tracking-[0.16em] uppercase font-semibold flex items-center justify-center gap-2 hover:bg-terra transition">
              <FaShoppingBag size={13} />
              Proceed to checkout
            </button>
          </Link>

          <p className="text-[10.5px] text-muted text-center mt-3">
            Cash on delivery · JazzCash · Easypaisa · Card
          </p>
        </div>
      </div>
    </div>
  );
};

export default Cart;
