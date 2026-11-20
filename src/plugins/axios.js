import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("token");
    if (token) {
      config.headers["x-api-token"] = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const esLogin = error.config?.url?.includes("/login");

    if (error.response?.status === 401 && !esLogin) {
      if (error.response.data?.tokenExpired) {
        sessionStorage.setItem("sessionExpired", "true");
      }

      sessionStorage.removeItem("token");
      sessionStorage.removeItem("tokenExpiresAt");
      sessionStorage.removeItem("usuario");

      window.location.href = "/";
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
