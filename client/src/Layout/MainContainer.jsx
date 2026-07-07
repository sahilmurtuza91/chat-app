import React, { useState } from "react";
import { Box, Drawer, useMediaQuery, useTheme } from "@mui/material";
import { Outlet } from "react-router";

import ProfilePage from "../pages/ProfilePage";
import SideBar from "./SideBar";

function MainContainer() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [openSideBar, setOpenSideBar] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  return (
    <Box
      sx={{
        display: "flex",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      {/* Desktop Sidebar */}
      {!isMobile && (
        <Box
          sx={{
            width: 300,
            flexShrink: 0,
            borderRight: "1px solid #e9edef",
          }}
        >
          {!showProfile ? (
            <SideBar
              setOpenSideBar={setOpenSideBar}
              onProfileClick={() => setShowProfile(true)}
            />
          ) : (
            <ProfilePage
              onClose={() => setShowProfile(false)}
            />
          )}
        </Box>
      )}

      {/* Mobile Sidebar */}
      {isMobile && (
        <Drawer
          variant="temporary"
          open={openSideBar}
          onClose={() => setOpenSideBar(false)}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            "& .MuiDrawer-paper": {
              width: 300,
              boxSizing: "border-box",
            },
          }}
        >
          {!showProfile ? (
            <SideBar
              setOpenSideBar={setOpenSideBar}
              onProfileClick={() => {
                setOpenSideBar(false);
                setShowProfile(true);
              }}
            />
          ) : (
            <ProfilePage
              onClose={() => {
                setShowProfile(false);
                setOpenSideBar(true);
              }}
            />
          )}
        </Drawer>
      )}

      {/* Chat Area */}
      <Box
        sx={{
          flexGrow: 1,
          minWidth: 0,
          height: "100vh",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            overflowY: "auto",
            width: "100%",
            backgroundColor: "#f1f5f9",
          }}
        >
          {isMobile && showProfile ? (
            <ProfilePage
              onClose={() => setShowProfile(false)}
            />
          ) : (
            <Outlet context={{ setOpenSideBar }} />
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default MainContainer;