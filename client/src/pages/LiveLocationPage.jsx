import { Box, IconButton, useMediaQuery, useTheme } from "@mui/material";
import { useOutletContext } from "react-router";
import MenuIcon from "@mui/icons-material/Menu";
import { MapContainer, TileLayer, Marker, Popup, Tooltip } from "react-leaflet"
import { useSelector } from "react-redux";
import UserLocationMarker from "../components/location/UserLocationMarker";
import AutoFitBounds from "../components/map/AutoFitBounds";
import MapAutoCenter from "../components/location/MapAutoCenter";

function LiveLocationPage() {

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const { setOpenSideBar } = useOutletContext();

    // all user live location from the redux
    const liveLocation = useSelector((state) => state.socket.liveLocations);
    console.log(liveLocation);

    // convert object into array
    const users = Object.values(liveLocation);

    // logged in user id
    const currentUserId = useSelector((state) => state.user._id);

    // find current user live location
    const currentUserLocation = users.find((user) => user.userId === currentUserId);

    // selected user form side bar
    const selectedMapUser = useSelector(
        (state) => state.socket.selectedMapUser
    );

    // return (
    //     <Box
    //         sx={{
    //             width: "100%",
    //             height: "100%"
    //         }}
    //     >
    //         <MapContainer
    //             // center={[20.5937, 78.9629]} // India center
    //             center={[30.7126, 76.7089]} // for testing
    //             zoom={16}
    //             style={{
    //                 width: "100%",
    //                 height: "100%"
    //             }}
    //         >
    //             <TileLayer
    //                 attribution="Sahil Murtuza | chat app"
    //                 url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    //             />

    //             {/* 
    //                 If only one user is online,
    //                 center map on current user.
    //             */}
    //             {
    //                 users.length === 1 &&
    //                 currentUserLocation && (
    //                     <MapAutoCenter
    //                         latitude={currentUserLocation.latitude}
    //                         longitude={currentUserLocation.longitude}
    //                     />
    //                 )
    //             }

    //             {/* If multiple users are online,
    //                 automatically fit all markers inside the map.
    //             */}
    //             {
    //                 users.length > 1 && (
    //                     <AutoFitBounds users={users} />
    //                 )
    //             }
    //             {
    //                 users
    //                     .filter(user => user.latitude && user.longitude)
    //                     .map((user) => (
    //                         <UserLocationMarker
    //                             key={user.userId}
    //                             user={user}
    //                         />
    //                     ))
    //             }
    //         </MapContainer>
    //     </Box>
    // )

    return (
        <Box
            sx={{
                width: "100%",
                height: "100%",
                display: "flex",
                position: "relative",
            }}
        >
            {/* Right Map */}
            <Box
                sx={{
                    flex: 1,
                }}
            >
                {isMobile && (
                    <IconButton
                        onClick={() => setOpenSideBar(true)}
                        sx={{
                            position: "absolute",
                            top: 16,
                            right: 16,
                            zIndex: 1000,
                            backgroundColor: "#fff",
                            boxShadow: 2,
                            "&:hover": {
                                backgroundColor: "#f5f5f5",
                            },
                        }}
                    >
                        <MenuIcon />
                    </IconButton>
                )}
                <MapContainer
                    center={[30.7126, 76.7089]}
                    zoom={16}
                    style={{
                        width: "100%",
                        height: "100%",
                    }}
                >
                    <TileLayer
                        attribution="Sahil Murtuza | Chat App"
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    {/* Center map on current user */}
                    {
                        !selectedMapUser &&
                        users.length === 1 &&
                        currentUserLocation && (
                            <MapAutoCenter
                                latitude={currentUserLocation.latitude}
                                longitude={currentUserLocation.longitude}
                            />
                        )
                    }

                    {/* move map to selecetd user */}
                    {
                        selectedMapUser && (
                            <MapAutoCenter
                                latitude={selectedMapUser.latitude}
                                longitude={selectedMapUser.longitude}
                            />
                        )
                    }

                    {/* Fit all users inside map */}
                    {
                        users.length > 1 && (
                            <AutoFitBounds users={users} />
                        )
                    }

                    {/* Render every user marker */}
                    {
                        users
                            .filter(user => user.latitude && user.longitude)
                            .map((user) => (
                                <UserLocationMarker
                                    key={user.userId}
                                    user={user}
                                />
                            ))
                    }

                </MapContainer>

            </Box>

        </Box>
    );
}

export default LiveLocationPage