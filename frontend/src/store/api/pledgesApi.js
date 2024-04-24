import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL = "http://localhost:3000";

export const pledgesApi = createApi({
  reducerPath: "pledgesApi",

  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/api`,
  }),

  endpoints: (builder) => ({
    createPledge: builder.mutation({
      query(data) {
        return {
          url: "credit",
          method: "POST",
          body: data,
        };
      },
    }),

    getAllPledges: builder.query({
      query: () => "credit",
    }),

    updatePledge: builder.mutation({
      query: ({ credit_code, data }) => ({
        url: `credit/${credit_code}`,
        method: "PATCH",
        body: { credit_code, ...data },
      }),
    }),

    deletePledge: builder.mutation({
      query: (id) => ({
        url: `credit/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useCreatePledgeMutation,
  useUpdatePledgeMutation,
  useDeletePledgeMutation,
  useGetAllPledgesQuery,
} = pledgesApi;
