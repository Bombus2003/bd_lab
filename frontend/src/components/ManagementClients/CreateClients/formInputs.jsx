import { DatePicker, Input } from "antd";
import InputMask from "react-input-mask";
import locale from "antd/es/date-picker/locale/ru_RU";

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
    label: "День рождения",
    name: "birthday",
    rules: [
      {
        required: true,
        message: "Пожалуйста, введите день рождения сотрудника!",
      },
    ],
    node: (
      <DatePicker
        format="YYYY-MM-DD"
        locale={locale}
        style={{ width: "100%" }}
      />
    ),
  },
  {
    label: "Паспортные данные",
    name: "passport_data",
    rules: [
      {
        required: true,
        message: "Пожалуйста, введите паспортные данные клиента!",
      },
    ],
    node: <Input />,
  },
  {
    label: "Зароботная плата",
    name: "salary",
    rules: [
      {
        required: true,
        message: "Пожалуйста, введите зарплату клиента!",
      },
    ],
    node: <Input />,
  },
  {
    label: "Место работы",
    name: "workplace",
    rules: [
      {
        required: true,
        message: "Пожалуйста, введите место работы клиента!",
      },
    ],
    node: <Input />,
  },
  {
    label: "Адрес",
    name: "address",
    node: <Input />,
  },
  {
    label: "Номер телефона",
    name: "phone_number",
    node: (
      <InputMask mask="+7 (999) 999-99-99" maskChar="_">
        {(inputProps) => <Input {...inputProps} />}
      </InputMask>
    ),
  },
];
