import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    onlineUsers: [],
    lastSeen: {},
    liveLocations: {},
    selectedMapUser: null,
}

const socketSlice = createSlice({
    name: "socket",
    initialState,
    reducers: {
        sentOnlineUsers(state, action) {
            state.onlineUsers = action.payload;
        },
        setLastSeen(state, action) {
            const { userId, lastSeen } = action.payload;
            state.lastSeen[userId] = lastSeen;
        },
        resetSocketState: (state) => {
            state.onlineUsers = [];
            state.lastSeen = {};
            state.liveLocations = {}; // remove all live location
        },
        setLiveLocation(state, action) {

            const {
                userId,
                name,
                profile_pic,
                latitude,
                longitude,
            } = action.payload;

            state.liveLocations[userId] = {
                userId,
                name,
                profile_pic,
                latitude,
                longitude,
            };
        },
        setAllLiveLocations(state, action) {
            state.liveLocations = action.payload;

        },
        setSelectedMapUser(state, action) {
            state.selectedMapUser = action.payload;
        },
    },
});

export const { sentOnlineUsers, setLastSeen, resetSocketState,setLiveLocation, setAllLiveLocations, setSelectedMapUser } = socketSlice.actions;
export default socketSlice.reducer;