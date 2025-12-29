import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useMatchStore = create((set) => ({
    matches: [],
    loading: false,

    getMyMatches: async () => {
        try {
           set({loading: true})
           const res = await axiosInstance.get("/matches");
           set({matches: res.data.matches})
        } catch (error) {
            set({matches: []});
            toast.error(error.response.data.message || "Something went wrong")
        } finally {
            set({loading: false})
        }
    }
}));