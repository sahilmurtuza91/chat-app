import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    onlineUsers: [],
    lastSeen: {},
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
        },
    },
});

export const { sentOnlineUsers, setLastSeen, resetSocketState } = socketSlice.actions;
export default socketSlice.reducer;