import axios from "axios"


//TODO: Update BASEURL so that it works in deployment
export const axiosInstance = axios.create({
    baseURL: "http://localhost:5000/api",
    withCredentials: true,
})