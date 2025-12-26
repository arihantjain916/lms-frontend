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
  (error) => {
    // Handle errors here if needed
    return error.response.data;
  }
);
export default instance;
