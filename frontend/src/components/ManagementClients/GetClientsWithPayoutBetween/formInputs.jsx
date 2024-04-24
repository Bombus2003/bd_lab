import { Select } from "antd";
import { CreateForm } from "../../../styles/createFormsStyles";
import {
  useGetMaxPayoutToClientQuery,
  useGetMinPayoutToClientQuery,
} from "../../../store/api/clientsApi";

export const FormInputs = () => {
  const { data: maxPayoutData } = useGetMaxPayoutToClientQuery();
  const { data: minPayoutData } = useGetMinPayoutToClientQuery();

  const formInputs = [
    {
      label: "Минимальная выплата клиенту",
      name: "min",
      rules: [
        {
          required: true,
          message: "Пожалуйста, введите минимальную выплату клиенту!",
        },
      ],
      options: minPayoutData?.map((payout) => ({
        label: payout.min,
        value: payout.min,
      })),
      node: (
        <Select>
          {minPayoutData?.map((payout) => (
            <Select.Option key={payout.min} value={payout.min}>
              {payout.min}
            </Select.Option>
          ))}
        </Select>
      ),
    },
    {
      label: "Максимальная выплата клиенту",
      name: "max",
      rules: [
        {
          required: true,
          message: "Пожалуйста, введите максимальную выплату клиенту!",
        },
      ],
      options: maxPayoutData?.map((payout) => ({
        label: payout.max,
        value: payout.max,
      })),
      node: (
        <Select>
          {maxPayoutData?.map((payout) => (
            <Select.Option key={payout.max} value={payout.max}>
              {payout.max}
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
