import { Link, useLocation } from "react-router-dom";
import { FaCheckCircle, FaTruck, FaWhatsapp } from "react-icons/fa";
import { formatPrice } from "../../utils/formatPrice";

const PaymentConfirmation = () => {
  const location = useLocation();
  const order = location.state?.order;

  if (!order) {
    return (
      <div className="rangva-container px-4 py-24 text-center">
        <h1 className="font-display text-[28px] mb-2">Order confirmation</h1>
        <p className="text-[13px] text-muted mb-6">
          Yahan koi order detail nahi mili. Apne orders account se check karein.
        </p>
        <Link
          to="/products"
          className="inline-flex h-11 px-7 items-center rounded-full bg-ink text-white text-[11.5px] tracking-[0.16em] uppercase font-semibold hover:bg-terra transition"
        >
          Continue shopping
        </Link>
      </div>
    );
  }

  const isCod =
    order.payment?.paymentMethod === "CASH_ON_DELIVERY" ||
    order.payment?.paymentMethod === "COD";

  const items = order.orderItems || [];
  const itemsTotal = items.reduce(
    (sum, item) => sum + Number(item.orderedProductPrice || 0) * Number(item.quantity || 0),
    0,
  );
  const delivery = Math.max(0, Number(order.totalAmount || 0) - itemsTotal);

  return (
    <div className="rangva-container px-4 lg:px-6 py-12 max-w-3xl">
      <div className="bg-white border border-line rounded-2xl p-7 sm:p-10 text-center">
        <div className="w-16 h-16 rounded-full bg-[#edf2ea] text-[#3f5138] grid place-items-center mx-auto mb-5">
          <FaCheckCircle size={30} />
        </div>
        <div className="text-[10px] tracking-[0.22em] uppercase text-terra mb-2">
          Shukriya!
        </div>
        <h1 className="font-display text-[30px] sm:text-[38px] leading-none text-ink">
          {isCod ? "Order placed" : "Order confirmed"}
        </h1>
        <p className="text-[13px] text-muted mt-3 max-w-[420px] mx-auto leading-6">
          {isCod
            ? "Aap ka order book ho gaya hai. Rider delivery ke waqt cash le ga — abhi koi payment nahi."
            : "Aap ka order confirm ho gaya hai. Payment details email par bhej di gayi hain."}
        </p>

        <div className="mt-6 inline-flex flex-wrap items-center justify-center gap-x-6 gap-y-2 bg-ivory border border-line rounded-xl px-5 py-3 text-[12px]">
          <span className="text-muted">
            Order ID: <b className="text-ink">#{order.orderId}</b>
          </span>
          <span className="text-muted">
            Date:{" "}
            <b className="text-ink">
              {order.orderDate
                ? new Date(order.orderDate).toLocaleDateString("en-PK")
                : "—"}
            </b>
          </span>
          <span className="text-muted">
            Status: <b className="text-ink">{order.orderStatus}</b>
          </span>
        </div>
      </div>

      {/* Items */}
      <div className="bg-white border border-line rounded-2xl p-5 sm:p-6 mt-4">
        <h2 className="font-display text-[22px] mb-4">Order details</h2>

        <div className="divide-y divide-line">
          {items.map((item) => (
            <div key={item.orderItemId} className="flex justify-between gap-3 py-3 first:pt-0">
              <div className="min-w-0">
                <div className="text-[12.5px] font-semibold text-ink">
                  {item.product?.productName || "Product"}
                </div>
                <div className="text-[11px] text-muted mt-0.5">
                  {item.variantLabel ? `${item.variantLabel} · ` : ""}
                  {item.quantity} × {formatPrice(item.orderedProductPrice)}
                </div>
              </div>
              <div className="text-[12.5px] font-semibold text-ink shrink-0">
                {formatPrice(Number(item.quantity) * Number(item.orderedProductPrice))}
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-line mt-3 pt-3 space-y-2 text-[12.5px]">
          <div className="flex justify-between">
            <span className="text-muted">Items</span>
            <span className="text-ink">{formatPrice(itemsTotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted">Delivery</span>
            <span className="text-ink">{delivery === 0 ? "Free" : formatPrice(delivery)}</span>
          </div>
          <div className="flex justify-between items-baseline pt-1">
            <span className="text-[11.5px] tracking-[0.14em] uppercase font-semibold text-ink">
              {isCod ? "Cash to pay on delivery" : "Total paid"}
            </span>
            <span className="text-[20px] font-bold text-ink">
              {formatPrice(order.totalAmount)}
            </span>
          </div>
        </div>

        <div className="mt-4 flex items-start gap-2.5 bg-ivory border border-line rounded-xl p-3.5 text-[11.5px] text-[#5f544a]">
          <FaTruck className="text-terra mt-0.5 shrink-0" size={12} />
          <span>
            Delivery 2–4 working days (Karachi, Lahore, Islamabad) — baaki
            shehron me 4–6 din. Order ID ke saath track kar sakte hain.
          </span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
        <Link
          to="/products"
          className="inline-flex h-11 px-7 items-center justify-center rounded-full bg-ink text-white text-[11.5px] tracking-[0.16em] uppercase font-semibold hover:bg-terra transition"
        >
          Continue shopping
        </Link>
        <a
          href="https://wa.me/923000000000"
          target="_blank"
          rel="noreferrer"
          className="inline-flex h-11 px-7 items-center justify-center gap-2 rounded-full border border-line text-ink text-[11.5px] tracking-[0.16em] uppercase font-semibold hover:border-ink transition"
        >
          <FaWhatsapp /> WhatsApp support
        </a>
      </div>
    </div>
  );
};

export default PaymentConfirmation;
