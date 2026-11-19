import api from "../../api/api";
import truncateText from "../../utils/truncateText";
import submitGatewayForm from "../../utils/submitGatewayForm";

/** Online gateways hand the customer over to an external payment page. */
const gatewayFor = (method) => {
  const value = (method || "").toUpperCase();
  if (value === "JAZZCASH") return "jazzcash";
  if (value === "EASYPAISA") return "easypaisa";
  if (value === "SAFEPAY") return "safepay";
  return null;
};

export const fetchPaymentGateways = () => async (dispatch) => {
  try {
    const { data } = await api.get("/public/payments/methods");
    dispatch({ type: "SET_PAYMENT_GATEWAYS", payload: data });
  } catch (error) {
    console.log(error);
    // Non-fatal: checkout simply keeps the online options disabled.
    dispatch({
      type: "SET_PAYMENT_GATEWAYS",
      payload: { jazzcash: false, easypaisa: false, safepay: false },
    });
  }
};

/** Asks the backend to confirm a Safepay payment after the redirect back. */
export const verifySafepayPayment =
  (tracker, orderId) => async () => {
    try {
      const { data } = await api.post("/payments/safepay/verify", {
        tracker,
        orderId,
      });
      return data;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

/** Development only: approves or fails a simulated gateway payment. */
export const completeMockPayment =
  (orderId, gateway, success) => async () => {    try {
      const { data } = await api.post("/payments/mock/complete", {
        orderId,
        gateway,
        success,
      });
      return data;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

/** Starts (or retries) an online payment for an existing order. */
export const startGatewayPayment = (order, toast) => async (dispatch) => {
  const gateway = gatewayFor(order?.payment?.paymentMethod);
  try {
    if (!gateway) {
      throw new Error("This order is not an online payment");
    }
    dispatch({ type: "BUTTON_LOADER" });
    const { data } = await api.post(`/payments/${gateway}/init`, {
      orderId: order.orderId,
    });
    submitGatewayForm(data.redirectUrl, data.fields);
  } catch (error) {
    console.log(error);
    toast?.error(error?.response?.data?.message || "Payment shuru nahi ho saki");
    dispatch({ type: "IS_ERROR", payload: null });
  }
};

export const fetchProducts = (queryString) => async (dispatch) => {
  try {
    dispatch({ type: "IS_FETCHING" });
    const { data } = await api.get(`/public/products?${queryString}`);
    dispatch({
      type: "FETCH_PRODUCTS",
      payload: data.content,
      pageNumber: data.pageNumber,
      pageSize: data.pageSize,
      totalElements: data.totalElements,
      totalPages: data.totalPages,
      lastPage: data.lastPage,
    });
    dispatch({ type: "IS_SUCCESS" });
  } catch (error) {
    console.log(error);
    dispatch({
      type: "IS_ERROR",
      payload: error?.response?.data?.message || "Failed to fetch products",
    });
  }
};

export const fetchCategories = () => async (dispatch) => {
  try {
    dispatch({ type: "CATEGORY_LOADER" });
    const { data } = await api.get(`/public/categories`);
    dispatch({
      type: "FETCH_CATEGORIES",
      payload: data.content,
      pageNumber: data.pageNumber,
      pageSize: data.pageSize,
      totalElements: data.totalElements,
      totalPages: data.totalPages,
      lastPage: data.lastPage,
    });
    dispatch({ type: "IS_ERROR" });
  } catch (error) {
    console.log(error);
    dispatch({
      type: "IS_ERROR",
      payload: error?.response?.data?.message || "Failed to fetch categories",
    });
  }
};

export const addToCart =
  (data, qty = 1, toast) =>
  async (dispatch, getState) => {
    //FIRST, check if the user is logged in
    const { user } = getState().auth;

    // If there is no user, stop here and show a message
    if (!user) {
      toast.error("Please log in to add items to your cart");
      return;
    }

    //Only proceed if the user is logged in
    const { products } = getState().products;
    const getProduct = products.find(
      (item) => item.productId === data.productId,
    );

    // Check for stocks
    const isQuantityExist = getProduct && getProduct.quantity >= qty;

    // If in stock -> add
    if (isQuantityExist) {
      try {
        dispatch({ type: "IS_FETCHING" });

        // Tell the backend to add the item to the user's database cart
        const variantQuery = data.variantLabel
          ? `?variant=${encodeURIComponent(data.variantLabel)}`
          : "";
        await api.post(
          `/carts/products/${data.productId}/quantity/${qty}${variantQuery}`,
        );

        // Fetch the freshly updated cart directly from the backend
        await dispatch(getUserCart());

        toast.success(
          `${truncateText(data?.productName, 35)} Added to the cart`,
        );

        dispatch({ type: "IS_SUCCESS" });
      } catch (error) {
        console.log(error);
        toast.error(
          error?.response?.data?.message || "Failed to add item to cart",
        );
        dispatch({ type: "IS_ERROR", payload: error?.response?.data?.message });
      }
    } else {
      toast.error("Out of stock");
    }
  };

export const increaseCartQuantity =
  (data, toast, currentQuantity, setCurrentQuantity) =>
  async (dispatch, getState) => {
    // Find the product to check stock limits (list may not be loaded yet)
    const { products } = getState().products;
    const getProduct = (products || []).find(
      (item) => item.productId === data.productId,
    );

    const isQuantityExist =
      !getProduct || getProduct.quantity >= currentQuantity + 1;

    if (isQuantityExist) {
      try {
        dispatch({ type: "IS_FETCHING" });

        // 1. Tell backend to add 1 to the quantity
        await api.put(`/cart/products/${data.productId}/quantity/add`);

        // 2. Update the local component state for immediate UI feedback
        const newQuantity = currentQuantity + 1;
        setCurrentQuantity(newQuantity);

        // 3. Fetch the freshly updated cart from the backend
        await dispatch(getUserCart());
        dispatch({ type: "IS_SUCCESS" });
      } catch (error) {
        console.log(error);
        toast.error(
          error?.response?.data?.message || "Failed to increase quantity",
        );
        dispatch({ type: "IS_ERROR" });
      }
    } else {
      toast.error("Quantity Reached to Limit");
    }
  };

export const decreaseCartQuantity = (data) => async (dispatch) => {
  try {
    dispatch({ type: "IS_FETCHING" });

    // 1. Passing "delete" triggers the -1 logic in your Spring Boot backend
    await api.put(`/cart/products/${data.productId}/quantity/delete`);

    // 2. Fetch the freshly updated cart from the backend
    await dispatch(getUserCart());
    dispatch({ type: "IS_SUCCESS" });
  } catch (error) {
    console.log(error);
    dispatch({
      type: "IS_ERROR",
      payload: error?.response?.data?.message || "Failed to decrease quantity",
    });
  }
};

export const removeFromCart = (data, toast) => async (dispatch, getState) => {
  try {
    dispatch({ type: "IS_FETCHING" });

    // Grab the cartId from the Redux state
    const { cartId } = getState().carts;

    // 1. Tell the backend to completely remove the item
    await api.delete(`/carts/${cartId}/product/${data.productId}`);

    // 2. Refresh the cart to reflect the deletion
    await dispatch(getUserCart());

    toast.success(`${truncateText(data.productName, 15)} Removed from cart`);
    dispatch({ type: "IS_SUCCESS" });
  } catch (error) {
    console.log(error);
    toast.error(error?.response?.data?.message || "Failed to remove item");
    dispatch({ type: "IS_ERROR" });
  }
};

export const authenticateSignInUser =
  (sendData, toast, reset, navigate, setLoader) => async (dispatch) => {
    try {
      //updating the loading state
      //got the data from backend
      //we dispatch the LOGIN_USER event with the data basically now this data will be used to update the local redux store
      //and then we have update the local storage of the browser with what ever data we have received from the backend
      //now we need to reset
      //toast message
      //navigate the user to the root page
      //error
      //at the end set loading state false
      setLoader(true);
      const { data } = await api.post("/auth/signin", sendData);
      dispatch({ type: "LOGIN_USER", payload: data });
      localStorage.setItem("auth", JSON.stringify(data));
      await dispatch(getUserCart());
      reset();
      toast.success("Login Success");
      navigate("/");
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Internal Server Error");
    } finally {
      setLoader(false);
    }
  };

export const registerNewUser =
  (sendData, toast, reset, navigate, setLoader) => async (dispatch) => {
    try {
      setLoader(true);
      const { data } = await api.post("/auth/signup", sendData);
      reset();
      toast.success(data?.message || "User Registered Successfully");
      navigate("/login");
    } catch (error) {
      console.log(error);
      toast.error(
        error?.response?.data?.message ||
          error?.response?.data?.password ||
          "Internal Server Error",
      );
    } finally {
      setLoader(false);
    }
  };

export const logOutUser = (navigate) => (dispatch) => {
  dispatch({ type: "LOG_OUT" }); // We'll be handling this as to what should happen when this event occurs.
  dispatch({ type: "CLEAR_CART" }); // Clear the cart in the redux store when user logs out

  localStorage.removeItem("auth");
  localStorage.removeItem("cartItems");
  localStorage.removeItem("CHECKOUT_ADDRESS");

  navigate("/login");
};

export const addUpdateUserAddress =
  (sendData, toast, addressId, setOpenAddressModal) =>
  async (dispatch, getState) => {
    /*
    const { user } = getState().auth;
    await api.post(`/addresses`, sendData, {
          headers: { Authorization: "Bearer " + user.jwtToken },
        });
    */
    dispatch({ type: "BUTTON_LOADER" });
    try {
      if (!addressId) {
        const { data } = await api.post("/addresses", sendData);
        // A brand-new address is what the customer wants to use right away.
        if (data?.addressId) {
          dispatch(selectUserCheckoutAddress(data));
        }
      } else {
        const { data } = await api.put(`/addresses/${addressId}`, sendData);
        const selected = getState().auth.selectedUserCheckoutAddress;
        if (data?.addressId && selected?.addressId === data.addressId) {
          dispatch(selectUserCheckoutAddress(data));
        }
      }
      dispatch(getUserAddresses());
      toast.success("Address saved successfully");
      dispatch({ type: "IS_SUCCESS" });
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Internal Server Error");
      dispatch({ type: "IS_ERROR", payload: null });
    } finally {
      setOpenAddressModal(false);
    }
  };

//addresses fetched in redux store
export const getUserAddresses = () => async (dispatch, getState) => {
  try {
    dispatch({ type: "IS_FETCHING" });
    const { data } = await api.get(`/users/addresses`);
    dispatch({ type: "USER_ADDRESS", payload: data });

    // Keep the checkout usable: if nothing is selected (or the selected
    // address was deleted) fall back to the first saved address instead of
    // letting the customer reach Review without a delivery address.
    const selected = getState().auth.selectedUserCheckoutAddress;
    const stillExists =
      selected?.addressId &&
      Array.isArray(data) &&
      data.some((a) => a.addressId === selected.addressId);
    if (!stillExists) {
      if (Array.isArray(data) && data.length > 0) {
        dispatch(selectUserCheckoutAddress(data[0]));
      } else {
        dispatch(clearCheckoutAddress());
      }
    }

    dispatch({ type: "IS_SUCCESS" });
  } catch (error) {
    console.log(error);
    dispatch({
      type: "IS_ERROR",
      payload:
        error?.response?.data?.message || "Failed to fetch user addresses",
    });
  }
};

export const selectUserCheckoutAddress = (address) => {
  localStorage.setItem("CHECKOUT_ADDRESS", JSON.stringify(address));

  return {
    type: "SELECT_CHECKOUT_ADDRESS",
    payload: address,
  };
};

export const deleteUserAddress =
  (toast, addressId, setOpenDeleteModal) => async (dispatch, getState) => {
    try {
      dispatch({ type: "BUTTON_LOADER" });
      await api.delete(`/addresses/${addressId}`);
      dispatch({ type: "IS_SUCCESS" });
      dispatch(getUserAddresses()); //Re-Fatching the addresses after deletion
      dispatch(clearCheckoutAddress());
      toast.success("Address deleted successfully");
    } catch (error) {
      console.log(error);
      dispatch({
        type: "IS_ERROR",
        payload: error?.response?.data?.message || "Some Error Occured",
      });
    } finally {
      setOpenDeleteModal(false);
    }
  };

export const clearCheckoutAddress = () => {
  return {
    type: "REMOVE_CHECKOUT_ADDRESS",
  };
};

export const addPaymentMethod = (method) => {
  return {
    type: "ADD_PAYMENT_METHOD",
    payload: method,
  };
};

export const createUserCart = (sendCartItems) => async (dispatch, getState) => {
  try {
    dispatch({ type: "IS_FETCHING" });
    await api.post("/cart/create", sendCartItems);
    await dispatch(getUserCart());
  } catch (error) {
    console.log(error);
    dispatch({
      type: "IS_ERROR",
      payload: error?.response?.data?.message || "Failed to create cart items",
    });
  }
};

export const getUserCart = () => async (dispatch, getState) => {
  try {
    dispatch({ type: "IS_FETCHING" });
    //This is give the cart of perticular user
    const { data } = await api.get("/carts/users/cart");

    dispatch({
      type: "GET_USER_CART_PRODUCTS",
      payload: data.products,
      totalPrice: data.totalPrice,
      cartId: data.cartId,
    });
    localStorage.setItem("cartItems", JSON.stringify(getState().carts.cart));
    dispatch({ type: "IS_SUCCESS" });
  } catch (error) {
    console.log(error);
    dispatch({
      type: "IS_ERROR",
      payload: error?.response?.data?.message || "Failed to fetch cart items",
    });
  }
};

export const analyticsAction = () => async (dispatch, getState) => {
  try {
    dispatch({ type: "IS_FETCHING" });
    const { data } = await api.get("/admin/app/analytics");
    dispatch({
      type: "FETCH_ANALYTICS",
      payload: data,
    });
    dispatch({ type: "IS_SUCCESS" });
  } catch (error) {
    dispatch({
      type: "IS_ERROR",
      payload:
        error?.response?.data?.message || "Failed to fetch analytics data",
    });
  }
};

export const getOrdersForDashboard =
  (queryString, isAdmin) => async (dispatch) => {
    try {
      dispatch({ type: "IS_FETCHING" });
      const endpoint = isAdmin ? "/admin/orders" : "/seller/orders";
      const { data } = await api.get(`${endpoint}?${queryString}`);
      dispatch({
        type: "GET_ADMIN_ORDERS",
        payload: data.content,
        pageNumber: data.pageNumber,
        pageSize: data.pageSize,
        totalElements: data.totalElements,
        totalPages: data.totalPages,
        lastPage: data.lastPage,
      });
      dispatch({ type: "IS_SUCCESS" });
    } catch (error) {
      console.log(error);
      dispatch({
        type: "IS_ERROR",
        payload:
          error?.response?.data?.message || "Failed to fetch orders data",
      });
    }
  };

export const updateOrderStatusFromDashboard =
  (orderId, orderStatus, toast, setLoader, isAdmin) =>
  async (dispatch, getState) => {
    try {
      setLoader(true);
      const endpoint = isAdmin ? "/admin/orders/" : "/seller/orders/";
      const { data } = await api.put(`${endpoint}${orderId}/status`, {
        status: orderStatus,
      });
      toast.success(data.message || "Order updated successfully");
      await dispatch(getOrdersForDashboard());
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Internal Server Error");
    } finally {
      setLoader(false);
    }
  };

export const dashboardProductsAction =
  (queryString, isAdmin) => async (dispatch) => {
    try {
      dispatch({ type: "IS_FETCHING" });
      const endpoint = isAdmin ? "/admin/products" : "/seller/products";
      const { data } = await api.get(`${endpoint}?${queryString}`);
      dispatch({
        type: "FETCH_PRODUCTS",
        payload: data.content,
        pageNumber: data.pageNumber,
        pageSize: data.pageSize,
        totalElements: data.totalElements,
        totalPages: data.totalPages,
        lastPage: data.lastPage,
      });
      dispatch({ type: "IS_SUCCESS" });
    } catch (error) {
      console.log(error);
      dispatch({
        type: "IS_ERROR",
        payload:
          error?.response?.data?.message ||
          "Failed to fetch dashboard products",
      });
    }
  };

export const updateProductFromDashboard =
  (sendData, toast, reset, setLoader, setOpen, isAdmin) => async (dispatch) => {
    try {
      setLoader(true);
      const endpoint = isAdmin ? "/admin/products/" : "/seller/products/";
      await api.put(`${endpoint}${sendData.id}`, sendData);
      toast.success("Product update successful");
      reset();
      setLoader(false);
      setOpen(false);
      await dispatch(dashboardProductsAction());
    } catch (error) {
      toast.error(
        error?.response?.data?.description || "Product update failed",
      );
    }
  };

export const addNewProductFromDashboard =
  (sendData, toast, reset, setLoader, setOpen, isAdmin) =>
  async (dispatch, getState) => {
    try {
      setLoader(true);
      const endpoint = isAdmin ? "/admin/categories/" : "/seller/categories/";
      await api.post(`${endpoint}${sendData.categoryId}/product`, sendData);
      toast.success("Product created successfully");
      reset();
      setOpen(false);
      await dispatch(dashboardProductsAction());
    } catch (error) {
      console.error(error);
      toast.error(
        error?.response?.data?.description || "Product creation failed",
      );
    } finally {
      setLoader(false);
    }
  };

export const deleteProduct =
  (setLoader, productId, toast, setOpenDeleteModal, isAdmin) =>
  async (dispatch, getState) => {
    try {
      setLoader(true);
      const endpoint = isAdmin ? "/admin/products/" : "/seller/products/";
      await api.delete(`${endpoint}${productId}`);
      toast.success("Product deleted successfully");
      setLoader(false);
      setOpenDeleteModal(false);
      await dispatch(dashboardProductsAction());
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Some Error Occured");
    }
  };

export const updateProductImageFromDashboard =
  (formData, productId, toast, setLoader, setOpen, isAdmin) =>
  async (dispatch) => {
    try {
      setLoader(true);
      const endpoint = isAdmin ? "/admin/products/" : "/seller/products/";
      await api.put(`${endpoint}${productId}/image`, formData);
      toast.success("Image upload successful");
      setLoader(false);
      setOpen(false);
      await dispatch(dashboardProductsAction()); // by this product list get refreshed or we fetch the product again
    } catch (error) {
      toast.error(
        error?.response?.data?.description || "Product Image upload failed",
      );
    }
  };

export const getAllCategoriesDashboard = (queryString) => async (dispatch) => {
  dispatch({ type: "CATEGORY_LOADER" });
  try {
    const { data } = await api.get(`/public/categories?${queryString}`);
    dispatch({
      type: "FETCH_CATEGORIES",
      payload: data["content"],
      pageNumber: data["pageNumber"],
      pageSize: data["pageSize"],
      totalElements: data["totalElements"],
      totalPages: data["totalPages"],
      lastPage: data["lastPage"],
    });

    dispatch({ type: "CATEGORY_SUCCESS" });
  } catch (err) {
    console.log(err);

    dispatch({
      type: "IS_ERROR",
      payload: err?.response?.data?.message || "Failed to fetch categories",
    });
  }
};

export const createCategoryDashboardAction =
  (sendData, setOpen, reset, toast) => async (dispatch, getState) => {
    try {
      dispatch({ type: "CATEGORY_LOADER" });
      await api.post("/admin/categories", sendData);
      dispatch({ type: "CATEGORY_SUCCESS" });
      reset();
      toast.success("Category Created Successful");
      setOpen(false);
      await dispatch(getAllCategoriesDashboard());
    } catch (err) {
      console.log(err);
      toast.error(
        err?.response?.data?.categoryName || "Failed to create new category",
      );

      dispatch({
        type: "IS_ERROR",
        payload: err?.response?.data?.message || "Internal Server Error",
      });
    }
  };

export const updateCategoryDashboardAction =
  (sendData, setOpen, categoryID, reset, toast) =>
  async (dispatch, getState) => {
    try {
      dispatch({ type: "CATEGORY_LOADER" });

      await api.put(`/admin/categories/${categoryID}`, sendData);

      dispatch({ type: "CATEGORY_SUCCESS" });

      reset();
      toast.success("Category Update Successful");
      setOpen(false);
      await dispatch(getAllCategoriesDashboard());
    } catch (err) {
      console.log(err);
      toast.error(
        err?.response?.data?.categoryName || "Failed to update category",
      );

      dispatch({
        type: "IS_ERROR",
        payload: err?.response?.data?.message || "Internal Server Error",
      });
    }
  };

export const deleteCategoryDashboardAction =
  (setOpen, categoryID, toast) => async (dispatch, getState) => {
    try {
      dispatch({ type: "CATEGORY_LOADER" });

      await api.delete(`/admin/categories/${categoryID}`);

      dispatch({ type: "CATEGORY_SUCCESS" });

      toast.success("Category Delete Successful");
      setOpen(false);
      await dispatch(getAllCategoriesDashboard());
    } catch (err) {
      console.log(err);
      toast.error(err?.response?.data?.message || "Failed to delete category");
      dispatch({
        type: "IS_ERROR",
        payload: err?.response?.data?.message || "Internal Server Error",
      });
    }
  };

export const getAllSellersDashboard =
  (queryString) => async (dispatch, getState) => {
    const { user } = getState().auth;
    try {
      dispatch({ type: "IS_FETCHING" });
      const { data } = await api.get(`/admin/sellers?${queryString}`);
      dispatch({
        type: "GET_SELLERS",
        payload: data["content"],
        pageNumber: data["pageNumber"],
        pageSize: data["pageSize"],
        totalElements: data["totalElements"],
        totalPages: data["totalPages"],
        lastPage: data["lastPage"],
      });

      dispatch({ type: "IS_SUCCESS" });
    } catch (err) {
      console.log(err);
      dispatch({
        type: "IS_ERROR",
        payload: err?.response?.data?.message || "Failed to fetch sellers data",
      });
    }
  };

export const addNewDashboardSeller =
  (sendData, toast, reset, setOpen, setLoader) => async (dispatch) => {
    try {
      setLoader(true);
      // Admin-only endpoint; public signup always creates a plain customer.
      await api.post("/admin/sellers", sendData);
      reset();
      toast.success("Seller registered successfully!");

      await dispatch(getAllSellersDashboard());
    } catch (err) {
      console.log(err);
      toast.error(
        err?.response?.data?.message ||
          err?.response?.data?.password ||
          "Internal Server Error",
      );
    } finally {
      setLoader(false);
      setOpen(false);
    }
  };

/* ============================================================
   Rangva additions: product detail, reviews, wishlist, checkout
   ============================================================ */

export const fetchProductById = (productId) => async (dispatch) => {
  try {
    dispatch({ type: "IS_FETCHING" });
    const { data } = await api.get(`/public/products/${productId}`);
    dispatch({ type: "SET_PRODUCT_DETAIL", payload: data });
    dispatch({ type: "IS_SUCCESS" });
  } catch (error) {
    dispatch({
      type: "IS_ERROR",
      payload: error?.response?.data?.message || "Failed to load product",
    });
  }
};

export const fetchProductReviews = (productId) => async (dispatch) => {
  try {
    const { data } = await api.get(`/public/products/${productId}/reviews`);
    dispatch({ type: "SET_REVIEWS", payload: data });
  } catch (error) {
    console.log(error);
    dispatch({ type: "SET_REVIEWS", payload: [] });
  }
};

export const submitProductReview =
  (productId, sendData, toast, reset) => async (dispatch) => {
    try {
      dispatch({ type: "BUTTON_LOADER" });
      await api.post(`/products/${productId}/reviews`, sendData);
      toast.success("Review posted — shukriya!");
      if (reset) reset();
      await dispatch(fetchProductReviews(productId));
      await dispatch(fetchProductById(productId));
      dispatch({ type: "IS_SUCCESS" });
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Could not post your review",
      );
      dispatch({ type: "IS_ERROR", payload: null });
    }
  };

export const fetchWishlist = () => async (dispatch) => {
  try {
    const { data } = await api.get("/wishlist");
    dispatch({ type: "SET_WISHLIST", payload: data });
  } catch (error) {
    console.log(error);
    dispatch({ type: "SET_WISHLIST", payload: [] });
  }
};

export const toggleWishlist =
  (productId, toast) => async (dispatch, getState) => {
    const { user } = getState().auth;
    if (!user) {
      toast.error("Wishlist ke liye pehle login karein");
      return;
    }

    const items = getState().wishlist?.items || [];
    const isSaved = items.some((item) => item.productId === productId);

    try {
      if (isSaved) {
        await api.delete(`/wishlist/${productId}`);
        toast.success("Removed from wishlist");
      } else {
        await api.post(`/wishlist/${productId}`);
        toast.success("Saved to wishlist");
      }
      await dispatch(fetchWishlist());
    } catch (error) {
      toast.error(error?.response?.data?.message || "Wishlist update failed");
    }
  };

/**
 * Places an order using a Pakistani payment method.
 * COD / JazzCash / Easypaisa / Bank Transfer are recorded as pending payments.
 */
export const fetchOrderForUser = (orderId) => async () => {
  const { data } = await api.get(`/order/users/${orderId}`);
  return data;
};

export const placeOrder =
  (sendData, toast, navigate) => async (dispatch) => {
    try {
      if (!sendData?.addressId) {
        toast.error("Delivery address select karein");
        dispatch({ type: "IS_ERROR", payload: null });
        return;
      }
      dispatch({ type: "BUTTON_LOADER" });
      const method = sendData.paymentMethod || "CASH_ON_DELIVERY";
      const payload = {
        addressId: sendData.addressId,
        pgName: sendData.pgName || method,
        pgPaymentId: sendData.pgPaymentId || null,
        pgStatus: sendData.pgStatus || "PENDING",
        pgResponseMessage: sendData.pgResponseMessage || "Order placed",
      };
      const { data } = await api.post(`/order/users/payments/${method}`, payload);

      localStorage.removeItem("CHECKOUT_ADDRESS");
      localStorage.removeItem("cartItems");
      dispatch({ type: "CLEAR_CART" });
      dispatch({ type: "IS_SUCCESS" });

      const gateway = gatewayFor(method);
      if (gateway) {
        toast.success("Order ban gaya — ab gateway par payment complete karein");
        try {
          const { data: init } = await api.post(`/payments/${gateway}/init`, {
            orderId: data.orderId,
          });
          submitGatewayForm(init.redirectUrl, init.fields);
          return;
        } catch (initError) {
          console.log(initError);
          toast.error(
            initError?.response?.data?.message ||
              "Payment gateway shuru nahi ho saka — dobara koshish karein",
          );
          navigate(
            `/order-confirm?orderId=${data.orderId}&payment=pending&gateway=${gateway}`,
          );
          return;
        }
      }

      toast.success("Order placed — shukriya!");
      navigate("/order-confirm", { state: { order: data } });
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Order place nahi ho saka");
      dispatch({ type: "IS_ERROR", payload: null });
    }
  };

/**
 * Public order tracking. The customer proves the order is theirs with the
 * email or phone used at checkout, so no login is needed.
 * Returns the tracking payload, or `{ error }` with a ready-to-show message.
 */
export const trackOrder = (orderId, contact) => async () => {
  try {
    const parsedId = Number(String(orderId).replace(/[^0-9]/g, ""));
    const { data } = await api.post("/public/orders/track", {
      orderId: parsedId,
      contact: String(contact || "").trim(),
    });
    return data;
  } catch (error) {
    console.log(error);
    return {
      error:
        error?.response?.data?.message ||
        "Order track nahi ho saka — dobara koshish karein",
    };
  }
};
