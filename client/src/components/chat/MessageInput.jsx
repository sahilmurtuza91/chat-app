import { Box, TextField, IconButton, CircularProgress } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

import { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useSendMessageMutation, messageApi } from "../../features/message/messageApi";
import socket from "../../socket/socket";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import CloseIcon from "@mui/icons-material/Close";

export default function MessageInput() {

    const [text, setText] = useState("");
    const [media, setMedia] = useState(null);
    const [preview, setPreview] = useState("");
    const fileInputRef = useRef(null);

    const selectedConversation = useSelector((state) => state.conversation.selectedConversation);

    const dispatch = useDispatch();

    const typingTimeout = useRef(null);
    const isTyping = useRef(false);

    const [sendMessage, {isLoading}] = useSendMessageMutation();


    const handleSend = async () => {
        if (!text.trim() && !media) return;
        try {
            socket.emit(
                "stop-typing",
                selectedConversation._id
            );

            isTyping.current = false;

            clearTimeout(typingTimeout.current);

            // const newMessage = await sendMessage({
            //     conversationId: selectedConversation._id,
            //     text,
            // }).unwrap();

            const formData = new FormData();

            formData.append(
                "conversationId",
                selectedConversation._id
            );

            formData.append(
                "text",
                text
            );
            if (media) {
                formData.append(
                    "media",
                    media
                )
            }

            const newMessage = await sendMessage(formData).unwrap();

            dispatch(
                messageApi.util.updateQueryData(
                    "getMessage",
                    selectedConversation._id,
                    (draft) => {
                        if (!draft?.data) return;
                        draft.data.push(newMessage.data);
                    }
                )
            )

            setText("");
            if (preview) {
                URL.revokeObjectURL(preview);
            }
            setPreview("");
            setMedia(null);
            fileInputRef.current.value = "";
        } catch (error) {
            console.log(error);
        }
    }

    const handleTyping = (e) => {
        setText(e.target.value);

        if (!isTyping.current) {
            isTyping.current = true;
            if (!selectedConversation) return;
            socket.emit("typing", selectedConversation._id);
        };

        clearTimeout(typingTimeout.current);

        typingTimeout.current = setTimeout(() => {
            socket.emit("stop-typing", selectedConversation._id);
            isTyping.current = false;
        }, 2000);

    }

    return (

        <Box
            sx={{
                p: 2,
                display: "flex",
                gap: 2,
                borderTop: "1px solid #ddd",
                background: "#f0f2f5"
            }}
        >
            {preview && (
                <Box
                    sx={{
                        mb: 2,
                        position: "relative",
                        top: "5px",
                        width: "90px",
                    }}
                >
                    <img
                        src={preview}
                        alt="Preview"
                        style={{
                            width: "100%",
                            borderRadius: "5px",
                        }}
                    />
                    <IconButton
                        size="small"
                        onClick={() => {
                            URL.revokeObjectURL(preview);

                            setPreview("");
                            setMedia(null);
                            fileInputRef.current.value = "";
                        }}
                        sx={{
                            position: "absolute",
                            top: 4,
                            right: 4,
                            width: 20,
                            height: 20,
                            bgcolor: "rgba(255,255,255,0.9)",
                            p: 0,
                            "&:hover": {
                                bgcolor: "white",
                            },
                        }}
                    >
                        <CloseIcon sx={{ fontSize: 14 }} />
                    </IconButton>
                </Box>
            )}
            <TextField
                fullWidth
                placeholder="Type a message..."
                value={text}
                // onChange={(e) => setText(e.target.value)}
                onChange={handleTyping}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        handleSend();
                    }
                }}
            />
            <IconButton
                onClick={() => fileInputRef.current.click()}
            >
                <AttachFileIcon />
            </IconButton>
            <input
                type="file"
                hidden
                ref={fileInputRef}
                accept="image/*,video/*"
                onChange={(e) => {
                    const file = e.target.files[0];
                    if (!file) return;
                    console.log(file);
                    setMedia(file);
                    setPreview(URL.createObjectURL(file)); // browser crete temporay url fot the preview
                }}
            />
            <IconButton
                onClick={handleSend}
                disabled={isLoading}
            >
                {isLoading ? ( <CircularProgress size={22}/>):(<SendIcon />)}
            </IconButton>
        </Box>
    );
}