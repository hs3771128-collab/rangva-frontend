const initialState = {
    items: [],
    ids: [],
};

export const wishlistReducer = (state = initialState, action) => {
    switch (action.type) {
        case "SET_WISHLIST":
            return {
                ...state,
                items: action.payload || [],
                ids: (action.payload || []).map((item) => item.productId),
            };
        case "CLEAR_WISHLIST":
            return initialState;
        default:
            return state;
    }
};
