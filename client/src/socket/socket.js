import { io } from "socket.io-client";

const socket = io("http://localhost:8000", {
    withCredentials: true,
    autoConnect: false,
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    transports: ["websocket", "polling"], 
});

export default socket;