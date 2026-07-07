import { Box, Divider, Typography } from "@mui/material";

function sidebarHeader({ user }) {
    return (
        <>
            <Box

                sx={{
                    height: 65,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    px: 2,
                    backgroundColor: "#f0f2f5",
                }}>
                <Typography
                    variant="subtitle2"
                    sx={{
                        fontWeight: "bold",
                        color: "#008069",
                        fontSize: "1.05rem",
                        lineHeight: 1.2
                    }}
                >
                    Chat App
                </Typography>
                <Typography
                    variant="caption"
                    sx={{
                        color: "#667781",
                        fontSize: "0.8rem",
                    }}
                >
                    Welcome,{" "}
                    <span
                        style={{
                            fontWeight: 600,
                            color: "#111b21",
                        }}
                    >
                        {user?.name || "User"}
                    </span>
                </Typography>
            </Box>
            <Divider sx={{ borderColor: "#e9edef" }} />
        </>
    )
}

export default sidebarHeader