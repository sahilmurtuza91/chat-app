import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { RouterProvider } from "react-router-dom"
import router from "./routes/Routes";

import { useGetCurrentUserQuery } from "./features/auth/authApi"
import { setUser, logoutUser } from "./redux/userSlice"
import socket from "./socket/socket"
import { sentOnlineUsers, setLastSeen } from "./redux/socketSlice";

function App() {
    const dispatch = useDispatch();

    const { data, isSuccess, isError, isLoading } = useGetCurrentUserQuery();

    const currentUserId = useSelector((state) => state.user._id);

    const conversation = useSelector((state) => state.conversation.selectedConversation);

    useEffect(() => {
        if (isSuccess && data?.success) {
            dispatch(setUser(data.data));
        }
        if (isError || (isSuccess && !data?.success)) {
            dispatch(logoutUser());
        }
    }, [data, isSuccess, isError, dispatch]);

    useEffect(() => {
        if (!currentUserId) {
            if (socket.connected) {
                socket.disconnect();
            }
            return;
        }

        const handleConnect = () => {
            console.log("Socket connected:", socket.id);
            socket.emit("setup", currentUserId);
        };

        socket.on("connect", handleConnect);

        if (socket.connected) {
            socket.emit("setup", currentUserId);
        } else {
            socket.connect();
        }

        return () => {
            socket.off("connect", handleConnect);
        };
    }, [currentUserId]);

    // online users list
    useEffect(() => {
        const handleOnlineUsers = (users) => {
            dispatch(sentOnlineUsers(users));
        };
        socket.on("online-users", handleOnlineUsers);
        return () => {
            socket.off("online-users", handleOnlineUsers);
        };
    }, [dispatch]);

    // last seen
    useEffect(() => {
        const handleLastSeen = (payload) => {
            dispatch(setLastSeen(payload));
        };
        socket.on("last-seen-update", handleLastSeen);
        return () => {
            socket.off("last-seen-update", handleLastSeen);
        };
    }, [dispatch]);

    // join / leave chat room for typing indicators
    useEffect(() => {
        if (!conversation) return;

        const joinRoom = () => {
            socket.emit("join-chat", conversation._id);
            console.log("Joined:", conversation._id);
        };

        if (socket.connected) {
            joinRoom();
        }

        socket.on("connect", joinRoom);

        return () => {
            socket.off("connect", joinRoom);
            socket.emit("leave-chat", conversation._id);
        };
    }, [conversation]);

  

    if (isLoading) {
        return <h2>Loading...</h2>
    }

    return <RouterProvider router={router} />;
}

export default App