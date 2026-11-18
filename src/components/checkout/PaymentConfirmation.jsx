import { useEffect, useState } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import {
  FaCheckCircle,
  FaExclamationCircle,
  FaTruck,
  FaWhatsapp,
} from "react-icons/fa";
import { formatPrice } from "../../utils/formatPrice";
import {
  fetchOrderForUser,
  startGatewayPayment,
  verifySafepayPayment,
} from "../../store/actions";

const PaymentConfirmation = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();

  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(false);

  const queryOrderId = searchParams.get("orderId");
  const tracker = searchParams.get("tracker");
  const paymentResult = searchParams.get("payment");

  useEffect(() => {
    if (order) return;
    if (!queryOrderId && !tracker) return;

    let active = true;
    setLoading(true);

    (async () => {
      let orderId = queryOrderId;
      try {
        // Safepay sends the customer back with a tracker, usually before its
        // webhook arrives — ask the backend to confirm the payment first.
        if (tracker) {
          const result = await dispatch(verifySafepayPayment(tracker, queryOrderId));
          if (result?.orderId) orderId = String(result.orderId);
          if (result?.paid) {
            toast.success("Payment confirm ho gayi");
          } else if (result?.status === "FAILED") {
            toast.error(result?.message || "Payment nahi hui — dobara koshish karein");
          }
        }
        if (!orderId) return;
        const data = await dispatch(fetchOrderForUser(orderId));
        if (active) setOrder(data);
      } catch {
        if (active) setOrder(null);
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [dispatch, order, queryOrderId, tracker]);

  if (loading && !order) {
    return (
      <div className="rangva-container px-4 py-24 text-center text-[13px] text-muted">
        Order confirm ho raha hai…
      </div>
    );
  }

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

  const paymentMethod = order.payment?.paymentMethod || "";
  const isCod =
    paymentMethod === "CASH_ON_DELIVERY" || paymentMethod === "COD";
  const isGateway =
    paymentMethod === "JAZZCASH" ||
    paymentMethod === "EASYPAISA" ||
    paymentMethod === "SAFEPAY";
  const isPaid = order.payment?.pgStatus === "PAID" || order.orderStatus === "CONFIRMED";
  const paymentFailed =
    paymentResult === "failed" ||
    order.payment?.pgStatus === "FAILED" ||
    order.orderStatus === "PAYMENT_FAILED";

  const items = order.orderItems || [];
  const itemsTotal = items.reduce(
    (sum, item) => sum + Number(item.orderedProductPrice || 0) * Number(item.quantity || 0),
    0,
  );
  const delivery = Math.max(0, Number(order.totalAmount || 0) - itemsTotal);

  const heading = isCod
    ? "Order placed"
    : isPaid
      ? "Order confirmed"
      : isGateway
        ? "Payment pending"
        : "Order placed";

  const description = isCod
    ? "Aap ka order book ho gaya hai. Rider delivery ke waqt cash le ga — abhi koi payment nahi."
    : isPaid
      ? "Payment mil gayi hai aur aap ka order confirm ho gaya. Hum jald dispatch karenge."
      : paymentFailed
        ? "Payment complete nahi hui. Aap ka order mehfooz hai — neeche 'Pay now' se dobara koshish karein."
        : "Aap ka order save ho gaya hai. Payment complete karne ke liye neeche 'Pay now' dabayein.";

  return (
    <div className="rangva-container px-4 lg:px-6 py-12 max-w-3xl">
      <div className="bg-white border border-line rounded-2xl p-7 sm:p-10 text-center">
        <div
          className={`w-16 h-16 rounded-full grid place-items-center mx-auto mb-5 ${
            paymentFailed
              ? "bg-[#fbeceb] text-[#b03a32]"
              : "bg-[#edf2ea] text-[#3f5138]"
          }`}
        >
          {paymentFailed ? (
            <FaExclamationCircle size={28} />
          ) : (
            <FaCheckCircle size={30} />
          )}
        </div>
        <div className="text-[10px] tracking-[0.22em] uppercase text-terra mb-2">
          Shukriya!
        </div>
        <h1 className="font-display text-[30px] sm:text-[38px] leading-none text-ink">
          {heading}
        </h1>
        <p className="text-[13px] text-muted mt-3 max-w-[440px] mx-auto leading-6">
          {description}
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
          {order.payment?.pgStatus && (
            <span className="text-muted">
              Payment: <b className="text-ink">{order.payment.pgStatus}</b>
            </span>
          )}
        </div>

        {isGateway && !isPaid && order.orderStatus !== "CANCELLED" && (
          <button
            onClick={() => dispatch(startGatewayPayment(order, toast))}
            className="mt-5 inline-flex h-11 px-7 items-center rounded-full bg-terra text-white text-[11.5px] tracking-[0.16em] uppercase font-semibold hover:bg-terra-dark transition"
          >
            Pay now
          </button>
        )}
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
              {isCod ? "Cash to pay on delivery" : isPaid ? "Total paid" : "Total payable"}
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
            shehron me 4–6 din.{" "}
            <Link
              to={`/track-order?orderId=${order.orderId}`}
              className="font-semibold text-ink underline decoration-terra decoration-2 underline-offset-2 hover:text-terra transition"
            >
              Order track karein
            </Link>
          </span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
        <Link
          to={`/track-order?orderId=${order.orderId}`}
          className="inline-flex h-11 px-7 items-center justify-center gap-2 rounded-full bg-terra text-white text-[11.5px] tracking-[0.16em] uppercase font-semibold hover:bg-terra-dark transition"
        >
          <FaTruck size={12} /> Track order
        </Link>
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
