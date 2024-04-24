import React from "react";
import { Button, Modal } from "antd";
import { CreateForm } from "../../../styles/createFormsStyles";
import { useGetClientsWithPayoutBetweenMutation } from "../../../store/api/clientsApi";
import { FormInputs } from "./formInputs";
import { StyledTableAnt } from "../../../styles/managementTableStyles";

export const GetClientsWithPayoutBetween = ({ open, setOpen, refetch }) => {
  const [clientsWithPayoutBetween, setClientsWithPayoutBetween] =
    React.useState([]);

  const [getClientsWithPayoutBetween, { isLoading }] =
    useGetClientsWithPayoutBetweenMutation();

  const [form] = CreateForm.useForm();

  const onGetClientsWithPayoutBetweenOk = async () => {
    try {
      const clientsWithPayoutBetweenValues = await form.validateFields();

      const minPayout = parseInt(clientsWithPayoutBetweenValues.min);
      const maxPayout = parseInt(clientsWithPayoutBetweenValues.max);

      const response = await getClientsWithPayoutBetween({
        min: minPayout,
        max: maxPayout,
      });

      setClientsWithPayoutBetween(response.data);
      refetch();
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  const onGetClientsWithPayoutBetweenFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const columns = [
    {
      title: "ID клиента",
      dataIndex: "client_code",
    },
    {
      title: "Фамилия",
      dataIndex: "surname",
    },
    {
      title: "Имя",
      dataIndex: "name",
    },
    {
      title: "Отчество",
      dataIndex: "lastname",
    },
    {
      title: "Адрес",
      dataIndex: "address",
    },
    {
      title: "Номер телефона",
      dataIndex: "phone_number",
    },
    {
      title: "Паспортные данные",
      dataIndex: "passport_data",
    },
  ];

  return (
    <Modal
      title="Введите максимальную и минимальную выплату"
      open={open}
      confirmLoading={isLoading}
      onCancel={() => setOpen(false)}
      footer={[
        <Button onClick={() => setOpen(false)}>Отмена</Button>,

        <Button
          type="primary"
          loading={isLoading}
          onClick={onGetClientsWithPayoutBetweenOk}
        >
          Вывести список клиентов
        </Button>,
      ]}
    >
      <CreateForm
        layout="vertical"
        initialValues={{ remember: true }}
        onFinishFailed={onGetClientsWithPayoutBetweenFailed}
        form={form}
      >
        <FormInputs />
      </CreateForm>

      {clientsWithPayoutBetween.length > 0 && (
        <StyledTableAnt
          bordered
          dataSource={clientsWithPayoutBetween}
          columns={columns}
          pagination={false}
        />
      )}
    </Modal>
  );
};
