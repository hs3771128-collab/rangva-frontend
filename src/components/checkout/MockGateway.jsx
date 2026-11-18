import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { FaCheckCircle, FaFlask, FaTimesCircle } from "react-icons/fa";
import api from "../../api/api";
import { completeMockPayment } from "../../store/actions";
import { formatPrice } from "../../utils/formatPrice";

const gatewayLabels = {
  jazzcash: "JazzCash",
  easypaisa: "Easypaisa",
  safepay: "Card (Safepay)",
};

/**
 * Development-only stand-in for a real payment page. It lets the whole
 * checkout flow be tested before merchant credentials exist. The backend only
 * accepts these calls while PAYMENTS_TEST_MODE is on.
 */
const MockGateway = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [testMode, setTestMode] = useState(null);
  const [busy, setBusy] = useState(false);

  const orderId = params.get("orderId");
  const gateway = (params.get("gateway") || "safepay").toLowerCase();
  const amount = Number(params.get("amount") || 0);

  useEffect(() => {
    let active = true;
    api
      .get("/public/payments/methods")
      .then(({ data }) => {
        if (active) setTestMode(Boolean(data?.testMode));
      })
      .catch(() => {
        if (active) setTestMode(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const finish = async (success) => {
    if (!orderId || busy) return;
    setBusy(true);
    const result = await dispatch(completeMockPayment(orderId, gateway, success));
    setBusy(false);

    if (!result) {
      toast.error("Test payment complete nahi hui — backend check karein");
      return;
    }
    toast.success(success ? "Test payment approved" : "Test payment declined");
    navigate(
      `/order-confirm?orderId=${result.orderId || orderId}&payment=${
        result.paid ? "success" : "failed"
      }&gateway=${gateway}`,
    );
  };

  if (testMode === null) {
    return (
      <div className="rangva-container px-4 py-24 text-center text-[13px] text-muted">
        Test gateway check ho raha hai…
      </div>
    );
  }

  if (!testMode) {
    return (
      <div className="rangva-container px-4 py-24 text-center max-w-xl">
        <h1 className="font-display text-[28px] mb-2">Test mode off</h1>
        <p className="text-[13px] text-muted mb-6">
          Yeh page sirf local testing ke liye hai. Backend par
          <code className="mx-1 rounded bg-ivory px-1.5 py-0.5">PAYMENTS_TEST_MODE=true</code>
          set karein.
        </p>
        <Link
          to="/"
          className="inline-flex h-11 px-7 items-center rounded-full bg-ink text-white text-[11.5px] tracking-[0.16em] uppercase font-semibold hover:bg-terra transition"
        >
          Back to store
        </Link>
      </div>
    );
  }

  return (
    <div className="rangva-container px-4 py-12 max-w-xl">
      <div className="bg-white border border-line rounded-2xl p-7 sm:p-9 text-center">
        <div className="w-14 h-14 rounded-full grid place-items-center mx-auto mb-4 bg-[#fff6e5] text-[#a5761f]">
          <FaFlask size={22} />
        </div>
        <div className="text-[10px] tracking-[0.22em] uppercase text-terra mb-2">
          Development only
        </div>
        <h1 className="font-display text-[30px] leading-none text-ink">
          Test payment
        </h1>
        <p className="text-[12.5px] text-muted mt-3 leading-6">
          {gatewayLabels[gateway] || gateway} ka asli page abhi configured nahi
          hai. Yahan se flow test karein — koi asli paisa nahi katega.
        </p>

        <div className="mt-5 inline-flex flex-wrap items-center justify-center gap-x-6 gap-y-2 bg-ivory border border-line rounded-xl px-5 py-3 text-[12px]">
          <span className="text-muted">
            Order: <b className="text-ink">#{orderId}</b>
          </span>
          <span className="text-muted">
            Amount: <b className="text-ink">{formatPrice(amount)}</b>
          </span>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            disabled={busy}
            onClick={() => finish(true)}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[#2f6b3f] text-white text-[11.5px] tracking-[0.14em] uppercase font-semibold hover:bg-[#255432] transition disabled:opacity-60"
          >
            <FaCheckCircle /> Approve payment
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => finish(false)}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-line text-ink text-[11.5px] tracking-[0.14em] uppercase font-semibold hover:border-ink transition disabled:opacity-60"
          >
            <FaTimesCircle /> Fail payment
          </button>
        </div>

        <p className="text-[10.5px] text-muted mt-5">
          Production me yeh page kaam nahi karega — backend test mode off hone
          par requests reject ho jati hain.
        </p>
      </div>
    </div>
  );
};

export default MockGateway;
