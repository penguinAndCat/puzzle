import React from 'react';
import styled, { CSSProp } from 'styled-components';

interface ButtonProps {
  /**
   * What background color to use
   */
  backgroundColor?: string;
  /**
   * Button contents with only storybook
   */
  label?: string;
  /**
   * Optional click handler
   */
  onClick?: () => void;
  /**
   * Optional click handler
   */
  type?: 'default';
  /**
   * Optional styled-components CSSProp
   */
  css?: CSSProp;
  /**
   * Button contents
   */
  children?: React.ReactNode;
}

export const Button = ({ backgroundColor, label, type, css, children, ...props }: ButtonProps) => {
  return (
    <CustomButton style={{ backgroundColor }} css={css} {...props}>
      {label ? label : children}
    </CustomButton>
  );
};

export const CustomButton = styled.button<{ css: CSSProp | undefined }>`
  position: relative;
  width: 80px;
  height: 30px;
  border-radius: 4px;
  border: 3px ${({ theme }) => theme.borderColor};
  color: ${({ theme }) => theme.headerTextColor};
  background-color: ${({ theme }) => theme.headerColor};
  font-weight: 600;
  text-align: center;
  cursor: pointer;
  padding: 0;
  ${({ css }) => css};
`;
