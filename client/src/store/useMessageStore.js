import {create} from "zustand"
import {axiosInstance} from "../lib/axios"
import toast from "react-hot-toast";
import { getSocket } from "../socket/socket.client";
import {useAuthStore} from "../store/useAuthStore"

export const useMessageStore = create((set) => ({
    messages: [],
    loading: true,

    sendMessage: async (recieverId, content) => {
        try {
            set(state => ({
                messages: [...state.messages, {
                    sender: useAuthStore.getState().authUser._id,
                    content
                }]
            }))
            const res = await axiosInstance.post("/messages/send", {recieverId, content});
            console.log("Message Sent", res.data);
        } catch (error) {
            toast.error(error.response.data.message || "Oop's something went wrong");
        }
    },

    getMessages: async (userId) => {
        try {
            set({loading: true});
            const res = await axiosInstance.get(`/messages/conversation/${userId}`);
            set({messages: res.data.messages});
        } catch (error) {
            console.log(error);
            set({messages: []});
        } finally {
            set({loading: false});
        }
    },

    subscribeToMessage: () => {
        const socket = getSocket();
        socket.on("newMessage", ({message}) => {
            set(state => ({
                messages: [...state.messages, message]
            }));
        })
        
    },

    unsubscribeFromMessage: () => {
        const socket = getSocket();
        socket.off("newMessage");
    }

}))