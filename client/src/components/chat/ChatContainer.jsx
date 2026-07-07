import { Box } from "@mui/material";
import { useSelector } from "react-redux";

import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import EmptyChat from "./EmptyChat";

function ChatContainer() {
    const selectedConversation = useSelector((state) => state.conversation.selectedConversation);

    if (!selectedConversation) {
        return <EmptyChat />
    }

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
                backgroundColor: "#efeae2",
            }}
        >
            <ChatHeader />
            <MessageList />
            <MessageInput />
        </Box>
    )
}

export default ChatContainer