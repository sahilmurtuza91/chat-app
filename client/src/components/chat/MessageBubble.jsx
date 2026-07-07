import { Box, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import DoneIcon from "@mui/icons-material/Done";
import DoneAllIcon from "@mui/icons-material/DoneAll";

export default function MessageBubble({ message, ownMessage }) {
    const user = useSelector((state) => state.user);

    const isMe = message.sender._id === user._id;
    const time = new Date(message.createdAt).toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    });
    return (

        <Box
            sx={{
                display: "flex",
                justifyContent: isMe ? "flex-end" : "flex-start",
                // mb: 1,
            }}
        >

            <Box
                sx={{
                    bgcolor: isMe ? "#DCF8C6" : "#fff",
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    maxWidth: "60%",
                    boxShadow: 1,
                }}
            >

                {message.imageUrl && (
                    // <img
                    //     src={`http://localhost:8000${message.imageUrl}`}
                    //     alt="message"
                    <img
                        src={message.imageUrl}
                        alt="message"

                        style={{
                            width: "100%",
                            maxHeight: "300px",
                            objectFit: "cover",
                            borderRadius: "10px",
                        }}
                    />
                )}

                {message.text && (
                    <Typography
                        sx={{
                            mt: message.imageUrl ? 1 : 0,
                            wordBreak: "break-word",
                        }}
                    >
                        {message.text}
                    </Typography>
                )}
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        alignItems: "center",
                        gap: 0.5,
                        mt: 0.5,
                    }}
                >

                    <Typography
                        variant="caption"
                        sx={{
                            color: "gray",
                            fontSize: "10px",
                            lineHeight: 1,
                        }}
                    >
                        {time}
                    </Typography>

                    {isMe && (
                        message.seen ? (
                            <DoneAllIcon
                                sx={{
                                    fontSize: 16,
                                    color: "#4FC3F7",
                                }}
                            />
                        ) : (
                            <DoneIcon
                                sx={{
                                    fontSize: 15,
                                    color: "gray",
                                }}
                            />
                        )
                    )}

                </Box>
            </Box>

        </Box>

    );

}