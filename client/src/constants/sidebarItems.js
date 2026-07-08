import SettingsIcon from "@mui/icons-material/Settings";
import { MdOutlineWifiCalling3 } from "react-icons/md";
import { IoIosChatbubbles } from "react-icons/io";
import { IoLocationSharp } from "react-icons/io5";

const sideBarItems = [
    {
        id: "chats",
        icon: IoIosChatbubbles,
        route: "/dashboard",
        menus: [
            {
                title: "Recent Chats",
                route: "/dashboard",
            },
        ],
    },
    {
        id: "calls",
        icon: MdOutlineWifiCalling3,
        menus: [],
    },
    {
        id: "location",
        icon: IoLocationSharp,
        route: "/location",
        menus: [],
    },
    {
        id: "settings",
        icon: SettingsIcon,
        menus: [
            {
                title: "Profile Settings",
                route: "/settings/profile",
            },
            {
                title: "Privacy Options",
                route: "/settings/privacy",
            },
        ],
    },
];


export default sideBarItems;