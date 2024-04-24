import { DatePicker, Input, Select } from "antd";
import { CreateForm } from "../../../styles/createFormsStyles";
import locale from "antd/es/date-picker/locale/ru_RU";
import { useGetAllClientsQuery } from "../../../store/api/clientsApi";
import { useGetAllPledgesQuery } from "../../../store/api/pledgesApi";
import { useGetAllEmployeesQuery } from "../../../store/api/employeesApi";

export const FormInputs = () => {
  const { data: clientsData } = useGetAllClientsQuery();
  const { data: pledgesData } = useGetAllPledgesQuery();
  const { data: employeesData } = useGetAllEmployeesQuery();

  const contract_typeOptions = [
    {
      label: "Залог",
      value: "Залог",
    },
    {
      label: "Продажа",
      value: "Продажа",
    },
  ];

  const formInputs = [
    {
      label: "Сумма кредита",
      name: "contract_amount",
      rules: [
        {
          required: true,
          message: "Пожалуйста, введите сумму кредита!",
        },
      ],
      node: <Input />,
    },

    {
      label: "Срок кредита",
      name: "contract_term",
      rules: [
        {
          required: true,
          message: "Пожалуйста, введите срок кредита!",
        },
      ],
      node: <Input />,
    },
    {
      label: "Клиент",
      name: "client_code",
      rules: [
        {
          required: true,
          message: "Пожалуйста, введите клиента!",
        },
      ],
      options: clientsData?.map((client) => ({
        label: client.surname,
        value: client.client_code,
      })),
      node: (
        <Select>
          {clientsData?.map((client) => (
            <Select.Option
              key={client.client_code}
              value={client.client_code}
            >
              {client.surname} {client.name} {client.lastname}
            </Select.Option>
          ))}
        </Select>
      ),
    },
    {
      label: "Кредит",
      name: "credit_code",
      rules: [
        {
          required: true,
          message: "Пожалуйста, введите кредит!",
        },
      ],
      options: pledgesData?.map((pledge) => ({
        label: pledge.credit_name,
        value: pledge.credit_code,
      })),
      node: (
        <Select>
          {pledgesData?.map((pledge) => (
            <Select.Option key={pledge.credit_code} value={pledge.credit_code}>
              {pledge.credit_name}
            </Select.Option>
          ))}
        </Select>
      ),
    },
    {
      label: "Сотрудник",
      name: "employee_code",
      rules: [
        {
          required: true,
          message: "Пожалуйста, введите сотрудника!",
        },
      ],
      options: employeesData?.map((employee) => ({
        label: employee.surname,
        value: employee.employee_code,
      })),
      node: (
        <Select>
          {employeesData?.map((employee) => (
            <Select.Option
              key={employee.employee_code}
              value={employee.employee_code}
            >
              {employee.surname} {employee.name} {employee.lastname}
            </Select.Option>
          ))}
        </Select>
      ),
    },
  ];

  return formInputs.map((input) => (
    <CreateForm.Item {...input} key={input.name}>
      {input.node}
    </CreateForm.Item>
  ));
};
