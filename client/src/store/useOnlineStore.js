// store/useOnlineStore.js
import { create } from "zustand";
import { getSocket } from "../socket/socket.client";

export const useOnlineStore = create((set) => ({
	onlineUsers: [],

	subscribeToOnlineUsers: () => {
	const socket = getSocket();
	if (!socket) return;

	socket.on("onlineUsers", (users) => {
		set({ onlineUsers: users });
	});
},

unsubscribeFromOnlineUsers: () => {
	const socket = getSocket();
	if (!socket) return;

	socket.off("onlineUsers");
},
}));
