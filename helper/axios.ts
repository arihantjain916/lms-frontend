import axios from "axios";

const instance = axios.create({
  baseURL: "https://192.168.1.15:8080/api/",
  timeout: 1000,
  headers: { "X-Custom-Header": "foobar" },
  withCredentials: true,
});

instance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== "/auth/refresh"
    ) {
      originalRequest._retry = true;
      try {
        const res = await axios.get("https://192.168.1.15:8080/api/auth/refresh", {
          withCredentials: true,
        });
        const token = res?.data?.data;
        localStorage.setItem("token", token);
        return instance(originalRequest);
      } catch (e: any) {
        localStorage.removeItem("token");
        return Promise.reject(e);
      }
    }
    return error.response.data;
  }
);
export default instance;
