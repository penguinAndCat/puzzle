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
   * Optional theme
   */
  buttonType?: 'default' | 'modalUser' | 'modalNotice';
  /**
   * Optional styled-components CSSProp
   */
  css?: CSSProp;
  /**
   * Button contents
   */
  children?: React.ReactNode;
}

export const Button = ({ backgroundColor, label, buttonType = 'default', css, children, ...props }: ButtonProps) => {
  console.log(buttonType);
  if (buttonType === 'default')
    return (
      <CustomButton style={{ backgroundColor }} css={css} {...props}>
        {label ? label : children}
      </CustomButton>
    );
  return (
    <ModalButton style={{ backgroundColor }} buttonType={buttonType} {...props}>
      {label ? label : children}
    </ModalButton>
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

export const ModalButton = styled.button<{ buttonType: 'default' | 'modalUser' | 'modalNotice' }>`
  width: ${({ buttonType }) => (buttonType === 'modalUser' ? 70 : 50)}px;
  height: 24px;
  padding: 0;
  border-radius: 2px;
  font-size: 12px;
  background-color: ${({ theme }) => theme.modalColor};
  color: ${({ theme }) => theme.modalTextColor};
  border: solid 1px ${({ theme }) => theme.modalTextColor};
  line-height: 24px;
  cursor: pointer;
`;
