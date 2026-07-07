import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const messageApi = createApi({
    reducerPath: "messageApi",

    baseQuery: fetchBaseQuery({
        // baseUrl: "http://localhost:8000/api/message",
        baseUrl: `${import.meta.env.VITE_API_URL}/api/message`,
        credentials: "include",
    }),

    // Declare which cache tags this API will use.
    tagTypes: ["Message"],
    endpoints: (builder) => ({
        getMessage: builder.query({
            query: (conversationId) => `/${conversationId}`,

            // providesTags
            // Save the GET response in cache with this tag.
            providesTags: (result, error, conversationId) => [
                { type: "Message", id: conversationId }
            ]
        }),

        // send Message
        sendMessage: builder.mutation({
            query: (data) => ({
                url: "/",
                method: "POST",
                body: data,
            }),

            // invalidatesTags
            // Remove this cache after POST/PUT/DELETE so RTK Query fetches fresh data automatically.
            invalidatesTags: (result, error, data) => [
                { type: "Message", id: data.conversationId }
            ]
        }),

        markeMessageSeen: builder.mutation({
            query: (conversationId)=>({
                url:`/seen/${conversationId}`,
                method:"PATCH",
            }),
        }),
    })
});

export const { useGetMessageQuery, useSendMessageMutation, useMarkeMessageSeenMutation } = messageApi;