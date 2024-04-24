import React from "react";
import { Button, Modal } from "antd";
import { formInputs } from "./formInputs";
import { CreateForm } from "../../../styles/createFormsStyles";
import { useCreateClientMutation } from "../../../store/api/clientsApi";

export const CreateClient = ({ open, setOpen, refetch }) => {
  const [createClient, { isLoading }] = useCreateClientMutation();
  const [form] = CreateForm.useForm();

  const onCreateClientOk = async () => {
    try {
      const clientValues = await form.validateFields();
      await createClient(clientValues);

      refetch();
      setOpen(false);
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  const onCreateClientFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <Modal
      title="Добавить клиента"
      open={open}
      confirmLoading={isLoading}
      onCancel={() => setOpen(false)}
      footer={[
        <Button onClick={() => setOpen(false)}>Отмена</Button>,

        <Button type="primary" loading={isLoading} onClick={onCreateClientOk}>
          Создать
        </Button>,
      ]}
    >
      <CreateForm
        layout="vertical"
        initialValues={{ remember: true }}
        onFinishFailed={onCreateClientFailed}
        form={form}
      >
        {formInputs.map((input) => (
          <CreateForm.Item {...input} key={input.name}>
            {input.node}
          </CreateForm.Item>
        ))}
      </CreateForm>
    </Modal>
  );
};
