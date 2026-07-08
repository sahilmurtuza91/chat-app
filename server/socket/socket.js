const { Server } = require("socket.io");

let io;

const onlineUsers = {};

const initSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: [
                process.env.FORMTEND_URL,
                "http://localhost:5173",
            ], 
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
        socket.on("setup", (user) => {
            if(!user?.userId) return;

            // console.log("SETUP:", userId, socket.id);
            socket.userId = user.userId; // save userId inside socket

            // save complete inpormation in memory
            // onlineUsers[userId] = socket.id;
            onlineUsers[user.userId]= {
                userId: user.userId, 
                socketId: socket.id,
                name:user.name,
                email:user.email,
                profile_pic:user.profile_pic,
                latitude: null,
                longitude: null,
            }

            // socket.join(userId); // personal room
            socket.join(user.userId);
            console.log("ONLINE USERS MEMORY");
            console.log(onlineUsers);
            // send online users
            io.emit("online-users", Object.keys(onlineUsers));

            // send all availabe live locations to newly connected user
            socket.emit("all-live-location", onlineUsers);

            // Notify client that socket setup completed successfully.
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

        // Receive the users live location from the server
        socket.on("send-location", (data)=>{
            const { userId, latitude, longitude } = data;

            // if user is not online
            if(!onlineUsers[userId]) return;

            // memory update
            onlineUsers[userId].latitude = latitude;
            onlineUsers[userId].longitude = longitude;

            console.log("Live location updated")
            console.log(onlineUsers[userId]);


            // send updated location to all connected clients
            io.emit("receive-location",{
                userId,
                name:onlineUsers[userId].name,
                profile_pic:onlineUsers[userId].profile_pic,
                latitude,
                longitude,
            });

            // Send complete live location list to all connected users.
            // This keeps every client synchronized.
            io.emit("all-live-location", onlineUsers);
        });

        // DISCONNECT 
        socket.on("disconnect", async (reason) => {
            console.log("==============================");
            console.log("DISCONNECTED:", socket.id, "Reason:", reason);
            console.log("==============================");

            try {
                const userId = socket.userId;
                if (!userId) return;

                // if (onlineUsers[userId] !== socket.id) return;
                if(onlineUsers[userId]?.socketId !== socket.id) return;

                delete onlineUsers[userId];


                const User = require("../models/userModel");
                const lastSeenTime = new Date();

                await User.findByIdAndUpdate(userId, { lastSeen: lastSeenTime });

                io.emit("last-seen-update", { userId, lastSeen: lastSeenTime });
                io.emit("online-users", Object.keys(onlineUsers));

                io.emit("all-live-location", onlineUsers)
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