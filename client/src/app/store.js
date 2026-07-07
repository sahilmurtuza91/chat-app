import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from "@reduxjs/toolkit/query";

import { authApi } from '../features/auth/authApi'
import userReducer from "../redux/userSlice"
import conversationReducer
  from "../redux/conversationSlice";
import { conversationApi } from "../features/conversation/conversationApi";
import { messageApi } from "../features/message/messageApi";
import socketReducer from "../redux/socketSlice";


export const store = configureStore({
  reducer: {
    // RTK Query
    [authApi.reducerPath]: authApi.reducer,
    [conversationApi.reducerPath]: conversationApi.reducer,
    [messageApi.reducerPath]: messageApi.reducer,

    // User slice
    user: userReducer,
    conversation: conversationReducer,
    socket: socketReducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(conversationApi.middleware)
      .concat(messageApi.middleware)
})

setupListeners(store.dispatch)