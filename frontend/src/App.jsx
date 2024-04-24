import { Tabs, Typography } from "antd";
import { ManagementClients } from "./components/ManagementClients/ManagementClients";
import { ManagementEmployees } from "./components/ManagementEmployees/ManagementEmployees";
import { ManagementPledges } from "./components/ManagementPledges/ManagementPledges";
import { ManagementContracts } from "./components/ManagementContracts/ManagementContracts";

function App() {
  const tabs = [
    {
      key: "clients",
      label: "Клиенты",
      children: <ManagementClients />,
    },
    {
      key: "employees",
      label: "Сотрудники",
      children: <ManagementEmployees />,
    },
    {
      key: "pledges",
      label: "Кредиты",
      children: <ManagementPledges />,
    },
    {
      key: "contracts",
      label: "Договоры",
      children: <ManagementContracts />,
    },
  ];

  return (
    <div style={{ margin: "40px" }}>
      <Typography.Title>Админ панель</Typography.Title>
      <Tabs defaultActiveKey="1" items={tabs} />
    </div>
  );
}

export default App;
