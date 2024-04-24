import React, { useState } from "react";
import { Form, Popconfirm, Button, Input, Modal } from "antd";
import {
  ActionsTableWrapper,
  ManageButtonsWrapper,
  StyledTableAnt,
} from "../../styles/managementTableStyles";
import { CreateClient } from "./CreateClients/CreateClient";
import {
  useDeleteClientMutation,
  useFindClientsByNamePatternMutation,
  useGetAllClientsQuery,
  useGetAveragePayoutToClientQuery,
  useGetClientByIdQuery,
  useGetClientsWithDefiniteAddressMutation,
  useGetCountContractsPerClientQuery,
  useGetFindClientsWithAddressAndNoPhoneNumberQuery,
  useGetFindClientsWithAddressOrPhoneNumberQuery,
  useGetFindClientsWithNamesStartingAOrBQuery,
  useGetFindClientsWithPhoneNumberQuery,
  useGetFindClientsWithoutAddressOrPhoneNumberQuery,
  useGetFindUniqueClientAddressQuery,
  useGetFirstTenClientsQuery,
  useGetLastFifteenClientsQuery,
  useGetMaxPayoutToClientQuery,
  useGetMinPayoutToClientQuery,
  useUpdateClientMutation,
} from "../../store/api/clientsApi";
import { EditableCell } from "../EditableCell/EditableCell";
import { GetClientsWithPayoutBetween } from "./GetClientsWithPayoutBetween/GetClientsWithPayoutBetween";
import { formatDate } from "../ManagementEmployees/utils/formatDate";
import { GetEmployeesCelebratingEveryFiveYearsAnniversaryNextMonth } from "../ManagementEmployees/GetEmployeesCelebratingEveryFiveYearsAnniversaryNextMonth/GetEmployeesCelebratingEveryFiveYearsAnniversaryNextMonth";

export const ManagementClients = () => {
  const [isOpenAddClientModal, setIsOpenAddClientModal] = React.useState(false);
  const [isOpenAveragePayoutModal, setIsOpenAveragePayoutModal] =
    React.useState(false);
  const [isOpenMaxPayoutModal, setIsOpenMaxPayoutModal] = React.useState(false);
  const [isOpenMinPayoutModal, setIsOpenMinPayoutModal] = React.useState(false);
  const [
    isOpenGetClientsWithPayoutBetweenModal,
    setIsOpenGetClientsWithPayoutBetweenModal,
  ] = React.useState(false);

  const [fetchedRecords, setFetchedRecords] = useState([]);
  const [selectedClientsData, setSelectedData] = useState(null);
  const [chosenClientId, setChosenClientId] = useState("");

  const [form] = Form.useForm();
  const { data: clientsData, refetch } = useGetAllClientsQuery();

  const [updateClient, { isLoading: isUpdateLoading }] =
    useUpdateClientMutation();

  const [deleteClient, { isLoading: isDeleteLoading }] =
    useDeleteClientMutation();
  const [
      isOpenGetEmployeesCelebratingEveryFiveYearsAnniversaryNextMonthModal,
      setIsOpenGetEmployeesCelebratingEveryFiveYearsAnniversaryNextMonthModal,
    ] = React.useState(false);
  const [findClients] = useFindClientsByNamePatternMutation();

  const { data: firstTenClientsData } = useGetFirstTenClientsQuery();
  const { data: lastFifteenClientsData } = useGetLastFifteenClientsQuery();

  const { data: averagePayoutData } = useGetAveragePayoutToClientQuery();
  const { data: maxPayoutData } = useGetMaxPayoutToClientQuery();
  const { data: minPayoutData } = useGetMinPayoutToClientQuery();

  const { data: countContractsPerClientData } =
    useGetCountContractsPerClientQuery();

  const { data: сlientsWithNamesStartingAOrBData } =
    useGetFindClientsWithNamesStartingAOrBQuery();

  const { data: uniqueClientAddressData } =
    useGetFindUniqueClientAddressQuery();

  const { data: clientByIdData } = useGetClientByIdQuery(chosenClientId);

  const { data: clientsWithAddressAndNoPhoneNumber } =
    useGetFindClientsWithAddressAndNoPhoneNumberQuery();

  const { data: clientsWithAddressOrPhoneNumber } =
    useGetFindClientsWithAddressOrPhoneNumberQuery();

  const { data: clientsWithoutAddressOrPhoneNumber } =
    useGetFindClientsWithoutAddressOrPhoneNumberQuery();

  const [getClientsWithDefiniteAddress] =
    useGetClientsWithDefiniteAddressMutation();

  const { data: clientsWithPhoneNumberData } =
    useGetFindClientsWithPhoneNumberQuery();

  const [editingKey, setEditingKey] = React.useState("");
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
      const newData = [...clientsData];

      const index = newData.findIndex(
        (item) => key === item.client.client_code
      );

      if (index > -1) {
        const item = newData[index];
        await updateClient({ client_code: item.client.client_code, data: row });

        setEditingKey("");
        refetch();
      } else {
        newData.push(row);
        const item = newData[index];

        await updateClient({ client_code: item.client.client_code, data: row });
        setEditingKey("");
      }
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  const handleDelete = async (key) => {
    const dataSource = [...clientsData];

    const clientToDelete = dataSource.find(
      (item) => item.client.client_code === key
    ).client;

    try {
      await deleteClient(clientToDelete.client_code.toString());
      await refetch();
    } catch (error) {
      console.error("Error deleting client:", error);
    }
  };

  const handleSearchClient = async (value) => {
    try {
      const searchedClient = await findClients({ pattern: value });
      handleFetchClientsData(searchedClient.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleGetClientsWithDefiniteAddress = async (value) => {
    try {
      const client = await getClientsWithDefiniteAddress({ address: value });
      handleFetchClientsData(client.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleFetchClientsData = (data) => {
    setSelectedData(data);
    setFetchedRecords([]);
  };

  const columns = [
    {
      title: "ID клиента",
      dataIndex: "client_code",
      width: "1%",
      sorter: {
        compare: (a, b) =>
          a.client_code.toString().localeCompare(b.client_code.toString()),
        multiple: 9,
      },
      render: (_, record) => {
        const contractsCount = record?.contract
          ? record?.contract?.length
          : record?._count?.contract;

        return (
          <>
            <span>{record?.client_code}</span>
            <br />
            <span>
              Количество договоров: <b>{contractsCount}</b>
            </span>
          </>
        );
      },
    },
    {
      title: "Фамилия",
      dataIndex: "surname",
      width: "10%",
      editable: true,
      sorter: {
        compare: (a, b) => a.surname - b.surname,
        multiple: 8,
      },
    },
    {
      title: "Имя",
      dataIndex: "name",
      width: "10%",
      editable: true,
      sorter: {
        compare: (a, b) => a.name.localeCompare(b.name),
        multiple: 7,
      },
    },
    {
      title: "Отчество",
      dataIndex: "lastname",
      width: "10%",
      editable: true,
      sorter: {
        compare: (a, b) => a.lastname - b.lastname,
        multiple: 6,
      },
    },
    {
      title: "Дата рождения",
      dataIndex: "birthday",
      width: "10%",
      editable: true,
      render: (date) => formatDate(date),
      sorter: (a, b) => a.birthday.localeCompare(b.birthday),
      sortDirections: ["ascend", "descend"],
    },
    {
      title: "Зарплата",
      dataIndex: "salary",
      width: "5%",
      editable: true,
      sorter: {
        compare: (a, b) => a.salary - b.salary,
        multiple: 5,
      },
    },
    {
      title: "Место работы",
      dataIndex: "workplace",
      width: "20%",
      editable: true,
      sorter: {
        compare: (a, b) => a.workplace - b.workplace,
        multiple: 4,
      },
    },
    {
      title: "Адрес",
      dataIndex: "address",
      width: "20%",
      editable: true,
      sorter: {
        compare: (a, b) => a.address.toString().localeCompare(b.address.toString()),
        multiple: 3,
      },
    },
    {
      title: "Номер телефона",
      dataIndex: "phone_number",
      width: "15%",
      editable: true,
      sorter: {
        compare: (a, b) => a.phone_number.toString().localeCompare(b.phone_number.toString()),
        multiple: 2,
      },
      sortDirections: ["ascend", "descend"],
    },
    {
      title: "Паспортные данные",
      dataIndex: "passport_data",
      width: "17%",
      editable: true,
      sorter: {
        compare: (a, b) => a.passport_data - b.passport_data,
        multiple: 1,
      },
    },
    {
      title: "Действия",
      dataIndex: "operation",
      render: (_, record) => {
        const editable = isEditing(record);

        return editable ? (
          <ActionsTableWrapper>
            <Button onClick={() => save(record.key)} loading={isUpdateLoading}>
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
            <Button disabled={editingKey !== ""} onClick={() => edit(record)}>
              <b>(№11) </b>Изменить
            </Button>

            <Popconfirm
              title="Уверены что хотите удалить клиента?"
              onConfirm={() => handleDelete(record.key)}
            >
              <Button>
                <b>(№12) </b>Удалить
              </Button>
            </Popconfirm>
          </ActionsTableWrapper>
        );
      },
    },
  ];

  const mergedColumns = columns.map((col) => {
    if (!col.editable) return col;

    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.dataIndex === "phone_number" ? "number" : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  const allClientsData = clientsData?.map((client) => ({
    ...client,
    key: client.client_code,
  }));

  const convertedClientsData = selectedClientsData?.map((client) => ({
    ...client,
    key: client.client_code,
  }));

  const clientByIdDataArray = [clientByIdData]?.map((client) => ({
    ...client,
    key: client?.client_code,
  }));

  return (
    <>
      <ManageButtonsWrapper>
        <Button onClick={() => handleFetchClientsData(allClientsData)}>
          <b>(№1) </b>Все клиенты
        </Button>
      </ManageButtonsWrapper>

      <ManageButtonsWrapper>
        <Button onClick={() => handleFetchClientsData(uniqueClientAddressData)}>
          <b>(№2) </b>Клиенты с уникальными адресами
        </Button>
      </ManageButtonsWrapper>

      <ManageButtonsWrapper>
        <Button onClick={() => handleFetchClientsData(firstTenClientsData)}>
          <b>(№3) </b> Первые 10 клиентов
        </Button>
      </ManageButtonsWrapper>

      <ManageButtonsWrapper>
        <Button onClick={() => handleFetchClientsData(lastFifteenClientsData)}>
          <b>(№4) </b>Последние 15 клиентов
        </Button>
      </ManageButtonsWrapper>

      <ManageButtonsWrapper>
        <Button onClick={() => setIsOpenAveragePayoutModal(true)}>
          <b>(№5) </b>Средняя плата по кредиту
        </Button>

        <Button onClick={() => setIsOpenMaxPayoutModal(true)}>
          <b>(№5) </b>Максимальная плата по кредиту
        </Button>

        <Button onClick={() => setIsOpenMinPayoutModal(true)}>
          <b>(№5) </b>Минимальная плата по кредиту
        </Button>
      </ManageButtonsWrapper>

      <ManageButtonsWrapper>
        <Input
          placeholder="Найти..."
          style={{ width: 200 }}
          onChange={(e) => setChosenClientId(e.target.value)}
          enterButton
        />

        <Button onClick={() => handleFetchClientsData(clientByIdDataArray)}>
          <b>(№6.1) </b>Найти клиента по первичному ключу
        </Button>
      </ManageButtonsWrapper>

      <ManageButtonsWrapper>
        <Input.Search
          placeholder="Найти..."
          allowClear
          enterButton="(№6.3) Найти клиента"
          onSearch={handleSearchClient}
          style={{ width: 370 }}
        />
      </ManageButtonsWrapper>

      <ManageButtonsWrapper>
        <Button
          onClick={() =>
            handleFetchClientsData(clientsWithAddressAndNoPhoneNumber)
          }
        >
          <b>(№6.4) </b>Найти клиента с адресом но без номера телефона (условие
          с И)
        </Button>
      </ManageButtonsWrapper>

      <ManageButtonsWrapper>
        <Button
          onClick={() =>
            handleFetchClientsData(clientsWithAddressOrPhoneNumber)
          }
        >
          <b>(№6.4) </b>Найти клиента с адресом или с номером телефона (условие
          с ИЛИ)
        </Button>
      </ManageButtonsWrapper>

      <ManageButtonsWrapper>
        <Button
          onClick={() =>
            handleFetchClientsData(clientsWithoutAddressOrPhoneNumber)
          }
        >
          <b>(№6.4) </b>Найти клиента без адреса или без номера телефона
          (условие с НЕ)
        </Button>
      </ManageButtonsWrapper>

      <ManageButtonsWrapper>
        <Input.Search
          placeholder="Найти..."
          allowClear
          enterButton="(№6.4) Найти клиента с определенным адресом (условие с EXIST)"
          onSearch={handleGetClientsWithDefiniteAddress}
          style={{ width: 700 }}
        />
      </ManageButtonsWrapper>

      <ManageButtonsWrapper>
        <Button
          onClick={() => handleFetchClientsData(clientsWithPhoneNumberData)}
        >
          <b>(№6.5) </b>Найти клиента обязательно с номером телефона
        </Button>
      </ManageButtonsWrapper>

      <ManageButtonsWrapper>
        <Button onClick={() => setIsOpenGetClientsWithPayoutBetweenModal(true)}>
          <b>(№7) </b>Клиенты, которые выплачивают кредит
        </Button>
      </ManageButtonsWrapper>

      <ManageButtonsWrapper>
        <Button
          onClick={() => handleFetchClientsData(countContractsPerClientData)}
        >
          <b>(№9) </b>Клиенты с наибольшим количеством кредитов
        </Button>
      </ManageButtonsWrapper>

      <ManageButtonsWrapper>
        <Button
          onClick={() =>
            handleFetchClientsData(сlientsWithNamesStartingAOrBData)
          }
        >
          <b>(№10) </b>Клиенты, у которых имя начинается на "А" или "Б"
        </Button>
      </ManageButtonsWrapper>

      <ManageButtonsWrapper>
        <Button
          loading={isDeleteLoading}
          onClick={() => setIsOpenAddClientModal(true)}
        >
          <b>(№13) </b>Добавить клиента
        </Button>
      </ManageButtonsWrapper>

      <ManageButtonsWrapper>
        <Button
          loading={isDeleteLoading}
          onClick={() =>
            setIsOpenGetEmployeesCelebratingEveryFiveYearsAnniversaryNextMonthModal(
              true
            )
          }
          type="primary"
        >
          <b>(№14) </b>Клиенты, которые в следующем месяце будут отмечать
          юбилей
        </Button>
      </ManageButtonsWrapper>

      <Form form={form} component={false}>
        <StyledTableAnt
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          bordered
          dataSource={convertedClientsData || allClientsData}
          columns={mergedColumns}
          pagination={false}
        />
      </Form>

      <CreateClient
        open={isOpenAddClientModal}
        setOpen={setIsOpenAddClientModal}
        refetch={refetch}
      />

      <GetClientsWithPayoutBetween
        open={isOpenGetClientsWithPayoutBetweenModal}
        setOpen={setIsOpenGetClientsWithPayoutBetweenModal}
        refetch={refetch}
      />

      <Modal
        title="Средняя плата по кредиту"
        open={isOpenAveragePayoutModal}
        onCancel={() => setIsOpenAveragePayoutModal(false)}
        footer={[
          <Button onClick={() => setIsOpenAveragePayoutModal(false)}>
            Закрыть
          </Button>,
        ]}
      >
        <b>{Math.floor(averagePayoutData?.[0].avg)}</b> ₽
      </Modal>

      <Modal
        title="Максимальная плата по кредиту"
        open={isOpenMaxPayoutModal}
        onCancel={() => setIsOpenMaxPayoutModal(false)}
        footer={[
          <Button onClick={() => setIsOpenMaxPayoutModal(false)}>
            Закрыть
          </Button>,
        ]}
      >
        <b>{maxPayoutData?.[0].max}</b> ₽
      </Modal>

      <Modal
        title="Минимальная плата по кредиту"
        open={isOpenMinPayoutModal}
        onCancel={() => setIsOpenMinPayoutModal(false)}
        footer={[
          <Button onClick={() => setIsOpenMinPayoutModal(false)}>
            Закрыть
          </Button>,
        ]}
      >
        <b>{minPayoutData?.[0].min}</b> ₽
      </Modal>
      <GetEmployeesCelebratingEveryFiveYearsAnniversaryNextMonth
        open={
          isOpenGetEmployeesCelebratingEveryFiveYearsAnniversaryNextMonthModal
        }
        setOpen={
          setIsOpenGetEmployeesCelebratingEveryFiveYearsAnniversaryNextMonthModal
        }
      />
    </>
  );
};
