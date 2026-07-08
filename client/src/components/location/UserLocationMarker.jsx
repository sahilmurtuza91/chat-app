import React, { useEffect, useRef } from "react";
import L from "leaflet";
import { Marker, Tooltip, Popup } from "react-leaflet";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedMapUser } from "../../redux/socketSlice";
import calculateDistance from "../../utils/calculateDistance";

// create custome marker
function UserLocationMarker({ user }) {
    const dispatch = useDispatch();
    // get selecetd user form redux
    const selectedMapUser = useSelector((state) => state.socket.selectedMapUser);

    // get all live location from REdus
    const liveLocations = useSelector((state) => state.socket.liveLocations);

    const currentUserId = useSelector((state) => state.user._id);

    // find current userLOcation
    const currentUserLocation =
        Object.values(liveLocations ?? {}).find(
            (liveUser) => liveUser.userId === currentUserId
        );

    // making refrence of the marker
    const markerRef = useRef(null);

    const isSelected = selectedMapUser?.userId === user.userId;

    // calculate distance between current user and this marker
    // Calculate distance between current user and this marker
    const distance =
        currentUserLocation &&
            currentUserLocation.userId !== user.userId
            ? calculateDistance(
                currentUserLocation.latitude,
                currentUserLocation.longitude,
                user.latitude,
                user.longitude
            ).toFixed(2)
            : null;

    useEffect(() => {
        if (!isSelected) return;

        markerRef.current?.openPopup();
    }, [isSelected]);

    const profileIcon = L.divIcon({
        className: "leaflet-custom-icon-wrapper", // Leaflet default borders hatane ke liye
        html: `
            <div class="custom-marker-container">
                <div class="marker-profile-pic">
                    <img src="${user.profile_pic}" alt="${user.name}" />
                </div>
                <div class="marker-pin-tail"></div>
            </div>
        `,
        iconSize: [55, 65],
        iconAnchor: [27, 57],
        popupAnchor: [0, -60],
    });

    return (
        <Marker
            ref={markerRef}
            position={[user.latitude, user.longitude]}
            icon={profileIcon}
            eventHandlers={{
                click: () => {
                    dispatch(setSelectedMapUser(user));
                },
            }}
        >
            <Tooltip
                permanent
                direction="top"
                offset={[0, -50]}
                className="custom-marker-tooltip"
            >
                {user.name}
            </Tooltip>
            <Popup>
                <div
                    style={{
                        textAlign: "center",
                        minWidth: 170,
                    }}
                >
                    <img
                        src={user.profile_pic}
                        alt={user.name}
                        style={{
                            width: 70,
                            height: 70,
                            borderRadius: "50%",
                            objectFit: "cover",
                            marginBottom: "10px",
                        }}
                    />

                    <h3
                        style={{
                            margin: 0,
                        }}
                    >
                        {user.name}
                    </h3>

                    <p
                        style={{
                            marginTop: 8,
                            color: "#00a884",
                            fontWeight: 500,
                        }}
                    >
                        Live Location
                    </p>
                    {
                        distance && (
                            <p
                                style={{
                                    marginTop: 8,
                                    fontSize: 14,
                                    color: "#555",
                                }}
                            >
                                📏 {distance} km away
                            </p>
                        )
                    }
                </div>
            </Popup>
        </Marker>
    );
}

export default UserLocationMarker;
