import { Input } from "antd";

export const formInputs = [
  {
    label: "Название",
    name: "credit_name",
    rules: [
      {
        required: true,
        message: "Пожалуйста, введите название кредита!",
      },
    ],
    node: <Input />,
  },
  {
    label: "Минимальная сумма кредита",
    name: "min_amount",
    rules: [
      {
        required: true,
        message: "Пожалуйста, введите минимальную сумму кредита!",
      },
    ],
    node: <Input />,
  },
  {
    label: "Максимальная сумма кредита",
    name: "max_amount",
    rules: [
      {
        required: true,
        message: "Пожалуйста, введите максимальную сумму кредита!",
      },
    ],
    node: <Input />,
  },
  {
    label: "Минимальный срок кредита(в месяцах)",
    name: "min_credit_term",
    rules: [
      {
        required: true,
        message: "Пожалуйста, введите минимальный срок кредита!",
      },
    ],
    node: <Input />,
  },
  {
    label: "Максимальный срок кредита(в месяцах)",
    name: "max_credit_term",
    rules: [
      {
        required: true,
        message: "Пожалуйста, введите максимальный срок кредита!",
      },
    ],
    node: <Input />,
  },
  {
    label: "Процентная ставка",
    name: "interest_rate",
    rules: [
      {
        required: true,
        message: "Пожалуйста, введите процентную ставку!",
      },
    ],
    node: <Input />,
  },
];
