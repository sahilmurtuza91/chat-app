import { Box } from "@mui/material";
import { MapContainer, TileLayer, Marker, Popup, Tooltip } from "react-leaflet"
import { useSelector } from "react-redux";
import UserLocationMarker from "../components/location/UserLocationMarker";
import AutoFitBounds from "../components/map/AutoFitBounds";
import MapAutoCenter from "../components/location/MapAutoCenter";

function LiveLocationPage() {

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
            }}
        >
            {/* Right Map */}
            <Box
                sx={{
                    flex: 1,
                }}
            >
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