import { Input } from "antd";
import styled from "styled-components";

export const StyledDisabledInput = styled(Input)`
  &[disabled] {
    color: #000;
  }
`;

export const StyledDisabledTextArea = styled(Input.TextArea)`
  &[disabled] {
    color: #000;
  }
`;
