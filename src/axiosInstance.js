import axios from "axios";

// Create an Axios instance
const axiosInstance = axios.create({
    baseURL: "https://wmk-backend.onrender.com/api",  // Main API URL
    headers: {
        "Content-Type": "application/json",
    }
});

// Request Interceptor - Add Token to Headers
axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers["Authorization"] = token;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Response Interceptor - Handle Expired Token
axiosInstance.interceptors.response.use(
    (response) => response,  // If response is OK, return it
    (error) => {
        if (error.response && error.response.status === 401) {
            console.error("Token expired. Logging out...");
            localStorage.removeItem("token");  // Clear token from localStorage
            localStorage.removeItem("user");   // Clear user data if stored
            window.location.href = "/login";   // Redirect to login page
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
