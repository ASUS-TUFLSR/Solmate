import {create} from "zustand"
import {axiosInstance} from "../lib/axios"
import toast from "react-hot-toast";
import { getSocket } from "../socket/socket.client";
import {useAuthStore} from "../store/useAuthStore"

export const useMessageStore = create((set) => ({
    messages: [],
    loading: true,

  sendMessage: async (receiverId, content) => {
	const authUser = useAuthStore.getState().authUser;

	if (!authUser) {
		toast.error("You must be logged in to send messages");
		return;
	}

	try {
		set((state) => ({
				messages: [
					...state.messages,
					{ _id: Date.now(), sender: useAuthStore.getState().authUser._id, content },
				],
			}));

		await axiosInstance.post("/messages/send", {
			recieverId: receiverId,
			content,
		});
	} catch (error) {
		
		toast.error(
			error?.response?.data?.message ||
			error?.message ||
			"Message failed to send"
		);
	}
},



    getMessages: async (userId) => {
        try {
            set({loading: true});
            const res = await axiosInstance.get(`/messages/conversation/${userId}`);
            set({messages: res.data.message});
			console.log("Fetched messages:", res.data);
        } catch (error) {
            console.log(error);
            set({messages: []});
        } finally {
            set({loading: false});
        }
    },
    subscribeToMessage: () => {
	const socket = getSocket();
	if (!socket) return;

	socket.on("newMessage", ({ message }) => {
		set((state) => ({
			messages: [
				...(Array.isArray(state.messages) ? state.messages : [])
					.filter((m) => !m.optimistic),
				message,
			],
		}));
	});
},


    unsubscribeFromMessage: () => {
        const socket = getSocket();
        socket.off("newMessage");
    },
}))