import React from "react";
import { Button, Modal } from "antd";
import { formInputs } from "./formInputs";
import { CreateForm } from "../../../styles/createFormsStyles";
import { useCreatePledgeMutation } from "../../../store/api/pledgesApi";

export const CreatePledge = ({ open, setOpen, refetch }) => {
  const [createPledge, { isLoading }] = useCreatePledgeMutation();
  const [form] = CreateForm.useForm();

  const onCreatePledgeOk = async () => {
    try {
      const employeeValues = await form.validateFields();
      await createPledge(employeeValues);

      refetch();
      setOpen(false);
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  const onCreatePledgeFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <Modal
      title="Добавить кредит"
      open={open}
      confirmLoading={isLoading}
      onCancel={() => setOpen(false)}
      footer={[
        <Button onClick={() => setOpen(false)}>Отмена</Button>,

        <Button type="primary" loading={isLoading} onClick={onCreatePledgeOk}>
          Создать
        </Button>,
      ]}
    >
      <CreateForm
        layout="vertical"
        initialValues={{ remember: true }}
        onFinishFailed={onCreatePledgeFailed}
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
