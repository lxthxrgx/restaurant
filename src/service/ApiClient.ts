import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://localhost:7239",
  headers: {
    "Content-Type": "application/json",
  },
});

// apiClient.interceptors.request.use(config => {
//   const token = localStorage.getItem("token"); // Замените на способ получения токена
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

export default apiClient;
