const initialState = {
    paymentMethod: null,
    // Which online gateways the backend has credentials for.
    gateways: { jazzcash: false, easypaisa: false, safepay: false },
};

export const paymentMethodReducer = (state = initialState, action) => {
    switch (action.type) {
        case "ADD_PAYMENT_METHOD":
            return {
                ...state,
                paymentMethod: action.payload,
            };
        case "SET_PAYMENT_GATEWAYS":
            return {
                ...state,
                gateways: { ...state.gateways, ...action.payload },
            };
        default:
            return state;
    }
};
