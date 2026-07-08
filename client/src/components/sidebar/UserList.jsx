import { Box, List, ListItemButton, ListItemText } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import UserListItem from "./UserListItem";
import OnlineUsersSidebar from "../location/OnlineUsersList";

import { setSelectedConversation } from "../../redux/conversationSlice";
import { useCreateConversationMutation } from "../../features/conversation/conversationApi";

function UserList({ activeTab, data, currentTab, setOpenSideBar }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Selected conversation from Redux
    const selectedConversation = useSelector(
        (state) => state.conversation.selectedConversation,
    );

    // All live locations from Redux
    const liveLocations = useSelector((state) => state.socket.liveLocations);

    // Convert object into array
    const onlineUsers = Object.values(liveLocations);

    const [createConversation] = useCreateConversationMutation();

    return (
        <Box
            sx={{
                flexGrow: 1,
                overflow: "auto",
                backgroundColor: "#ffffff",
            }}
        >
            <List sx={{ p: 0 }}>
                {activeTab === "chats" &&
                    data?.data?.map((chatUser) => (
                        <UserListItem
                            key={chatUser._id}
                            chatUser={chatUser}
                            selectedConversation={selectedConversation}
                            onClick={async () => {
                                try {
                                    const response = await createConversation(
                                        chatUser._id,
                                    ).unwrap();

                                    dispatch(
                                        setSelectedConversation({
                                            user: chatUser,
                                            conversation: response.data,
                                        }),
                                    );
                                    if (setOpenSideBar) {
                                        setOpenSideBar(false);
                                    }
                                } catch (error) {
                                    console.log(error);
                                }
                            }}
                        />
                    ))}

                {/* online users */}
                {activeTab === "location" && (
                    <OnlineUsersSidebar
                        users={onlineUsers}
                        setOpenSideBar={setOpenSideBar}
                    />
                )}

                {/* Other sidebar menue */}
                {
                    activeTab !== "chats" &&
                    activeTab !== "location" &&
                    currentTab?.menus?.map((menu) => (
                        <ListItemButton
                            key={menu.route}
                            onClick={() => {
                                if (setOpenSideBar) {
                                    setOpenSideBar(false);
                                }
                                navigate(menu.route);
                            }}
                            sx={{
                                py: 1.8,
                                px: 2,
                                borderBottom: "1px solid #f0f2f5",

                                "&:hover": {
                                    backgroundColor: "#f5f6f6",
                                },
                            }}
                        >
                            <ListItemText
                                primary={menu.title}
                                primaryTypographyProps={{
                                    fontSize: "0.92rem",
                                    color: "#111b21",
                                }}
                            />
                        </ListItemButton>
                    ))}
            </List>
        </Box>
    );
}

export default UserList;
