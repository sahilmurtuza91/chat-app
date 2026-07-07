import { useState } from "react";
import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import socket from "../socket/socket";

import {
  useGetAllUsersQuery,
  useLogoutUserMutation,
} from "../features/auth/authApi";
import { logoutUser } from "../redux/userSlice";

import SidebarNavigation from "../components/sidebar/SidebarNavigation";
import SidebarHeader from "../components/sidebar/SidebarHeader";
import UserList from "../components/sidebar/UserList";

import sideBarItems from "../constants/sidebarItems";

export default function SimpleSidebar({
  setOpenSideBar,
  onProfileClick,
}) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState("chats");

  const user = useSelector((state) => state.user);

  const currentTab = sideBarItems.find(
    (item) => item.id === activeTab
  );

  const { data } = useGetAllUsersQuery();

  const [logout] = useLogoutUserMutation();
  const handleLogout = async () => {
    try {
      if (socket.connected) {
        socket.disconnect();
      }
      await logoutTrigger().unwrap();

      dispatch(logoutUser());
      dispatch(cleareConversation());

      navigate("/login");
    } catch (err) {
      console.error(err);
    } finally {
      dispatch(logoutUser());
      navigate("/login");
    }
  };
  return (
    <Box
      sx={{
        width: 300,
        height: "100%",
        display: "flex",
        borderRight: "1px solid #e9edef",
      }}
    >
      <SidebarNavigation
        sideBarItems={sideBarItems}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        navigate={navigate}
        user={user}
        logout={handleLogout}
        dispatch={dispatch}
        logoutUser={logoutUser}
        onProfileClick={onProfileClick}
      />

      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#f0f2f5",
          overflow: "hidden",
        }}
      >
        <SidebarHeader user={user} />

        <UserList
          activeTab={activeTab}
          data={data}
          currentTab={currentTab}
          setOpenSideBar={setOpenSideBar}
        />
      </Box>
    </Box>
  );
}