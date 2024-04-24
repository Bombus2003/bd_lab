import React from "react";
import { Button, Modal } from "antd";
import { formInputs } from "./formInputs";
import { CreateForm } from "../../../styles/createFormsStyles";
import { useCreateEmployeeMutation } from "../../../store/api/employeesApi";

export const CreateEmployees = ({ open, setOpen, refetch }) => {
  const [createEmployee, { isLoading }] = useCreateEmployeeMutation();
  const [form] = CreateForm.useForm();

  const onCreateEmployeeOk = async () => {
    try {
      const employeeValues = await form.validateFields();
      await createEmployee(employeeValues);

      refetch();
      setOpen(false);
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  const onCreateEmployeeFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <Modal
      title="Добавить сотрудника"
      open={open}
      confirmLoading={isLoading}
      onCancel={() => setOpen(false)}
      footer={[
        <Button onClick={() => setOpen(false)}>Отмена</Button>,

        <Button type="primary" loading={isLoading} onClick={onCreateEmployeeOk}>
          Создать
        </Button>,
      ]}
    >
      <CreateForm
        layout="vertical"
        initialValues={{ remember: true }}
        onFinishFailed={onCreateEmployeeFailed}
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
