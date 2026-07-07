const { Server } = require("socket.io");

let io;

const onlineUsers = {};

const initSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: process.env.FORMTEND_URL, 
            credentials: true,
        },
        pingTimeout: 20000,  
        pingInterval: 10000,
    });

    io.on("connection", (socket) => {
        console.log("==============================");
        console.log("CONNECTED:", socket.id);
        console.log("==============================");

        // ---- USER SETUP ----
        socket.on("setup", (userId) => {
            if (!userId) return;

            console.log("SETUP:", userId, socket.id);
            socket.userId = userId;

            onlineUsers[userId] = socket.id;

            socket.join(userId);

            io.emit("online-users", Object.keys(onlineUsers));

            socket.emit("connected");
        });

        //  CHAT ROOM
        socket.on("join-chat", (conversationId) => {
            if (!conversationId) return;
            socket.join(conversationId);
            console.log(socket.id, "joined", conversationId);
        });

        socket.on("leave-chat", (conversationId) => {
            if (!conversationId) return;
            socket.leave(conversationId);
        });

        socket.on("typing", (conversationId) => {
            socket.to(conversationId).emit("typing");
        });

        socket.on("stop-typing", (conversationId) => {
            socket.to(conversationId).emit("stop-typing");
        });

        // DISCONNECT 
        socket.on("disconnect", async (reason) => {
            console.log("==============================");
            console.log("DISCONNECTED:", socket.id, "Reason:", reason);
            console.log("==============================");

            try {
                const userId = socket.userId;
                if (!userId) return;

                if (onlineUsers[userId] !== socket.id) return;

                delete onlineUsers[userId];

                const User = require("../models/userModel");
                const lastSeenTime = new Date();

                await User.findByIdAndUpdate(userId, { lastSeen: lastSeenTime });

                io.emit("last-seen-update", { userId, lastSeen: lastSeenTime });
                io.emit("online-users", Object.keys(onlineUsers));
            } catch (err) {
                console.log("Disconnect error:", err);
            }
        });
    });

    return io;
};

const getIO = () => {
    if (!io) {
        throw new Error("Socket.io not initialized");
    }
    return io;
};

module.exports = {
    initSocket,
    getIO,
};