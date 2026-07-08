import { Box } from "@mui/material";
import { useSelector } from "react-redux";

import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import EmptyChat from "./EmptyChat";

function ChatContainer() {
    const selectedConversation = useSelector(
        (state) => state.conversation.selectedConversation,
    );

    if (!selectedConversation) {
        return <EmptyChat />;
    }

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
                minHeight: 0,
                overflow: "hidden",
                backgroundColor: "#efeae2",
            }}
        >
            <ChatHeader />
            <Box
                sx={{
                    flex: 1,
                    minHeight: 0,
                    overflow: "hidden",
                }}
            >
                <MessageList />
            </Box>

            <MessageInput />
        </Box>
    );
}

export default ChatContainer;
