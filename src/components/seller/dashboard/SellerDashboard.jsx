import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { FaBoxOpen, FaRupeeSign, FaShoppingCart, FaStore } from "react-icons/fa";
import { sellerAnalyticsAction } from "../../../store/actions";
import { formatPrice } from "../../../utils/formatPrice";
import Loader from "../../shared/Loader";
import ErrorPage from "../../shared/ErrorPage";

const StatCard = ({ title, value, Icon }) => (
  <div className="bg-white border border-line rounded-2xl px-5 py-6 shadow-sm space-y-3">
    <div className="flex items-center justify-between">
      <h3 className="uppercase text-[12px] tracking-wide text-muted font-semibold">
        {title}
      </h3>
      <Icon className="text-terracotta text-xl" />
    </div>
    <p className="text-ink text-3xl font-bold">{value}</p>
  </div>
);

const SellerDashboard = () => {
  const dispatch = useDispatch();
  const { isLoading, errorMessage } = useSelector((state) => state.errors);
  const { sellerAnalytics = {} } = useSelector((state) => state.admin);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(sellerAnalyticsAction());
  }, [dispatch]);

  if (isLoading) return <Loader />;
  if (errorMessage) return <ErrorPage message={errorMessage} />;

  const productCount = sellerAnalytics.productCount ?? 0;
  const totalOrders = sellerAnalytics.totalOrders ?? 0;
  const totalRevenue = Number(sellerAnalytics.totalRevenue ?? 0);

  return (
    <div className="pt-6 pb-10 space-y-8">
      <header className="space-y-1">
        <p className="uppercase tracking-[0.18em] text-[11px] text-muted">
          Seller panel
        </p>
        <h1 className="text-3xl font-bold text-ink">
          Assalam-o-Alaikum, {user?.username}
        </h1>
        <p className="text-muted text-sm">
          Yahan sirf aap ke products, orders aur revenue dikhte hain.
        </p>
      </header>

      <div className="grid sm:grid-cols-3 gap-4">
        <StatCard title="My Products" value={productCount} Icon={FaBoxOpen} />
        <StatCard title="My Orders" value={totalOrders} Icon={FaShoppingCart} />
        <StatCard
          title="My Revenue"
          value={formatPrice(totalRevenue)}
          Icon={FaRupeeSign}
        />
      </div>

      <div className="bg-ivory border border-line rounded-2xl p-5 sm:p-6 space-y-4">
        <h2 className="text-lg font-semibold text-ink">Quick actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/seller/products"
            className="bg-custom-blue text-white text-sm font-semibold px-4 py-2.5 rounded-lg hover:opacity-90 transition"
          >
            Add / manage products
          </Link>
          <Link
            to="/seller/orders"
            className="border border-line text-ink text-sm font-semibold px-4 py-2.5 rounded-lg hover:bg-white transition"
          >
            View my orders
          </Link>
          <Link
            to="/products"
            className="border border-line text-ink text-sm font-semibold px-4 py-2.5 rounded-lg hover:bg-white transition inline-flex items-center gap-2"
          >
            <FaStore className="text-sm" /> Visit store
          </Link>
        </div>
      </div>

      <div className="text-sm text-muted space-y-1">
        <p>• Naya product add karne ke liye “Add / manage products” par jayein.</p>
        <p>
          • Order par status update sirf usi order par hoga jisme aap ke products
          shamil hon.
        </p>
        <p>• Revenue aap ke products ki sale (price × quantity) ka total hai.</p>
      </div>
    </div>
  );
};

export default SellerDashboard;
