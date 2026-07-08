
function calculateDistance(lat1, lon1, lat2, lon2) {
    const EARTH_RADIUS = 6371;

    // convert degree into radians
    const  toRadians = (degree)=> degree*(Math.PI/180);

    const latitudeDifference = toRadians(lat2-lat1);
    const longitudeDifference = toRadians(lon2 - lon1);

    const a =
        Math.sin(latitudeDifference / 2) *
        Math.sin(latitudeDifference / 2) +
        Math.cos(toRadians(lat1)) *
        Math.cos(toRadians(lat2)) *
        Math.sin(longitudeDifference / 2) *
        Math.sin(longitudeDifference / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return EARTH_RADIUS * c;
}

export default calculateDistance