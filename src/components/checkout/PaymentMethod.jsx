import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaCheckCircle } from "react-icons/fa";
import { addPaymentMethod, createUserCart } from "../../store/actions";
import { paymentMethods } from "../../utils";

const PaymentMethod = () => {
  const dispatch = useDispatch();
  const { paymentMethod } = useSelector((state) => state.payment);
  const { cart, cartId } = useSelector((state) => state.carts);
  const { errorMessage } = useSelector((state) => state.errors);

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
            return (
              <button
                key={method.value}
                type="button"
                onClick={() => dispatch(addPaymentMethod(method.value))}
                className={`w-full text-left flex items-start gap-3 p-3.5 rounded-xl border transition ${
                  active ? "border-terra bg-[#fbf0ec]" : "border-line bg-white hover:border-ink/30"
                }`}
              >
                <span
                  className={`mt-0.5 w-5 h-5 rounded-full border grid place-items-center shrink-0 ${
                    active ? "border-terra bg-terra text-white" : "border-[#cdc3b6] text-transparent"
                  }`}
                >
                  <FaCheckCircle size={11} />
                </span>
                <span>
                  <span className="block text-[13px] font-semibold text-ink">
                    {method.label}
                  </span>
                  <span className="block text-[11.5px] text-muted mt-0.5">
                    {method.description}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        {selected && selected.value !== "CASH_ON_DELIVERY" && selected.value !== "CARD" && (
          <div className="mt-4 bg-ivory border border-line rounded-xl p-4 text-[11.5px] text-[#5f544a]">
            <b className="text-ink">Order place karne ke baad:</b> payment ki
            tafseel aur transaction ID WhatsApp/email par share karein. Order
            tab confirm hoga jab payment receive ho jaye.
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
