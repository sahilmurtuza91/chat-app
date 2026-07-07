import { Box, Container } from "@mui/material";
import { Outlet } from "react-router-dom";

function AuthContainer() {
  return (
    <Box
  sx={{
    minHeight: "100vh",
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",

    "&::before": {
      content: '""',
      position: "absolute",
      inset: 0,
      backgroundImage: "url('/static/background.png')",
    //   backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundAttachment: "fixed",
      zIndex: -1,
    },
    "&::after": {
      content: '""',
      position: "absolute",
      inset: 0,
      backgroundColor: "rgba(255,255,255,0.9)", 
      zIndex: -1,
    },
  }}
>
      <Container
        // maxWidth="xs"
        maxWidth="md"
        sx={{
          backgroundColor: "transparent",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            mb: 2,
            position: "relative",
            zIndex: "2",
          }}
        >
          <figure
            style={{
              textAlign: "center",
              width: "250px",
              height: "350px",
              marginBottom: "-100px",
              marginTop: "-60px",
            }}
          >
            <img
              src="https://www.svgrepo.com/show/381077/message-basic-app-conversation-chat.svg"
              alt="logo"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
              }}
            />
            {/* <h1>Chat App</h1> */}
          </figure>

          <Outlet />
        </Box>
      </Container>
    </Box>
  );
}

export default AuthContainer;
