import React from 'react';
import { Box, Typography, useTheme,  } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { IconButton } from "@mui/material";
import { IoIosChatbubbles } from "react-icons/io";
import LockIcon from '@mui/icons-material/Lock';
import MenuIcon from '@mui/icons-material/Menu';
import { useOutletContext } from "react-router";

function EmptyChat() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const { setOpenSideBar } = useOutletContext();
    return (
        <Box
            sx={{
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                backgroundColor: "#f8f9fa", 
                position: "relative",
                px: 3,
                textAlign: "center"
            }}
        >
            {isMobile && (
                <Box sx={{ position: "absolute", top: 10, left: 10 }}>
                    <IconButton onClick={() => setOpenSideBar(true)}>
                        <MenuIcon />
                    </IconButton>
                </Box>
            )}
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    maxWidth: 400,
                    mb: 4
                }}
            >
               
                <Box
                    sx={{
                        width: 120,
                        height: 120,
                        borderRadius: "50%",
                        backgroundColor: "#e3f2fd", 
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        mb: 3,
                        color: "#00a884", 
                        boxShadow: "0 8px 24px rgba(0, 168, 132, 0.12)"
                    }}
                >
                    <IoIosChatbubbles size={55} />
                </Box>

                
                <Typography
                    variant='h5'
                    sx={{
                        fontWeight: 300,
                        color: "#41525d",
                        fontSize: "1.6rem",
                        mb: 1
                    }}
                >
                    Chat App for Web
                </Typography>

                
                <Typography
                    variant="body2"
                    sx={{
                        color: "#667781",
                        lineHeight: 1.6,
                        fontWeight: 400
                    }}
                >
                    Send and receive messages without keeping your phone online.
                    Select a conversation from the list to start chatting.
                </Typography>
            </Box>

            
            <Box
                sx={{
                    position: "absolute",
                    bottom: 40,
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    color: "#8696a0"
                }}
            >
                <LockIcon sx={{ fontSize: "0.85rem" }} />
                <Typography
                    variant="caption"
                    sx={{
                        fontSize: "0.75rem",
                        letterSpacing: "0.3px"
                    }}
                >
                    End-to-end encrypted
                </Typography>
            </Box>
        </Box>
    );
}

export default EmptyChat;