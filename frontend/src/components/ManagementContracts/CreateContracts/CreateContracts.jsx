import React from "react";
import { Button, Modal } from "antd";
import { CreateForm } from "../../../styles/createFormsStyles";
import { FormInputs } from "./formInputs";
import { useCreateContractMutation } from "../../../store/api/contractsApi";

export const CreateContracts = ({ open, setOpen, refetchContractsBetweenData }) => {
  const [createContract, { isLoading }] = useCreateContractMutation();
  const [form] = CreateForm.useForm();

  const onCreateContractOk = async () => {
    try {
      const contractValues = await form.validateFields();
      
      await createContract({...contractValues, contract_amount: +contractValues.contract_amount, contract_term:  +contractValues.contract_term});

      setOpen(false);
      refetchContractsBetweenData();
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  const onCreateContractFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <Modal
      title="Добавить предмет договор"
      open={open}
      confirmLoading={isLoading}
      onCancel={() => setOpen(false)}
      footer={[
        <Button onClick={() => setOpen(false)}>Отмена</Button>,

        <Button type="primary" loading={isLoading} onClick={onCreateContractOk}>
          Создать
        </Button>,
      ]}
    >
      <CreateForm
        layout="vertical"
        initialValues={{ remember: true }}
        onFinishFailed={onCreateContractFailed}
        form={form}
      >
        <FormInputs />
      </CreateForm>
    </Modal>
  );
};
