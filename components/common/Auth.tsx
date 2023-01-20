import styled, { css } from 'styled-components';

const Form = styled.form`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const AuthStyle = css`
  background-color: ${({ theme }) => theme.modalColor};
  color: ${({ theme }) => theme.modalTextColor};
  border: solid 1px ${({ theme }) => theme.modalTextColor};
  border-radius: 4px;
  height: 24px;
`;

const Div = styled.div`
  color: ${({ theme }) => theme.profileTextColor};
  height: 24px;
  line-height: 22px;
  margin-right: 6px;
`;

const Input = styled.input`
  ${AuthStyle};
  width: 160px;
  &:focus {
    outline: none;
  }
  margin-right: 2px;
`;

const Button = styled.button`
  ${AuthStyle};
  cursor: pointer;
  &:hover {
    border: solid 1px ${({ theme }) => theme.modalColor};
  }
`;

export const AuthComponent = {
  Form,
  Div,
  Input,
  Button,
};
