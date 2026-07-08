import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";

function MapAutoCenter({ latitude, longitude }) {
    const map = useMap();

    // Prevent map from centering again after first time.
    const hasCentered = useRef(false);

    useEffect(() => {
        if (!latitude || !longitude) return;

        //center map only once
        if(hasCentered.current) return;

        // smoothly move map to new location
        map.flyTo(
            [latitude, longitude],
            16,
            {
                animate: true,
                duration: 1.5,
            }
        );
        hasCentered.current = true;
    }, [latitude, longitude, map])
    return null
}

export default MapAutoCenter