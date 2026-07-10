import axios from "axios";

const instance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/`,
  timeout: 10000,
  headers: { "X-Custom-Header": "foobar" },
  withCredentials: true,
});

instance.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = window.localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

instance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/refresh")
    ) {
      originalRequest._retry = true;
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/refresh`, {
          withCredentials: true,
        });
        const token = res?.data?.data;
        if (token) localStorage.setItem("token", token);
        return instance(originalRequest);
      } catch (e: any) {
        const hadToken = Boolean(localStorage.getItem("token"));
        localStorage.removeItem("token");
        if (hadToken) window.dispatchEvent(new Event("eduportal:auth-state-changed"));
        return Promise.reject(e);
      }
    }
    return Promise.reject(error.response?.data || error);
  }
);
export default instance;
