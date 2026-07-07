import { ListItemButton, ListItemText, Divider } from "@mui/material";
import UserAvatar from "./UserAvatar";

function UserListItem({
    chatUser,
    selectedConversation,
    onClick
}) {
    return (
        <>
            <ListItemButton
                selected={selectedConversation?._id === chatUser._id}
                onClick={onClick}
                sx={{
                    py: 1.5,
                    px: 2,
                    display: "flex",
                    gap: 2,

                    backgroundColor: selectedConversation?._id === chatUser._id ? "#e9edef" : "transparent",
                    "&:hover": {
                        backgroundColor: "#f5f6f6",
                    },
                }}
            >
                <UserAvatar
                    name={chatUser.name}
                    profile_pic={chatUser.profile_pic}
                />
                <ListItemText
                    primary={chatUser.name}
                    secondary={chatUser.name}
                    slotProps={{
                        primary: {
                            fontSize: "0.95rem",
                            fontWeight: 500,
                            color: "#111b21",
                        },
                        secondary: {
                            fontSize: "0.8rem",
                            color: "#667781",
                            noWrap: true,
                        },
                    }}
                />
            </ListItemButton>

            <Divider 
                variant="inset"
                component="li"
                sx={{ borderColor: "#f0f2f5" }}
            />
        </>
    )
}

export default UserListItem