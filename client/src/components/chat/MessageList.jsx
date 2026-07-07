import { Box, CircularProgress, Typography } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useRef } from "react";
import { useGetMessageQuery, messageApi, useMarkeMessageSeenMutation } from "../../features/message/messageApi";
import MessageBubble from "./MessageBubble";
import socket from "../../socket/socket";

export default function MessageList() {
    const bottomRef = useRef(null);
    const dispatch = useDispatch();
    const conversation = useSelector(
        (state) => state.conversation.selectedConversation,
    );

    const [markMEssageSeen] = useMarkeMessageSeenMutation();
    const currentUser = useSelector((state) => state.user);

    const { data, isLoading } = useGetMessageQuery(conversation?._id, {
        skip: !conversation,
    });

    useEffect(() => {
        bottomRef.current?.scrollIntoView({
            behavior: "smooth",
        });
    }, [data]);


    useEffect(() => {
        if (!conversation) return;
        const handleReceiveMessage = (message) => {
console.log("SOCKET RECEIVE", message);
            if (message.conversationId !== conversation._id) {
                return;
            }

            dispatch(messageApi.util.updateQueryData(
                "getMessage",
                conversation._id,
                (draft) => {
                    if (!draft?.data) return;
                    draft.data.push(message);
                }
            )
            );
        };

        const handleMessageSeen = (conversationId) => {
            if (conversationId !== conversation?._id) return;

            dispatch(messageApi.util.updateQueryData(
                "getMessage",
                conversationId,
                (draft) => {
                    if (!draft?.data) return;

                    draft.data.forEach((message) => {
                        message.seen = true;
                    });
                }
            ))
        }
        socket.on("receive-message", handleReceiveMessage);
        socket.on("messages-seen", handleMessageSeen);

        return () => {
            socket.off("receive-message", handleReceiveMessage)
            socket.off("messages-seen", handleMessageSeen);;
        }
    }, [conversation, dispatch, markMEssageSeen]);


    useEffect(() => {
        if (!conversation) return;

        if (data?.data?.length) {
            markMEssageSeen(conversation._id);
        }

    }, [data, conversation, markMEssageSeen]);

    if (!isLoading && data?.data?.length === 0) {

        return (

            <Box
                sx={{
                    flex: 1,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    color: "gray",
                }}
            >

                No messages yet

            </Box>

        );

    }

    return (
        <Box
            sx={{
                flex: 1,
                overflowY: "auto",
                p: 2,
                display: "flex",
                flexDirection: "column",
                gap: 1,
            }}
        >
            {data?.data?.map((message) => (
                <MessageBubble
                    key={message._id}
                    message={message}
                    ownMessage={message.sender._id === currentUser._id}
                />
            ))}
            <div ref={bottomRef}></div>
        </Box>
    );
}