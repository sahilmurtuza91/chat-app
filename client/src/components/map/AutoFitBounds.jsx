import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";

function AutoFitBounds({users}) {
    const map = useMap(); // current leaflet map instance

    useEffect(()=>{

        // if no user
        if(users.length === 0) return;

        if(users.length === 1){
            map.setView(
                [
                    users[0].latitude,
                    users[0].longitude,
                ],
                16 // zoom level
            );
            return;
        }

        // create bound for the multiple users
        const bounds = L.latLngBounds(
            users.map((user)=>[
                user.latitude,
                user.longitude,
            ])
        );

        // fit all users in screen
        map.fitBounds(bounds, {
            padding:[80, 80],
        });
    },[users, map])
    return null;
}

export default AutoFitBounds