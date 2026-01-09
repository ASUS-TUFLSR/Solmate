import { Server } from "socket.io";

let io;

const connectedUsers = new Map();
const onlineUsers = new Set();

export const initializeSocket = (httpServer) => {

    io = new Server(httpServer, {
        cors:{
            origin:process.env.CLIENT_URL,
            credentials: true
        }
    });

    io.use((socket, next) => {
        const userId = socket.handshake.auth.userId;
        if(!userId) return next(new Error("Invalid User Id"));
        
        socket.userId = userId;
        next();
    })

    io.on("connection", (socket) => {
	const userId = socket.userId;

	onlineUsers.add(userId);
	console.log("User connected:", userId);

	connectedUsers.set(userId, socket.id);

	io.emit("onlineUsers", Array.from(onlineUsers));

	socket.on("disconnect", () => {
		onlineUsers.delete(userId);
		console.log("User disconnected:", userId);

		connectedUsers.delete(userId);
		io.emit("onlineUsers", Array.from(onlineUsers));
	});
});

}

export const getIO = () => {
    if(!io){
        throw new Error("Socket.io is not initialized");
    }
    return io;
}

export const getConnectedUser = () => connectedUsers;