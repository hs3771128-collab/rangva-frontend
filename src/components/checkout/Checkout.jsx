import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { FaArrowLeft, FaCheckCircle, FaLock, FaShoppingBag } from "react-icons/fa";
import AddressInfo from "./AddressInfo";
import PaymentMethod from "./PaymentMethod";
import OrderSummary from "./OrderSummary";
import Skeleton from "../shared/Skeleton";
import { getUserAddresses, placeOrder } from "../../store/actions";
import { deliveryFeeFor, formatPrice } from "../../utils/formatPrice";

const steps = ["Address", "Payment", "Review"];

const Checkout = () => {
  const [activeStep, setActiveStep] = useState(0);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isLoading, btnLoader } = useSelector((state) => state.errors);
  const { cart, totalPrice } = useSelector((state) => state.carts);
  const { address, selectedUserCheckoutAddress } = useSelector((state) => state.auth);
  const { paymentMethod } = useSelector((state) => state.payment);

  useEffect(() => {
    dispatch(getUserAddresses());
  }, [dispatch]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeStep]);

  const handleBack = () => setActiveStep((s) => Math.max(0, s - 1));

  const handleNext = () => {
    if (activeStep === 0 && !selectedUserCheckoutAddress) {
      toast.error("Pehle delivery address select karein");
      return;
    }
    if (activeStep === 1 && !paymentMethod) {
      toast.error("Payment method select karein");
      return;
    }
    setActiveStep((s) => s + 1);
  };

  const handlePlaceOrder = () => {
    if (!selectedUserCheckoutAddress) {
      toast.error("Delivery address select karein");
      setActiveStep(0);
      return;
    }
    if (!paymentMethod) {
      toast.error("Payment method select karein");
      setActiveStep(1);
      return;
    }

    dispatch(
      placeOrder(
        {
          addressId: selectedUserCheckoutAddress.addressId,
          paymentMethod,
          pgName: paymentMethod,
        },
        toast,
        navigate,
      ),
    );
  };

  const subtotal = Number(totalPrice || 0);
  const total = subtotal + deliveryFeeFor(subtotal);

  if (!cart || cart.length === 0) {
    return (
      <div className="rangva-container px-4 py-24 text-center">
        <FaShoppingBag className="mx-auto text-[#c6bfb6] mb-4" size={38} />
        <h1 className="font-display text-[28px] mb-2">Cart khali hai</h1>
        <p className="text-[13px] text-muted mb-6">
          Checkout se pehle kuch products cart me add karein.
        </p>
        <Link
          to="/products"
          className="inline-flex h-11 px-7 items-center rounded-full bg-ink text-white text-[11.5px] tracking-[0.16em] uppercase font-semibold hover:bg-terra transition"
        >
          Shop now
        </Link>
      </div>
    );
  }

  return (
    <div className="pb-28 bg-ivory min-h-[calc(100vh-100px)]">
      <div className="rangva-container px-4 lg:px-6 pt-8">
        <div className="flex items-center gap-2 text-[10px] tracking-[0.22em] uppercase text-terra mb-2">
          <FaLock size={10} /> Secure checkout
        </div>
        <h1 className="font-display text-[30px] sm:text-[38px] leading-none mb-6">
          Checkout
        </h1>

        {/* Stepper */}
        <div className="flex items-center gap-2 sm:gap-4 mb-7">
          {steps.map((label, index) => {
            const done = index < activeStep;
            const active = index === activeStep;
            return (
              <div key={label} className="flex items-center gap-2 sm:gap-4">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-7 h-7 rounded-full grid place-items-center text-[11px] font-semibold border ${
                      done
                        ? "bg-terra border-terra text-white"
                        : active
                        ? "bg-ink border-ink text-white"
                        : "bg-white border-line text-muted"
                    }`}
                  >
                    {done ? <FaCheckCircle size={12} /> : index + 1}
                  </span>
                  <span
                    className={`text-[11.5px] tracking-[0.08em] ${
                      active ? "text-ink font-semibold" : "text-muted"
                    }`}
                  >
                    {label}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <span className="w-6 sm:w-12 h-px bg-line" />
                )}
              </div>
            );
          })}
        </div>

        {isLoading && !address ? (
          <Skeleton />
        ) : (
          <>
            {activeStep === 0 && <AddressInfo address={address} />}
            {activeStep === 1 && <PaymentMethod />}
            {activeStep === 2 && (
              <OrderSummary
                totalPrice={totalPrice}
                cart={cart}
                address={selectedUserCheckoutAddress}
                paymentMethod={paymentMethod}
              />
            )}
          </>
        )}
      </div>

      {/* Sticky action bar */}
      <div className="fixed bottom-0 left-0 w-full z-40 bg-white border-t border-line">
        <div className="rangva-container px-4 lg:px-6 h-20 flex items-center justify-between gap-3">
          <button
            onClick={activeStep === 0 ? () => navigate("/cart") : handleBack}
            className="flex items-center gap-2 h-10 px-4 rounded-full border border-line text-[11px] tracking-[0.12em] uppercase font-semibold text-ink hover:border-ink transition"
          >
            <FaArrowLeft size={11} />
            {activeStep === 0 ? "Cart" : "Back"}
          </button>

          <div className="hidden sm:block text-right mr-auto ml-2">
            <div className="text-[10px] tracking-[0.16em] uppercase text-muted">
              {activeStep === 2 ? "Total payable" : "Subtotal"}
            </div>
            <div className="text-[16px] font-bold text-ink">
              {formatPrice(activeStep === 2 ? total : subtotal)}
            </div>
          </div>

          {activeStep < 2 ? (
            <button
              onClick={handleNext}
              disabled={
                (activeStep === 0 && !selectedUserCheckoutAddress) ||
                (activeStep === 1 && !paymentMethod)
              }
              className="h-11 px-7 rounded-full bg-ink text-white text-[11.5px] tracking-[0.16em] uppercase font-semibold hover:bg-terra transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Continue
            </button>
          ) : (
            <button
              onClick={handlePlaceOrder}
              disabled={btnLoader}
              className="h-11 px-7 rounded-full bg-terra text-white text-[11.5px] tracking-[0.16em] uppercase font-semibold hover:bg-terra-dark transition disabled:opacity-60"
            >
              {btnLoader ? "Placing…" : "Place order"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Checkout;
