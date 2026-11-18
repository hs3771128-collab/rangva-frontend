import axios from "axios";

const api = axios.create({
    baseURL: `${import.meta.env.VITE_BACK_END_URL}/api`,
    withCredentials: true,
})

/**
 * The backend also accepts the JWT in an Authorization header. Sending it
 * keeps authentication working when the storefront and API are on different
 * domains (for example Netlify + Render) and the browser blocks the
 * third-party login cookie.
 */
api.interceptors.request.use((config) => {
    try {
        const auth = JSON.parse(localStorage.getItem("auth") || "null");
        let token = auth?.jwtToken;
        if (typeof token === "string" && token.includes("=")) {
            // Older sessions stored the whole cookie ("name=token").
            token = token.slice(token.indexOf("=") + 1);
        }
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    } catch {
        // A broken localStorage entry should never block the request.
    }
    return config;
});

export default api
