import { Avatar, Box, Stack, Typography } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import UserAvatar from "../sidebar/UserAvatar";
import { setSelectedMapUser } from "../../redux/socketSlice";

function OnlineUsersList({ users, setOpenSideBar }) {
    const dispatch = useDispatch();
    // Logged in user id
    const currentUserId = useSelector((state) => state.user._id);

    // to know the currently selected user
    const selectedMapUser = useSelector((state) => state.socket.selectedMapUser);

    return (
        <>

            {/* Sidebar Title */}
            <Typography
                variant="h6"
                sx={{
                    p: 2,
                    fontWeight: 600,
                    borderBottom: "1px solid #eee",
                }}
            >
                Online Users ({users.length})
            </Typography>

            {
                users.map((user) => (

                    <Stack
                        key={user.userId}
                        direction="row"
                        spacing={2}
                        alignItems="center"
                        onClick={() => {

                            // Save selected user for map focus
                            dispatch(
                                setSelectedMapUser(user)
                            );

                            // Close sidebar on mobile
                            if (setOpenSideBar) {
                                setOpenSideBar(false);
                            }

                        }}
                        sx={{
                            px: 2,
                            py: 1.5,
                            cursor: "pointer",

                            // Highlight selected user
                            backgroundColor:
                                selectedMapUser?.userId === user.userId
                                    ? "#e7f3ff"
                                    : "transparent",

                            "&:hover": {
                                backgroundColor:
                                    selectedMapUser?.userId === user.userId
                                        ? "#e7f3ff"
                                        : "#f5f6f6",
                            },
                        }}
                    >

                        {/* User Avatar */}
                        <UserAvatar
                            name={user.name}
                            profile_pic={user.profile_pic}
                        />

                        {/* User Details */}
                        <Box
                            sx={{
                                flex: 1,
                                minWidth: 0,
                            }}
                        >
                            <Typography
                                noWrap
                                sx={{
                                    fontWeight:
                                        selectedMapUser?.userId === user.userId
                                            ? 700
                                            : 500, color: "#111b21",
                                }}
                            >
                                {user.name}

                                {
                                    user.userId === currentUserId &&
                                    " (You)"
                                }
                            </Typography>

                            <Typography
                                variant="caption"
                                sx={{
                                    color: "#00a884",
                                    fontWeight: 500,
                                }}
                            >
                                ● Online
                            </Typography>

                        </Box>

                    </Stack>

                ))
            }

        </>
    );
}

export default OnlineUsersList