const initialState = {
    analytics: {},
    sellerAnalytics: {},
};

export const adminReducer = (state = initialState, action) => {
    switch (action.type) {
        case "FETCH_ANALYTICS":
            return {
                ...state,
                analytics: action.payload,
            };

        case "FETCH_SELLER_ANALYTICS":
            return {
                ...state,
                sellerAnalytics: action.payload,
            };

        default:
            return state;
    }
};
