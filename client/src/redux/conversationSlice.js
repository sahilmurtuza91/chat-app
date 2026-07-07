import { createSlice } from '@reduxjs/toolkit'

const initialState = {
 selectedUser:null,
 selectedConversation:null
}

export const conversationSlice = createSlice({
  name: "conversation",
  initialState,
  reducers: {
    setSelectedConversation(state, action){
        state.selectedUser = action.payload.user;
        state.selectedConversation = action.payload.conversation;
    },

    cleareConversation(state){
        state.selectedUser = null;
        state.selectedConversation = null;
    }
  },
})


export const { setSelectedConversation, cleareConversation } = conversationSlice.actions

export default conversationSlice.reducer