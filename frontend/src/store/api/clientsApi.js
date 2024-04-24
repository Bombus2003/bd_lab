import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL = "http://localhost:3000";

export const clientsApi = createApi({
  reducerPath: "clientsApi",

  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/api`,
  }),

  endpoints: (builder) => ({
    createClient: builder.mutation({
      query(data) {
        return {
          url: "clients",
          method: "POST",
          body: data,
        };
      },
    }),

    getAllClients: builder.query({
      query: () => "clients",
    }),

    updateClient: builder.mutation({
      query: ({ client_code, data }) => ({
        url: `clients/${client_code}`,
        method: "PATCH",
        body: { client_code, ...data },
      }),
    }),

    deleteClient: builder.mutation({
      query: (id) => ({
        url: `clients/${id}`,
        method: "DELETE",
      }),
    }),

    getFirstTenClients: builder.query({
      query: () => ({
        url: "clients/findFirst10Clients",
      }),
    }),

    getLastFifteenClients: builder.query({
      query: () => ({
        url: "clients/findLast15Clients",
      }),
    }),

    getAveragePayoutToClient: builder.query({
      query: () => ({
        url: "clients/averagePayout",
      }),
    }),

    getMaxPayoutToClient: builder.query({
      query: () => ({
        url: "clients/maxPayout",
      }),
    }),

    getMinPayoutToClient: builder.query({
      query: () => ({
        url: "clients/minPayout",
      }),
    }),

    getClientsWithPayoutBetween: builder.mutation({
      query: (data) => ({
        url: "clients/clientsWithPayoutBetween",
        method: "POST",
        body: data,
      }),
    }),

    getCountContractsPerClient: builder.query({
      query: () => ({
        url: "clients/countContractsPerClient",
      }),
    }),

    getFindClientsWithNamesStartingAOrB: builder.query({
      query: () => ({
        url: "clients/findClientsWithNamesStartingAOrB",
      }),
    }),

    getFindUniqueClientAddress: builder.query({
      query: () => ({
        url: "clients/findUniqueClientAddress",
      }),
    }),

    getClientById: builder.query({
      query: (id) => ({
        url: `clients/${id}`,
      }),
    }),

    findClientsByNamePattern: builder.mutation({
      query: (data) => ({
        url: "clients/findClientsByNamePattern",
        method: "POST",
        body: data,
      }),
    }),

    getFindClientsWithAddressAndNoPhoneNumber: builder.query({
      query: () => ({
        url: "clients/findClientsWithAddressAndNoPhoneNumber",
      }),
    }),

    getFindClientsWithAddressOrPhoneNumber: builder.query({
      query: () => ({
        url: "clients/findClientsWithAddressOrPhoneNumber",
      }),
    }),

    getFindClientsWithoutAddressOrPhoneNumber: builder.query({
      query: () => ({
        url: "clients/findClientsWithoutAddressOrPhoneNumber",
      }),
    }),

    getClientsWithDefiniteAddress: builder.mutation({
      query: (data) => ({
        url: "clients/exists",
        method: "POST",
        body: data,
      }),
    }),

    getFindClientsWithPhoneNumber: builder.query({
      query: () => ({
        url: "clients/findClientsWithPhoneNumber",
      }),
    }),

    getFindClientsCelebratingEveryFiveYearsAnniversaryNextMonth:
      builder.query({
        query: () => ({
          url: "clients/findClientsCelebratingEveryFiveYearsAnniversaryNextMonth",
        }),
      }),
  }),
});

export const {
  useCreateClientMutation,
  useUpdateClientMutation,
  useDeleteClientMutation,
  useGetAllClientsQuery,
  useGetFirstTenClientsQuery,
  useGetLastFifteenClientsQuery,
  useGetAveragePayoutToClientQuery,
  useGetMaxPayoutToClientQuery,
  useGetMinPayoutToClientQuery,
  useGetClientsWithPayoutBetweenMutation,
  useGetCountContractsPerClientQuery,
  useGetFindClientsWithNamesStartingAOrBQuery,
  useGetFindUniqueClientAddressQuery,
  useGetClientByIdQuery,
  useFindClientsByNamePatternMutation,
  useGetFindClientsWithAddressAndNoPhoneNumberQuery,
  useGetFindClientsWithAddressOrPhoneNumberQuery,
  useGetFindClientsWithoutAddressOrPhoneNumberQuery,
  useGetClientsWithDefiniteAddressMutation,
  useGetFindClientsWithPhoneNumberQuery,
  useGetFindClientsCelebratingEveryFiveYearsAnniversaryNextMonthQuery,
} = clientsApi;
