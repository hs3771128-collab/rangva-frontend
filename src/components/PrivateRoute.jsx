import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet, useLocation } from 'react-router-dom'

const PrivateRoute = ({ publicPage = false, adminOnly = false, sellerOnly = false }) => {
  const { user } = useSelector((state) => state.auth);
  const isAdmin = user && user?.roles?.includes("ROLE_ADMIN");
  const isSeller = user && user?.roles?.includes("ROLE_SELLER");
  const location = useLocation();

  // Public pages (login, register) -> if logged in, redirect to home
  if (publicPage) {
    return user ? <Navigate to={isAdmin ? "/admin" : isSeller ? "/seller" : "/"} /> : <Outlet />;
  }

  // Admin-only pages -> only Admin & Seller allowed
  if (adminOnly) {
    if (!isAdmin && !isSeller) {
      return <Navigate to="/" replace />;
    }

    // Sellers have their own panel; keep them out of the admin-only screens.
    if (isSeller && !isAdmin) {
      const sellerAllowedPaths = ["/admin/orders", "/admin/products"];
      const sellerAllowed = sellerAllowedPaths.some(path =>
        location.pathname.startsWith(path)
      );
      if (!sellerAllowed) {
        return <Navigate to="/seller" replace />;
      }
    }
  }

  // Seller panel: sellers and admins (admins may inspect it) only.
  if (sellerOnly) {
    if (!isSeller && !isAdmin) {
      return <Navigate to="/" replace />;
    }
    return <Outlet />;
  }

  // Normal private pages (like checkout) -> any authenticated user can access
  return user ? <Outlet /> : <Navigate to="/login" state={{ from: location }} replace />;
}

export default PrivateRoute;
