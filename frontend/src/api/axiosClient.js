import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:5000/api",
  timeout: 5000,
});

axiosClient.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error("API ERROR:", err?.response || err.message);
    return Promise.reject(err);
  }
);

export default axiosClient;