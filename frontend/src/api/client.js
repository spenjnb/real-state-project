import axios from "axios";

const client = axios.create({
  baseURL: "http://127.0.0.1:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor
client.interceptors.request.use(
  (config) => {
    // You can add auth tokens here
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
client.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle common errors here
    console.error("API Error:", error.response?.data);
    return Promise.reject(error);
  }
);

export default client;
