import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'


export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8000/api/user',
    credentials:"include"
   }),
   tagTypes: ["CurrentUser"],
  endpoints: (builder) => ({
    register: builder.mutation({
        query:(userData)=>({
            url:"/register",
            method: "POST",
            body:userData,
        }),
        invalidatesTags: ["CurrentUser"],  
    }),
    login: builder.mutation({
        query:(userData)=>({
            url:"/login",
            method:"POST",
            body:userData
        }),
        invalidatesTags: ["CurrentUser"], 
    }),
    getCurrentUser: builder.query({
        query:()=>({
            url:"/me",
            method:"GET",
        }),
        providesTags:["CurrentUser"],
    }),
    getAllUsers: builder.query({
        query:()=>({
            url:"/all-users",
            method:"GET",
        })
    }),
    logoutUser: builder.mutation({
        query:()=>({
            url:"/logout",
            method:"GET"
        }),
        invalidatesTags: ["CurrentUser"], 
    }),
    updateProfile: builder.mutation({
        query:(formData)=>({
            url:"/update-profile",
            method:"PUT",
            body:formData,
        }),
        invalidatesTags:["CurrentUser"],
    }),
  }),
})

export const { useRegisterMutation, useLoginMutation, useGetCurrentUserQuery, useGetAllUsersQuery, useLogoutUserMutation, useUpdateProfileMutation } = authApi