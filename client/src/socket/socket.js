import { io } from "socket.io-client";

// const socket = io("http://localhost:8000", {
const socket = io(import.meta.env.VITE_API_URL, {
    withCredentials: true,
    autoConnect: false,
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    transports: ["websocket", "polling"], 
});

export default socket;