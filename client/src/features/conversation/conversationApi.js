import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'


export const conversationApi = createApi({
    reducerPath: 'conversationApi',
    baseQuery: fetchBaseQuery({
        // baseUrl: "http://localhost:8000/api/conversation",
        baseUrl: `${import.meta.env.VITE_API_URL}/api/conversation`,
        credentials: "include",
    }),
    endpoints: (builder) => ({
        createConversation: builder.mutation({
            query: (receiverId) => ({
                url: "/",
                method: "POST",
                body: {
                     receiverId,
                },
            })
        }),
        cleareConversation: builder.mutation({
            query:(conversationId) =>({
                url:`/${conversationId}`,
                method:"DELETE",
            }),
        }),
    }),
})

export const {
    useCreateConversationMutation, useCleareConversationMutation,
} = conversationApi;