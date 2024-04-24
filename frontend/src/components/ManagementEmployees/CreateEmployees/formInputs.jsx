import { DatePicker, Input } from "antd";
import locale from "antd/es/date-picker/locale/ru_RU";
import InputMask from "react-input-mask";

export const formInputs = [
  {
    label: "Фамилия",
    name: "surname",
    rules: [
      {
        required: true,
        message: "Пожалуйста, введите фамилию клиента!",
      },
    ],
    node: <Input />,
  },
  {
    label: "Имя",
    name: "name",
    rules: [
      {
        required: true,
        message: "Пожалуйста, введите имя клиента!",
      },
    ],
    node: <Input />,
  },
  {
    label: "Отчество",
    name: "lastname",
    rules: [
      {
        required: true,
        message: "Пожалуйста, введите отчество клиента!",
      },
    ],
    node: <Input />,
  },
  {
    label: "Номер телефона",
    name: "phone_number",
    rules: [
      {
        required: true,
        message: "Пожалуйста, введите номер телефона сотрудника!",
      },
    ],
    node: (
      <InputMask mask="+7 (999) 999-99-99" maskChar="_">
        {(inputProps) => <Input {...inputProps} />}
      </InputMask>
    ),
  },
  {
    label: "Должность",
    name: "position",
    rules: [
      {
        required: true,
        message: "Пожалуйста, введите должность сотрудника!",
      },
    ],
    node: <Input />,
  },
];
