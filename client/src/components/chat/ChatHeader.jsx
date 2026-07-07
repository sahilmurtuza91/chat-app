import { Avatar, Box, IconButton, Stack, Typography } from "@mui/material";
import { useOutletContext } from "react-router";
import { useMediaQuery, useTheme } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import { HiOutlinePhone } from "react-icons/hi";
import { HiOutlineVideoCamera } from "react-icons/hi2";
import { BsThreeDotsVertical } from "react-icons/bs";

import { useSelector } from "react-redux"
import { useState, useEffect } from "react";
import ChatMenue from "./ChatMenue";
import UserProfileDialog from "../profile/UserProfileDialog";
import socket from "../../socket/socket";
import UserAvatar from "../sidebar/UserAvatar"


function ChatHeader() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const { setOpenSideBar } = useOutletContext();
    const [typing, setTyping] = useState(false);
    const [openProfile, setOpenProfile] = useState(false);

    const selectedUser = useSelector((state) => state.conversation.selectedUser);

    const onlineUsers = useSelector((state) => state.socket.onlineUsers);
    const lastSeen = useSelector((state) => state.socket.lastSeen);
    const isOnline = onlineUsers.includes(selectedUser._id);
    const userLastSeen = lastSeen[selectedUser?._id];

    const formatLastSeen = (date) => {
        if (!date) return "Last seen recently";

        const last = new Date(date);

        return `Last seen ${last.toLocaleString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        })}`;
    };

    // this decise that the menue is open bellow which button
    const [anchorEl, setAnchorEl] = useState(null);

    const handleMenueOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleMenueClose = (event) => {
        setAnchorEl(null);
    };

    useEffect(() => {
        const handleTyping = () => {
            setTyping(true);
        };

        const handleStopTyping = () => {
            setTyping(false);
        }

        socket.on("typing", handleTyping);
        socket.on("stop-typing", handleStopTyping);

        return () => {
            socket.off("typing", handleTyping);
            socket.off("stop-typing", handleStopTyping);
        };
    }, []);

    if (!selectedUser) return null;
    return (
        <Box
            sx={{
                height: 70,
                backgroundColor: "#f0f2f5",
                px: 2,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
            }}
        >
            <Stack
                direction="row"
                spacing={1.5}
                alignItems="center"
            >
                {isMobile && (
                    <IconButton onClick={() => setOpenSideBar(true)}>
                        <MenuIcon />
                    </IconButton>
                )}

                <UserAvatar
                    name={selectedUser.name}
                    profile_pic={selectedUser.profile_pic}
                    size={45}
                />

                <Box>
                    <Typography fontWeight="600">
                        {selectedUser.name}
                    </Typography>

                    <Typography
                        variant="body2"
                        sx={{
                            color: typing
                                ? "#1976d2"
                                : isOnline
                                    ? "green"
                                    : "#757575",
                        }}
                    >
                        {typing
                            ? "Typing..."
                            : isOnline
                                ? "Online"
                                : formatLastSeen(userLastSeen)}
                    </Typography>
                </Box>
            </Stack>
            <Stack
                direction="row"
                spacing={1}
            >

                <IconButton>

                    <HiOutlinePhone
                        size={20}
                    />

                </IconButton>

                <IconButton>

                    <HiOutlineVideoCamera
                        size={22}
                    />

                </IconButton>

                <IconButton
                    onClick={handleMenueOpen}
                >
                    <BsThreeDotsVertical
                        size={18}
                    />
                </IconButton>
            </Stack>

            <ChatMenue
                anchorEl={anchorEl}
                handleMenueClose={handleMenueClose}
                openProfile={() => setOpenProfile(true)}
            />
            <UserProfileDialog
                open={openProfile}
                handleClose={() => setOpenProfile(false)}
            />
        </Box>
    )
}

export default ChatHeader