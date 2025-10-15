// store/api.ts

import { createApi } from "@reduxjs/toolkit/query/react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import asyncStorageBaseQuery from "./asyncStorageBaseQuery";
import { User, LoanApplication, LoanDetails, UserDetails } from "../types";

const normalizePhone = (phone: string): string => {
  return phone.replace(/\D/g, '');
};

export const appApi = createApi({
  reducerPath: "appApi",
  baseQuery: asyncStorageBaseQuery(),
  tagTypes: ["User", "LoanApplication", "LoanDetails"],
  endpoints: (builder) => ({
    registerUser: builder.mutation<User, Omit<User, "id" | "createdAt">>({
      query: (userData) => {
        const cleanUserData = {
          ...userData,
          phone: normalizePhone(userData.phone),
        };
        return {
          url: "users",
          method: "POST",
          body: cleanUserData,
        };
      },
      invalidatesTags: ["User"],
    }),
    getAllUsers: builder.query<User[], void>({
      query: () => ({
        url: "users",
        method: "GET",
      }),
      providesTags: ["User"],
    }),
    loginUser: builder.query<User | null, { phone: string }>({
      query: ({ phone }) => ({
        url: "users",
        method: "GET",
      }),
      transformResponse: (response: User[] | null, _meta, { phone }) => {
        const cleanPhone = normalizePhone(phone);
        if (!Array.isArray(response)) {
          return null;
        }
        return response.find(user => normalizePhone(user.phone) === cleanPhone) || null;
      },
      providesTags: ["User"],
    }),
    getUserById: builder.query<UserDetails | null, string>({
      query: (id) => ({
        url: "users",
        method: "GET",
        params: { id },
      }),
      providesTags: ["User"],
    }),
    updateUser: builder.mutation<User, { id: string; userData: Partial<User> }>({
      query: ({ id, userData }) => {
        const cleanUserData = userData.phone
          ? { ...userData, phone: normalizePhone(userData.phone) }
          : userData;
        return {
          url: "users",
          method: "PUT",
          body: cleanUserData,
          params: { id },
        };
      },
      invalidatesTags: ["User"],
    }),
    createLoanApplication: builder.mutation<
      LoanApplication,
      Omit<LoanApplication, "id" | "createdAt" | "updatedAt" | "brojAplikacije">
    >({
      query: (applicationData) => {
        const brojAplikacije = `LA${Date.now()}${Math.floor(
          Math.random() * 1000
        )
          .toString()
          .padStart(3, "0")}`;
        return {
          url: "loanApplications",
          method: "POST",
          body: {
            ...applicationData,
            brojAplikacije,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        };
      },
      invalidatesTags: ["LoanApplication"],
    }),
    getUserLoanApplications: builder.query<LoanApplication[], string>({
      query: (userId) => ({
        url: "loanApplications",
        method: "GET",
        params: { userId },
      }),
      providesTags: ["LoanApplication"],
    }),
    getLoanApplicationById: builder.query<LoanApplication | null, string>({
      query: (id) => ({
        url: "loanApplications",
        method: "GET",
        params: { id },
      }),
      providesTags: ["LoanApplication"],
    }),
    updateLoanApplicationStatus: builder.mutation<
      LoanApplication,
      { id: string; status: LoanApplication["status"] }
    >({
      query: ({ id, status }) => ({
        url: "loanApplications",
        method: "PUT",
        body: { status },
        params: { id },
      }),
      invalidatesTags: ["LoanApplication", "LoanDetails"],
    }),
    createLoanDetails: builder.mutation<
      LoanDetails,
      Omit<LoanDetails, "id" | "creationDate">
    >({
      query: (loanData) => ({
        url: "loanDetails",
        method: "POST",
        body: {
          ...loanData,
          creationDate: new Date().toISOString(),
        },
      }),
      invalidatesTags: ["LoanDetails"],
    }),
    getUserLoanDetails: builder.query<LoanDetails[], string>({
      query: (userId) => ({
        url: "loanDetails",
        method: "GET",
        params: { userId },
      }),
      providesTags: ["LoanDetails"],
    }),
    getLoanDetailsById: builder.query<LoanDetails | null, string>({
      query: (id) => ({
        url: "loanDetails",
        method: "GET",
        params: { id },
      }),
      providesTags: ["LoanDetails"],
    }),
    clearAllData: builder.mutation<{ success: boolean }, void>({
      queryFn: async () => {
        try {
          await AsyncStorage.multiRemove([
            "users",
            "loanApplications",
            "loanDetails",
          ]);
          return { data: { success: true } };
        } catch (error: any) {
          return {
            error: {
              status: "CUSTOM_ERROR",
              data: error.message || "Failed to clear data",
            },
          };
        }
      },
      invalidatesTags: ["User", "LoanApplication", "LoanDetails"],
    }),
  }),
});

export const {
  useRegisterUserMutation,
  useLazyLoginUserQuery,
  useGetUserByIdQuery,
  useUpdateUserMutation,
  useCreateLoanApplicationMutation,
  useGetUserLoanApplicationsQuery,
  useGetLoanApplicationByIdQuery,
  useUpdateLoanApplicationStatusMutation,
  useCreateLoanDetailsMutation,
  useGetUserLoanDetailsQuery,
  useGetLoanDetailsByIdQuery,
  useClearAllDataMutation,
  useLazyGetAllUsersQuery,
  useGetAllUsersQuery
} = appApi;