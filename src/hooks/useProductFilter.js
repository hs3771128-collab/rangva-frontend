import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { dashboardProductsAction, fetchProducts } from "../store/actions";

const useProductFilter = () => {
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();

  useEffect(() => {
    const params = new URLSearchParams();

    const currentPage = searchParams.get("page")
      ? Number(searchParams.get("page"))
      : 1;
    params.set("pageNumber", currentPage - 1);
    params.set("pageSize", "12");

    // Existing links use sortby=asc (price low→high) and sortby=desc (newest)
    const sortby = searchParams.get("sortby") || "desc";
    if (sortby === "asc") {
      params.set("sortBy", "price");
      params.set("sortOrder", "asc");
    } else {
      params.set("sortBy", "productId");
      params.set("sortOrder", "desc");
    }

    const forward = ["keyword", "category", "department", "brand", "size", "minPrice", "maxPrice"];
    forward.forEach((key) => {
      const value = searchParams.get(key);
      if (value) params.set(key, value);
    });

    dispatch(fetchProducts(params.toString()));
  }, [dispatch, searchParams]);
};

export const useDashboardProductFilter = () => {
  const { user } = useSelector((state) => state.auth);
  const isAdmin = user && user?.roles?.includes("ROLE_ADMIN");

  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();

  useEffect(() => {
    const params = new URLSearchParams();

    const currentPage = searchParams.get("page")
      ? Number(searchParams.get("page"))
      : 1;

    params.set("pageNumber", currentPage - 1);

    const queryString = params.toString();
    dispatch(dashboardProductsAction(queryString, isAdmin));
  }, [dispatch, searchParams]);
};

export default useProductFilter;
