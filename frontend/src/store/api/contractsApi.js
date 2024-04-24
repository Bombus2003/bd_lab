import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL = "http://localhost:3000";

export const contractsApi = createApi({
  reducerPath: "contractsApi",

  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/api`,
  }),

  endpoints: (builder) => ({
    createContract: builder.mutation({
      query(data) {
        return {
          url: "contracts",
          method: "POST",
          body: data,
        };
      },
    }),
    getMoreDateContracts: builder.query({
      query: ({ payoutToClientMore }) =>
        `contracts/max?payoutAmount=${payoutToClientMore}`,
    }),

    getLessDateContracts: builder.query({
      query: ({ payoutToClientLess }) =>
        `contracts/min?payoutAmount=${payoutToClientLess}`,
    }),

    getAllContracts: builder.query({
      query: ({ startDate, endDate }) =>
        `contracts?startDate=${startDate}&endDate=${endDate}`,
    }),

    updateContract: builder.mutation({
      query: ({ contract_code, data }) => ({
        url: `contracts/${contract_code}`,
        method: "PATCH",
        body: { contract_code, ...data },
      }),
    }),

    deleteContract: builder.mutation({
      query: (id) => ({
        url: `contracts/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useCreateContractMutation,
  useUpdateContractMutation,
  useDeleteContractMutation,
  useGetMoreDateContractsQuery,
  useGetLessDateContractsQuery,
  useGetAllContractsQuery,
} = contractsApi;
