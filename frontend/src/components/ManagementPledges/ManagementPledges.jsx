import React, { useState } from "react";
import { Form, Popconfirm, Button, Input } from "antd";
import {
  ActionsTableWrapper,
  ManageButtonsWrapper,
  StyledTableAnt,
} from "../../styles/managementTableStyles";
import {
  useCreatePledgeMutation,
  useDeletePledgeMutation,
  useGetAllPledgesQuery,
  useUpdatePledgeMutation,
} from "../../store/api/pledgesApi";
import { EditableCell } from "./EditableCell";

export const ManagementPledges = () => {
  const [searchValue, setSearchValue] = useState("");
  const [form] = Form.useForm();
  const { data: pledgesData, refetch } = useGetAllPledgesQuery();
  const [updatePledge, { isLoading: isUpdateLoading }] =
    useUpdatePledgeMutation();
  const [deletePledge, { isLoading: isDeleteLoading, error }] =
    useDeletePledgeMutation();
  const [createPledge, { isSuccess: isCreatePledgeSuccess }] =
    useCreatePledgeMutation();
  const [editingKey, setEditingKey] = useState("");
  const [formData, setFormData] = useState({});

  const isEditing = (record) => record.key === editingKey;

  const edit = (record) => {
    form.setFieldsValue({ ...record });
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey("");
  };

  const save = async (key) => {
    try {
      const row = await form.validateFields();
      const newData = [...pledgesData];
      const index = newData.findIndex((item) => key === item.credit_code);

      if (index > -1) {
        const item = newData[index];
        await updatePledge({ credit_code: item.credit_code, data: {...row, max_credit_term: +row.max_credit_term, min_credit_term: +row.min_credit_term, interest_rate: +row.interest_rate, min_amount: +row.min_amount, max_amount: +row.max_amount} });

        setEditingKey("");
        refetch();
      } else {
        newData.push(row);
        const item = newData[index];
        await updatePledge({ credit_code: item.credit_code, data: {...row, max_credit_term: +row.max_credit_term, min_credit_term: +row.min_credit_term, interest_rate: +row.interest_rate, min_amount: +row.min_amount, max_amount: +row.max_amount} });
        setEditingKey("");
      }
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  const handleDelete = async (key) => {
    const dataSource = [...pledgesData];
    const pledgeToDelete = dataSource.find((item) => item.credit_code === key);

    try {
      await deletePledge(pledgeToDelete.credit_code.toString());
      await refetch();
    } catch (error) {
      console.error("Error deleting pledge:", error);
    }
  };

  const handleAddNewLine = async () => {
    try {
      const newRow = {
        credit_name: "Наименование кредита",
        min_amount: 1000,
        max_amount: 100000,
        min_credit_term: 12,
        max_credit_term: 36,
        interest_rate: 6,
      };

      setEditingKey(newRow.credit_name);
      await createPledge(newRow);
      await refetch();
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  const handleInputChange = async (newCellValues) => {
    try {
      const updatedFormData = { ...formData, ...newCellValues };
      setFormData(updatedFormData);

      const forDelete = pledgesData
        ?.filter(
          (obj) => !obj.condition && !obj.description && !obj.characteristics
        )[0]
        .credit_code.toString();

      if (
        updatedFormData.condition &&
        updatedFormData.description &&
        updatedFormData.characteristics
      ) {
        await deletePledge(forDelete);
        await createPledge(updatedFormData);
        setEditingKey("");
        await refetch();

        if (isCreatePledgeSuccess) {
          for (let key in updatedFormData) {
            updatedFormData[key] = null;
          }
        }
      }
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  const columns = [
    {
      title: "ID кредита",
      dataIndex: "credit_code",
      width: "15%",
      sorter: (a, b) => {
        if (!isNaN(Number(a.credit_code)) && !isNaN(Number(b.credit_code))) {
          return Number(a.credit_code) - Number(b.credit_code);
        } else {
          return 0; // Handle non-numeric values appropriately
        }
      },
      sortDirections: ["ascend", "descend"],
    },
    {
      title: "Название кредита",
      dataIndex: "credit_name",
      width: "20%",
      editable: true,
      sorter: (a, b) => a.condition.localeCompare(b.condition),
      sortDirections: ["ascend", "descend"],
    },
    {
      title: "Минимальная сумма кредита",
      dataIndex: "min_amount",
      width: "22%",
      editable: true,
      sorter: (a, b) => a.description.localeCompare(b.description),
      sortDirections: ["ascend", "descend"],
      render: (value) => `${value} ₽`,
    },
    {
      title: "Максимальная сумма кредита",
      dataIndex: "max_amount",
      width: "20%",
      editable: true,
      sorter: (a, b) => a.characteristics.localeCompare(b.characteristics),
      sortDirections: ["ascend", "descend"],
      render: (value) => `${value} ₽`,
    },
    {
      title: "Минимальный срок кредита(в месяцах)",
      dataIndex: "min_credit_term",
      width: "20%",
      editable: true,
      sorter: (a, b) => a.characteristics.localeCompare(b.characteristics),
      sortDirections: ["ascend", "descend"],
    },
    {
      title: "Максимальный срок кредита(в месяцах)",
      dataIndex: "max_credit_term",
      width: "20%",
      editable: true,
      sorter: (a, b) => a.characteristics.localeCompare(b.characteristics),
      sortDirections: ["ascend", "descend"],
    },
    {
      title: "Процентная ставка",
      dataIndex: "interest_rate",
      width: "20%",
      editable: true,
      sorter: (a, b) => a.characteristics.localeCompare(b.characteristics),
      sortDirections: ["ascend", "descend"],
      render: (value) => `${value}%`,
    },
    {
      title: "Действия",
      dataIndex: "operation",
      render: (_, record) => {
        const editable = isEditing(record);

        return editable ? (
          <ActionsTableWrapper>
            <Button
              onClick={() => save(record.key)}
              loading={isUpdateLoading}
              type="primary"
            >
              Сохранить
            </Button>

            <Popconfirm
              title="Уверены что хотите отменить действие?"
              onConfirm={cancel}
            >
              <Button>Отменить</Button>
            </Popconfirm>
          </ActionsTableWrapper>
        ) : (
          <ActionsTableWrapper>
            <Button
              onClick={() => edit(record)}
              type="primary"
            >
              Изменить
            </Button>

            <Popconfirm
              title="Уверены что хотите удалить кредит?"
              onConfirm={() => handleDelete(record.key)}
            >
              <Button>Удалить</Button>
            </Popconfirm>
          </ActionsTableWrapper>
        );
      },
    },
  ];

  // Existing code for merged columns, handleSearch, and filteredData...

  const handleSearch = (value) => {
    setSearchValue(value);
  };

  const filteredData = pledgesData
    ? pledgesData.filter((pledge) => {
        const searchRegex = new RegExp(searchValue, "i");
        return (
          searchRegex.test(pledge.credit_code) ||
          searchRegex.test(pledge.condition) ||
          searchRegex.test(pledge.description) ||
          searchRegex.test(pledge.characteristics)
        );
      })
    : [];
  const mergedColumns = columns.map((col) => {
    if (!col.editable) return col;

    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
        handleInputChange,
      }),
    };
  });

  return (
    <>
      <ManageButtonsWrapper>
        <Button loading={isDeleteLoading} onClick={handleAddNewLine}>
          Добавить кредит
        </Button>

        <Input
          onChange={(e) => handleSearch(e.target.value)}
          style={{ width: 200 }}
          placeholder="Найти..."
        />
      </ManageButtonsWrapper>

      <Form form={form} component={false}>
        <StyledTableAnt
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          bordered
          dataSource={filteredData.map((pledge) => ({
            ...pledge,
            key: pledge.credit_code,
          }))}
          columns={mergedColumns}
          pagination={false}
        />
      </Form>
    </>
  );
};
