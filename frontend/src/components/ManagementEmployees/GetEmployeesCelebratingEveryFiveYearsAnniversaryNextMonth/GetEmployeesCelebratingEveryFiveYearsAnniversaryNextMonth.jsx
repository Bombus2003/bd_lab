import React from "react";
import { Button, Modal } from "antd";
import { StyledTableAnt } from "../../../styles/managementTableStyles";
import { formatDate } from "../utils/formatDate";
import { useGetFindClientsCelebratingEveryFiveYearsAnniversaryNextMonthQuery } from "../../../store/api/clientsApi";

export const GetEmployeesCelebratingEveryFiveYearsAnniversaryNextMonth = ({
  open,
  setOpen,
}) => {
  const { data: employeesCelebratingEveryFiveYearsAnniversaryNextMonth } =
    useGetFindClientsCelebratingEveryFiveYearsAnniversaryNextMonthQuery();

  const columns = [
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
      title: "Возраст",
      dataIndex: "age_next_month",
    },
    {
      title: "Дата рождения",
      dataIndex: "birthday",
      render: (date) => formatDate(date),
    },
    {
      title: "Дата юбилея",
      dataIndex: "next_anniversary_date",
      render: (date) => formatDate(date),
    },
  ];

  return (
    <Modal
      title="Клиенты, которые в следующем месяце будут отмечать
      юбилей"
      open={open}
      onCancel={() => setOpen(false)}
      footer={[
        <Button onClick={() => setOpen(false)} type="primary">
          ОК
        </Button>,
      ]}
    >
      <StyledTableAnt
        bordered
        dataSource={employeesCelebratingEveryFiveYearsAnniversaryNextMonth}
        columns={columns}
        pagination={false}
      />
    </Modal>
  );
};
