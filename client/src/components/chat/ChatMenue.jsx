import { Menu, MenuItem } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useCleareConversationMutation } from "../../features/conversation/conversationApi"
import { cleareConversation } from "../../redux/conversationSlice"
import UserProfileDialog from "../profile/UserProfileDialog";

export default function ChatMenue({
    anchorEl,
    handleMenueClose,
    openProfile,
}) {
    const dispatch = useDispatch();
    const selectedConversation = useSelector((state) => state.conversation.selectedConversation);


    const [deleteConversation] = useCleareConversationMutation();

    const handleCleareChat = async () => {
        try {
            await deleteConversation(selectedConversation._id).unwrap();
            dispatch(cleareConversation());
            // console.log("Deleted Successfully");
            handleMenueClose();
        } catch (error) {
            console.log(error);
        }

    }

    return (
        <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)} // this will open the menue
            onClose={handleMenueClose}
            anchorOrigin={{ /// direction of the menue
                vertical: "bottom",
                horizontal: "right",
            }}
            transformOrigin={{
                vertical: "top",
                horizontal: "right"
            }}
        >
            <MenuItem
                onClick={() => {
                    handleMenueClose();
                    openProfile();
                }}
            >
                View Profile
            </MenuItem>

            <MenuItem onClick={handleMenueClose}>
                Search
            </MenuItem>

            <MenuItem onClick={handleMenueClose}>
                Mute Notifications
            </MenuItem>

            <MenuItem
                onClick={handleCleareChat}
                sx={{ color: "red" }}
            >
                Cleare Chat
            </MenuItem>
            
            
        </Menu>
    )
}