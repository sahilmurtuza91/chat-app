import { Box, Stack, IconButton } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import UserAvatar from "./UserAvatar";

function SidebarNavigation({
    sideBarItems,
    activeTab,
    setActiveTab,
    navigate,
    user,
    logout,
    dispatch,
    logoutUser,
}) {
    return (
        <Box
            sx={{
                width: 60,
                backgroundColor: "#eae6df",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                alignItems: "center",
                py: 2,
                borderRight: "1px solid #d1d7db",
            }}
        >
            {/* Top Icons */}
            <Stack spacing={2} sx={{ width: "100%", alignItems: "center" }}>
                {sideBarItems.map((item) => {
                    const Icon = item.icon;

                    return (
                        <IconButton
                            key={item.id}
                            onClick={() => {
                                setActiveTab(item.id);

                                if (item.route) {
                                    navigate(item.route);
                                }
                            }}
                            sx={{
                                color:
                                    activeTab === item.id
                                        ? "#00a884"
                                        : "#54656f",

                                backgroundColor:
                                    activeTab === item.id
                                        ? "#d9dbde"
                                        : "transparent",

                                borderRadius: "8px",

                                "&:hover": {
                                    backgroundColor: "#d9dbde",
                                },
                            }}
                        >
                            <Icon size={22} />
                        </IconButton>
                    );
                })}
            </Stack>

            {/* Bottom */}
            <Stack spacing={1} alignItems="center">

                <UserAvatar
                    name={user.name}
                    profile_pic={user.profile_pic}
                    size={42}
                    onClick={() => navigate("/profile")}
                />

                <IconButton
                    onClick={async () => {
                        try {
                            await logout().unwrap();

                            dispatch(logoutUser());

                            navigate("/login");
                        } catch (error) {
                            console.log(error);
                        }
                    }}
                    sx={{
                        color: "#ea0038",

                        "&:hover": {
                            backgroundColor: "#ffebe6",
                        },

                        borderRadius: "8px",
                    }}
                >
                    <LogoutIcon />
                </IconButton>

            </Stack>
        </Box>
    );
}

export default SidebarNavigation