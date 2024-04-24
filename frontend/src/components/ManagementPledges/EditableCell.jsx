import { Form, Input } from "antd";
import InputMask from "react-input-mask";

export const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  handleInputChange,
  ...restProps
}) => {
  const handleChange = (e) => {
    const { value } = e.target;
    handleInputChange({ [dataIndex]: value }, record);
  };

  const node =
    inputType === "number" ? (
      <InputMask mask="+7 (999) 999-99-99" maskChar="_">
        {(inputProps) => <Input {...inputProps} />}
      </InputMask>
    ) : (
      <Input onChange={handleChange} />
    );

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item name={dataIndex} style={{ margin: 0 }}>
          {node}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};
