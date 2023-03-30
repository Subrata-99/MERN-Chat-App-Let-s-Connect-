import axios from "axios";
import { ChatState } from "../Context/ChatProvider";

const instance = axios.create({
  baseURL:
    // "https://mern-chat-app-backend-0oq9.onrender.com/" ||
    process.env.REACT_APP_API_URL || "http://localhost:3000",
});

instance.interceptors.request.use(
  (config) => {
    // const { user } = ChatState();
    console.log("axios instance------------");
    const user = JSON.parse(localStorage.getItem("user_info")) || null;
    if (user?.token) config.headers["Authorization"] = `Bearer ${user?.token}`;

    // config.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // if (error?.response?.status == 401) {
    //   swal(
    //     error?.response?.message || "Session has been expired. Please login."
    //     // "Unfortunately we cannot process your request at the moment, please try again later",
    //   ).then(() => {
    //     //
    //   });
    // }

    return Promise.reject(error.response);
  }
);

export default instance;
