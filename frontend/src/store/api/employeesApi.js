import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL = "http://localhost:3000";

export const employeesApi = createApi({
  reducerPath: "employeesApi",

  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/api`,
  }),

  endpoints: (builder) => ({
    createEmployee: builder.mutation({
      query(data) {
        return {
          url: "employees",
          method: "POST",
          body: data,
        };
      },
    }),

    getAllEmployees: builder.query({
      query: () => "employees",
    }),

    updateEmployee: builder.mutation({
      query: ({ employee_code, data }) => ({
        url: `employees/${employee_code}`,
        method: "PATCH",
        body: { employee_code, ...data },
      }),
    }),

    deleteEmployee: builder.mutation({
      query: (id) => ({
        url: `employees/${id}`,
        method: "DELETE",
      }),
    }),

  }),
});

export const {
  useCreateEmployeeMutation,
  useUpdateEmployeeMutation,
  useDeleteEmployeeMutation,
  useGetAllEmployeesQuery,
} = employeesApi;
