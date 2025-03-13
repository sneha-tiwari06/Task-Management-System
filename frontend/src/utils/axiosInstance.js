import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";  
const FILE_BASE_URL = "http://localhost:5000/";  

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = token;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export { axiosInstance, FILE_BASE_URL };
