import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RouterProvider } from "react-router-dom";
import router from "./routes/Routes";

import { useGetCurrentUserQuery } from "./features/auth/authApi";
import { setUser, logoutUser } from "./redux/userSlice";
import socket from "./socket/socket";
import { sentOnlineUsers, setLastSeen, setLiveLocation, setAllLiveLocations } from "./redux/socketSlice";

function App() {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const { data, isSuccess, isError, isLoading } = useGetCurrentUserQuery();
    useEffect(() => {
        if (isSuccess || isError) {
            setLoading(false);
        }
    }, [isSuccess, isError]);
    // const currentUserId = useSelector((state) => state.user._id);

    // Current logged-in user from Redux( because we have to show the user name and profile pic on the map so to prevent agai and again backend hit)
    const currentUser = useSelector((state) => state.user);

    const conversation = useSelector(
        (state) => state.conversation.selectedConversation,
    );

    useEffect(() => {
        if (isSuccess && data?.success) {
            dispatch(setUser(data.data));
        }
        if (isError || (isSuccess && !data?.success)) {
            dispatch(logoutUser());
        }
    }, [data, isSuccess, isError, dispatch]);

    useEffect(() => {
        // if (!currentUserId) {
        if (!currentUser?._id) {
            if (socket.connected) {
                socket.disconnect();
            }
            return;
        }

        // Send user information to server
        const handleConnect = () => {
            console.log("Socket connected:", socket.id);
            // socket.emit("setup", currentUserId);
            // send the user infromation to server not only the userId for future uses
            socket.emit("setup", {
                userId: currentUser._id,
                name: currentUser.name,
                profile_pic: currentUser.profile_pic,
                email: currentUser.email,
            });
        };

        socket.on("connect", handleConnect);

        if (socket.connected) {
            // socket.emit("setup", currentUserId);
            handleConnect();
        } else {
            socket.connect();
        }

        return () => {
            socket.off("connect", handleConnect);
        };
        // }, [currentUserId]);
    }, [currentUser]);

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

    // Recive live location from server
    useEffect(() => {
        const handleReceiveLocation = (data) => {
            console.log("Live location received: ", data);

            // save location inside redux
            dispatch(setLiveLocation(data));
        };
        socket.on("receive-location", handleReceiveLocation);

        return () => {
            socket.off("receive-location", handleReceiveLocation);
        }
    }, [dispatch]);


    // Receive complete live location list from server
    useEffect(() => {
        const handleAllLiveLocations = (users) => {
            console.log("All live locations:", users);
            // Remove users whose location is not available at that time
            const filteredUsers = {};

            Object.values(users).forEach((user) => {
                if (
                    user.latitude !== null &&
                    user.longitude !== null
                ) {
                    filteredUsers[user.userId] = user;
                }

            });

            dispatch(setAllLiveLocations(filteredUsers));

        };

        socket.on("all-live-location", handleAllLiveLocations);

        return () => {
            socket.off("all-live-location", handleAllLiveLocations);
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

    // live location Continuously sended to server
    useEffect(() => {
        // check user login or not
        if (!currentUser?._id) return;

        // check browser support Geolocation
        if (!navigator.geolocation) {
            console.log("Geolocation is not supported");
            return;
        }

        // watchPosition continiously track movement
        const watchId = navigator.geolocation.watchPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                console.log("My location: ", latitude, longitude);

                // send location event to server
                socket.emit("send-location", {
                    userId: currentUser._id,
                    latitude,
                    longitude,
                });
            },
            // error callback
            (error) => {
                console.log("Location Error: ", error.message);
            },
            {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0, // this help to prevent from using the cache data bacause location required fresh  data
            },
        );
        return () => {
            navigator.geolocation.clearWatch(watchId);
        };
    }, [currentUser]);

    if (isLoading || loading) {
        return <h2>Loading...</h2>;
    }

    return <RouterProvider router={router} />;
}

export default App;
