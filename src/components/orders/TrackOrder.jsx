import { useState } from "react";
import { useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
  FaBoxOpen,
  FaCheck,
  FaClock,
  FaMapMarkerAlt,
  FaSearch,
  FaTimesCircle,
  FaTruck,
  FaWhatsapp,
} from "react-icons/fa";
import { trackOrder } from "../../store/actions";
import { formatPrice } from "../../utils/formatPrice";

const fieldClass =
  "h-11 w-full rounded-lg border border-line bg-white px-3 text-[13px] text-ink outline-none focus:border-ink";

const formatDate = (value) => {
  if (!value) return "—";
  const date = new Date(`${value}`.length === 10 ? `${value}T00:00:00` : value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-PK", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const statusTone = (tracking) => {
  if (tracking?.cancelled) {
    return { pill: "bg-[#fbeceb] text-[#b03a32]", icon: "bg-[#fbeceb] text-[#b03a32]" };
  }
  if (tracking?.statusLabel === "Delivered") {
    return { pill: "bg-[#edf2ea] text-[#3f5138]", icon: "bg-[#edf2ea] text-[#3f5138]" };
  }
  if (tracking?.paymentStatus === "FAILED") {
    return { pill: "bg-[#fbeceb] text-[#b03a32]", icon: "bg-[#fbeceb] text-[#b03a32]" };
  }
  return { pill: "bg-[#f7e6e1] text-terra", icon: "bg-[#f7e6e1] text-terra" };
};

const TrackOrder = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  const [form, setForm] = useState({
    orderId: searchParams.get("orderId") || "",
    contact: searchParams.get("contact") || "",
  });
  const [tracking, setTracking] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const orderId = form.orderId.replace(/[^0-9]/g, "");
    const contact = form.contact.trim();

    if (!orderId) {
      toast.error("Order ID likhein");
      return;
    }
    if (!contact) {
      toast.error("Email ya phone number likhein");
      return;
    }

    setLoading(true);
    setError("");
    setTracking(null);

    const data = await dispatch(trackOrder(orderId, contact));
    setLoading(false);

    if (!data || data.error) {
      setError(data?.error || "Order track nahi ho saka — dobara koshish karein");
      return;
    }

    setTracking(data);
    // Keep the URL shareable so the customer can bookmark this lookup.
    setSearchParams({ orderId }, { replace: true });
  };

  const reset = () => {
    setTracking(null);
    setError("");
    setForm({ orderId: "", contact: "" });
    setSearchParams({}, { replace: true });
  };

  const tone = statusTone(tracking);
  const steps = tracking?.steps || [];
  const items = tracking?.items || [];

  return (
    <div className="rangva-container px-4 lg:px-6 py-10">
      <div className="max-w-2xl mx-auto text-center mb-8">
        <div className="text-[10px] tracking-[0.26em] uppercase text-terra mb-3">
          Order tracking
        </div>
        <h1 className="font-display text-[32px] sm:text-[42px] leading-none text-ink">
          Track my order
        </h1>
        <p className="text-[13px] text-muted mt-3">
          Order ID aur checkout wali email ya phone number daal kar apne parcel
          ki halat dekhein. Login ki zaroorat nahi.
        </p>
      </div>

      {/* Lookup form */}
      <form
        onSubmit={handleSubmit}
        className="max-w-3xl mx-auto bg-white border border-line rounded-2xl p-5 sm:p-6"
      >
        <div className="grid sm:grid-cols-[150px_1fr_auto] gap-3 items-end">
          <div>
            <label className="text-[12px] font-semibold text-ink mb-1 block">
              Order ID
            </label>
            <input
              type="text"
              inputMode="numeric"
              value={form.orderId}
              onChange={(e) => setForm({ ...form, orderId: e.target.value })}
              placeholder="e.g. 12"
              className={fieldClass}
            />
          </div>

          <div>
            <label className="text-[12px] font-semibold text-ink mb-1 block">
              Email ya phone
            </label>
            <input
              type="text"
              value={form.contact}
              onChange={(e) => setForm({ ...form, contact: e.target.value })}
              placeholder="you@example.com  /  03XX XXXXXXX"
              className={fieldClass}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="h-11 px-6 rounded-full bg-ink text-white text-[11.5px] tracking-[0.16em] uppercase font-semibold flex items-center justify-center gap-2 hover:bg-terra transition disabled:opacity-60"
          >
            <FaSearch size={11} />
            {loading ? "Tracking…" : "Track"}
          </button>
        </div>

        <p className="text-[11px] text-muted mt-3">
          Order ID confirmation page aur order email par milta hai (jaise
          <b className="text-ink"> #12</b>). Contact wahi hona chahiye jo order ke
          waqt diya tha.
        </p>

        {error && (
          <div className="mt-4 flex items-start gap-2.5 bg-[#fbeceb] border border-[#f2d3cf] rounded-xl p-3.5 text-[12px] text-[#b03a32]">
            <FaTimesCircle className="mt-0.5 shrink-0" size={13} />
            <span>{error}</span>
          </div>
        )}
      </form>

      {loading && (
        <div className="max-w-3xl mx-auto mt-4 text-center text-[12.5px] text-muted">
          Order dhoond rahe hain…
        </div>
      )}

      {tracking && (
        <div className="max-w-3xl mx-auto mt-5 space-y-4">
          {/* Status */}
          <div className="bg-white border border-line rounded-2xl p-5 sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div
                  className={`w-11 h-11 rounded-full grid place-items-center shrink-0 ${tone.icon}`}
                >
                  {tracking.cancelled ? (
                    <FaTimesCircle size={18} />
                  ) : tracking.statusLabel === "Delivered" ? (
                    <FaCheck size={18} />
                  ) : (
                    <FaTruck size={18} />
                  )}
                </div>
                <div>
                  <div className="text-[10px] tracking-[0.18em] uppercase text-muted">
                    Order #{tracking.orderId}
                  </div>
                  <div className="font-display text-[26px] leading-tight text-ink">
                    {tracking.statusLabel}
                  </div>
                  <div className="text-[11.5px] text-muted mt-1">
                    Placed on {formatDate(tracking.orderDate)}
                  </div>
                </div>
              </div>

              <span
                className={`text-[10.5px] tracking-[0.12em] uppercase font-semibold px-3 py-1.5 rounded-full ${tone.pill}`}
              >
                {tracking.cancelled
                  ? "Cancelled"
                  : tracking.paymentStatus === "PAID"
                    ? "Paid"
                    : tracking.paymentMethod === "Cash on Delivery"
                      ? "Cash on delivery"
                      : `Payment ${tracking.paymentStatus}`}
              </span>
            </div>

            {tracking.statusNote && (
              <p className="text-[12.5px] text-[#5f544a] mt-4 leading-6">
                {tracking.statusNote}
              </p>
            )}

            <div className="grid grid-cols-2 gap-3 mt-4 text-[12px]">
              <div className="bg-ivory border border-line rounded-xl px-3.5 py-2.5">
                <div className="text-[9.5px] tracking-[0.16em] uppercase text-muted">
                  Expected delivery
                </div>
                <div className="font-semibold text-ink mt-0.5">
                  {tracking.cancelled ? "—" : formatDate(tracking.expectedDelivery)}
                </div>
              </div>
              <div className="bg-ivory border border-line rounded-xl px-3.5 py-2.5">
                <div className="text-[9.5px] tracking-[0.16em] uppercase text-muted">
                  Payment method
                </div>
                <div className="font-semibold text-ink mt-0.5">
                  {tracking.paymentMethod || "—"}
                </div>
              </div>
              <div className="bg-ivory border border-line rounded-xl px-3.5 py-2.5">
                <div className="text-[9.5px] tracking-[0.16em] uppercase text-muted">
                  Deliver to
                </div>
                <div className="font-semibold text-ink mt-0.5 flex items-center gap-1.5">
                  <FaMapMarkerAlt size={10} className="text-terra shrink-0" />
                  {tracking.city || "—"}
                </div>
              </div>
              <div className="bg-ivory border border-line rounded-xl px-3.5 py-2.5">
                <div className="text-[9.5px] tracking-[0.16em] uppercase text-muted">
                  Total ({tracking.itemCount} item)
                </div>
                <div className="font-semibold text-ink mt-0.5">
                  {formatPrice(tracking.totalAmount)}
                </div>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white border border-line rounded-2xl p-5 sm:p-6">
            <h2 className="font-display text-[22px] mb-4">Delivery timeline</h2>

            {tracking.cancelled ? (
              <div className="flex items-start gap-2.5 bg-[#fbeceb] border border-[#f2d3cf] rounded-xl p-3.5 text-[12px] text-[#b03a32]">
                <FaTimesCircle className="mt-0.5 shrink-0" size={13} />
                <span>
                  Yeh order cancel kar diya gaya hai. Koi payment kat li gayi ho
                  to support se raabta karein.
                </span>
              </div>
            ) : (
              <ol className="relative">
                {steps.map((step, index) => (
                  <li key={step.label} className="relative pl-10 pb-5 last:pb-0">
                    {index !== steps.length - 1 && (
                      <span
                        className={`absolute left-[13px] top-6 bottom-0 w-px ${
                          step.done ? "bg-ink" : "bg-line"
                        }`}
                      />
                    )}
                    <span
                      className={`absolute left-0 top-0 w-[27px] h-[27px] rounded-full grid place-items-center text-[10px] font-semibold border ${
                        step.done
                          ? "bg-ink text-white border-ink"
                          : step.current
                            ? "bg-white text-ink border-ink"
                            : "bg-white text-muted border-line"
                      }`}
                    >
                      {step.done ? <FaCheck size={10} /> : index + 1}
                    </span>
                    <div
                      className={`text-[13px] font-semibold ${
                        step.done || step.current ? "text-ink" : "text-muted"
                      }`}
                    >
                      {step.label}
                      {step.current && !step.done && (
                        <span className="ml-2 text-[9.5px] tracking-[0.14em] uppercase text-terra">
                          Next step
                        </span>
                      )}
                    </div>
                    <div className="text-[11.5px] text-muted mt-0.5 leading-5">
                      {step.description}
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </div>

          {/* Items */}
          <div className="bg-white border border-line rounded-2xl p-5 sm:p-6">
            <h2 className="font-display text-[22px] mb-3 flex items-center gap-2">
              <FaBoxOpen size={16} className="text-terra" /> Order items
            </h2>
            <div className="divide-y divide-line">
              {items.map((item, index) => (
                <div
                  key={`${item.productName}-${index}`}
                  className="flex justify-between gap-3 py-3 first:pt-0 last:pb-0"
                >
                  <div className="min-w-0">
                    <div className="text-[12.5px] font-semibold text-ink">
                      {item.productName || "Product"}
                    </div>
                    <div className="text-[11px] text-muted mt-0.5">
                      {item.variantLabel ? `${item.variantLabel} · ` : ""}
                      Qty {item.quantity}
                    </div>
                  </div>
                  <div className="text-[12.5px] font-semibold text-ink shrink-0">
                    {formatPrice(item.lineTotal)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={reset}
              className="inline-flex h-11 px-7 items-center justify-center gap-2 rounded-full border border-line text-ink text-[11.5px] tracking-[0.16em] uppercase font-semibold hover:border-ink transition"
            >
              <FaSearch size={11} /> Track another order
            </button>
            <a
              href="https://wa.me/923000000000"
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-11 px-7 items-center justify-center gap-2 rounded-full bg-[#1f7a4d] text-white text-[11.5px] tracking-[0.16em] uppercase font-semibold hover:opacity-90 transition"
            >
              <FaWhatsapp size={14} /> WhatsApp support
            </a>
          </div>

          <p className="text-[11px] text-muted text-center flex items-center justify-center gap-1.5">
            <FaClock size={10} /> Tracking thori dair me update ho sakti hai —
            status admin panel se change hota hai.
          </p>
        </div>
      )}
    </div>
  );
};

export default TrackOrder;
