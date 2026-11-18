import { FaPhoneAlt, FaTruck } from "react-icons/fa";
import { deliveryFeeFor, formatPrice, FREE_DELIVERY_THRESHOLD } from "../../utils/formatPrice";
import { paymentMethods } from "../../utils";
import truncateText from "../../utils/truncateText";

const OrderSummary = ({ totalPrice, cart, address, paymentMethod }) => {
  const subtotal = Number(totalPrice || 0);
  const delivery = deliveryFeeFor(subtotal);
  const total = subtotal + delivery;
  const methodLabel =
    paymentMethods.find((m) => m.value === paymentMethod)?.label ||
    paymentMethod ||
    "Not selected";

  return (
    <div className="max-w-5xl mx-auto px-4 grid lg:grid-cols-[1.4fr_1fr] gap-5">
      <div className="space-y-4">
        {/* Address */}
        <div className="bg-white border border-line rounded-2xl p-5">
          <h3 className="text-[10px] tracking-[0.2em] uppercase text-muted mb-2.5">
            Delivery address
          </h3>
          {address?.addressId ? (
            <>
              <div className="text-[13px] font-semibold text-ink">
                {address?.buildingName || address?.area || "Home"}
              </div>
              <p className="text-[12.5px] text-[#5f544a] mt-1 leading-6">
                {[address?.street, address?.area, address?.city, address?.state, address?.pincode]
                  .filter(Boolean)
                  .join(", ")}
              </p>
              <p className="text-[12px] text-muted mt-1.5 flex items-center gap-1.5">
                <FaPhoneAlt size={10} /> {address?.phone || "—"}
              </p>
            </>
          ) : (
            <p className="text-[12.5px] text-terra">
              Koi delivery address select nahi — Address step par ja kar select
              karein.
            </p>
          )}
        </div>

        {/* Items */}
        <div className="bg-white border border-line rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[10px] tracking-[0.2em] uppercase text-muted">
              Order items
            </h3>
            <span className="text-[11px] text-muted">{cart?.length || 0} item(s)</span>
          </div>

          <div className="divide-y divide-line">
            {(cart || []).map((item) => (
              <div key={item.productId} className="flex gap-3 py-3 first:pt-0 last:pb-0">
                <img
                  src={item.image}
                  alt={item.productName}
                  className="w-[58px] h-[72px] object-cover rounded-lg border border-line bg-sand shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="text-[12.5px] font-semibold text-ink">
                    {truncateText(item.productName, 40)}
                  </div>
                  {item.variantLabel && (
                    <div className="text-[11px] text-muted mt-0.5">
                      {item.variantLabel}
                    </div>
                  )}
                  <div className="text-[11.5px] text-muted mt-1">
                    {item.quantity} × {formatPrice(item.specialPrice)}
                  </div>
                </div>
                <div className="text-[13px] font-semibold text-ink shrink-0">
                  {formatPrice(Number(item.quantity) * Number(item.specialPrice))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Totals */}
      <div className="bg-white border border-line rounded-2xl p-5 h-fit lg:sticky lg:top-24">
        <h3 className="font-display text-[22px] text-ink mb-4">Order summary</h3>

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
          <div className="flex justify-between">
            <span className="text-muted">Payment</span>
            <span className="text-ink font-medium text-right">{methodLabel}</span>
          </div>
        </div>

        {delivery > 0 && (
          <div className="mt-3 bg-ivory border border-line rounded-lg px-3 py-2 text-[11px] text-muted flex items-start gap-2">
            <FaTruck className="text-terra mt-0.5 shrink-0" size={11} />
            <span>
              {formatPrice(FREE_DELIVERY_THRESHOLD - subtotal)} aur add karein —
              delivery free ho jayegi.
            </span>
          </div>
        )}

        <div className="border-t border-line mt-4 pt-4 flex items-baseline justify-between">
          <span className="text-[12px] tracking-[0.14em] uppercase font-semibold text-ink">
            Total
          </span>
          <span className="text-[22px] font-bold text-ink">{formatPrice(total)}</span>
        </div>
        <p className="text-[10.5px] text-muted mt-1.5">
          Inclusive of all taxes. Cash on delivery available.
        </p>
      </div>
    </div>
  );
};

export default OrderSummary;
