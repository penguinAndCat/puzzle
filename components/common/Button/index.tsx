import React from 'react';
import styled, { CSSProp } from 'styled-components';

interface ButtonProps {
  /**
   * 배경 색상
   */
  backgroundColor?: string;
  /**
   * 버튼 내용(storybook에서만 사용)
   */
  label?: string;
  /**
   * 클릭 시 핸들러
   */
  onClick?: () => void;
  /**
   * 버튼 타입
   */
  buttonType?: 'default' | 'modalUser' | 'modalNotice';
  /**
   * 추가적인 styled-components CSSProp
   */
  css?: CSSProp;
  /**
   * 버튼 내용
   */
  children?: React.ReactNode;
}

export const Button = ({ backgroundColor, label, buttonType = 'default', css, children, ...props }: ButtonProps) => {
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
