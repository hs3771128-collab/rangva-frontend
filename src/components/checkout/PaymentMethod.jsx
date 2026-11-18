import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaCheckCircle, FaLock } from "react-icons/fa";
import {
  addPaymentMethod,
  createUserCart,
  fetchPaymentGateways,
} from "../../store/actions";
import { paymentMethods } from "../../utils";

const PaymentMethod = () => {
  const dispatch = useDispatch();
  const { paymentMethod, gateways } = useSelector((state) => state.payment);
  const { cart, cartId } = useSelector((state) => state.carts);
  const { errorMessage } = useSelector((state) => state.errors);

  useEffect(() => {
    dispatch(fetchPaymentGateways());
  }, [dispatch]);

  useEffect(() => {
    if (cart?.length > 0 && !cartId && !errorMessage) {
      const sendCartItems = cart.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        variantLabel: item.variantLabel,
      }));
      dispatch(createUserCart(sendCartItems));
    }
  }, [dispatch, cartId, cart, errorMessage]);

  const selected = paymentMethods.find((m) => m.value === paymentMethod);

  return (
    <div className="max-w-2xl mx-auto px-4">
      <div className="bg-white border border-line rounded-2xl p-5 sm:p-6">
        <h2 className="font-display text-[24px] text-ink leading-none">
          Payment method
        </h2>
        <p className="text-[12px] text-muted mt-1.5 mb-5">
          Pakistan ke liye saare options — COD sab se aasan.
        </p>

        <div className="space-y-2.5">
          {paymentMethods.map((method) => {
            const active = paymentMethod === method.value;
            const available = !method.gateway || gateways?.[method.gateway];
            return (
              <button
                key={method.value}
                type="button"
                disabled={!available}
                onClick={() => available && dispatch(addPaymentMethod(method.value))}
                className={`w-full text-left flex items-start gap-3 p-3.5 rounded-xl border transition ${
                  active
                    ? "border-terra bg-[#fbf0ec]"
                    : available
                      ? "border-line bg-white hover:border-ink/30"
                      : "border-line bg-ivory opacity-60 cursor-not-allowed"
                }`}
              >
                <span
                  className={`mt-0.5 w-5 h-5 rounded-full border grid place-items-center shrink-0 ${
                    active
                      ? "border-terra bg-terra text-white"
                      : "border-[#cdc3b6] text-transparent"
                  }`}
                >
                  <FaCheckCircle size={11} />
                </span>
                <span>
                  <span className="block text-[13px] font-semibold text-ink">
                    {method.label}
                  </span>
                  <span className="block text-[11.5px] text-muted mt-0.5">
                    {available
                      ? method.description
                      : "Filhal available nahi — gateway configure nahi hua."}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        {selected?.gateway && (
          <div className="mt-4 bg-ivory border border-line rounded-xl p-4 text-[11.5px] text-[#5f544a] flex items-start gap-2.5">
            <FaLock className="text-terra mt-0.5 shrink-0" size={11} />
            <span>
              <b className="text-ink">{selected.label} secure page:</b> aap ko{" "}
              {selected.label} ki secure page par bheja jayega. Payment complete
              hone par order khud confirm ho jayega — card details hamari site
              par nahi aati.
            </span>
          </div>
        )}

        {gateways?.testMode && (
          <div className="mt-4 bg-[#fff6e5] border border-[#f0dcb4] rounded-xl p-4 text-[11.5px] text-[#7a5a1e]">
            <b>Test mode on:</b> JazzCash, Easypaisa aur card sab simulate honge.
            Koi asli paisa nahi katega — production se pehle
            <code className="mx-1 rounded bg-white/70 px-1">PAYMENTS_TEST_MODE</code>
            off kar dein.
          </div>
        )}

        {selected?.value === "BANK_TRANSFER" && (
          <div className="mt-4 bg-ivory border border-line rounded-xl p-4 text-[11.5px] text-[#5f544a]">
            <b className="text-ink">Order place karne ke baad:</b> bank transfer
            karein aur receipt WhatsApp/email par share karein. Order tab
            confirm hoga jab payment verify ho jaye.
          </div>
        )}

        {paymentMethod === "CASH_ON_DELIVERY" && (
          <div className="mt-4 bg-[#edf2ea] border border-[#d9e3d3] rounded-xl p-4 text-[11.5px] text-[#3f5138]">
            <b>Cash on Delivery:</b> rider ko parcel milne par payment karein.
            Koi advance nahi — poore Pakistan me available.
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentMethod;
