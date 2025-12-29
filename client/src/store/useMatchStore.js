import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useMatchStore = create((set) => ({
    matches: [],
    IsLoadingMyMatches: false,
    IsLoadingUserProfiles: false,
    userProfiles:[],

    getMyMatches: async () => {
        try {
           set({IsLoadingMyMatches: true})
           const res = await axiosInstance.get("/matches");
           set({matches: res.data.matches})
        } catch (error) {
            set({matches: []});
            toast.error(error.response.data.message || "Something went wrong")
        } finally {
            set({IsLoadingMyMatches: false})
        }
    },

    getUserProfiles: async () => {
        try {
           set({IsLoadingUserProfiles: true})
           const res = await axiosInstance.get("/matches/user-profiles");
           set({userProfiles: res.data.users})
        } catch (error) {
            set({userProfiles: []});
            toast.error(error.response.data.message || "Something went wrong")
        } finally {
            set({IsLoadingUserProfiles: false})
        }
    },
}));