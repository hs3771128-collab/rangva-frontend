const initialState = {
    products: null,
    categories: null,
    pagination: {},
    productDetail: null,
    reviews: [],
};

export const productReducer = (state = initialState, action) => {
    switch (action.type) {
        case "FETCH_PRODUCTS":
            return {
                ...state,
                products: action.payload,
                pagination: {
                    ...state.pagination,
                    pageNumber: action.pageNumber,
                    pageSize: action.pageSize,
                    totalElements: action.totalElements,
                    totalPages: action.totalPages,
                    lastPage: action.lastPage,
                },
            };

        case "FETCH_CATEGORIES":
            return {
                ...state,
                categories: action.payload,
                pagination: {
                    ...state.pagination,
                    pageNumber: action.pageNumber,
                    pageSize: action.pageSize,
                    totalElements: action.totalElements,
                    totalPages: action.totalPages,
                    lastPage: action.lastPage,
                },
            };

        case "SET_PRODUCT_DETAIL":
            return { ...state, productDetail: action.payload };

        case "SET_REVIEWS":
            return { ...state, reviews: action.payload };

        default:
            return state;
    }
};
