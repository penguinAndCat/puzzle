import styled from 'styled-components';

// 반응형 디자인을 위한 픽셀 컨버팅 함수
const pixelToRem = (size: number) => `${size / 16}rem`;

const fontSizes = {
  title: pixelToRem(60),
  subtitle: pixelToRem(30),
  paragraph: pixelToRem(18),
};

const colors = {
  dark: '#000000',
  mint: '#03DBA4',
  pink: '#FFC0CB',
  silver: '#e9e6e4',
  white: '#FFFFFF',
};

const common = {
  flexCenter: `
    display: flex;
    justify-contents: center;
    align-items: center;
  `,
  flexCenterColumn: `
    display: flex;
    flex-direction: column;
    justify-contents: center;
    align-items: center;
  `,
};

export const silverTheme = {
  bgColor: colors.silver,
  textColor: colors.dark,
  borderColor: `solid ${colors.dark}`,
  headerColor: colors.silver,
  headerTextColor: colors.dark,
};

export const darkTheme = {
  bgColor: colors.dark,
  textColor: colors.white,
  borderColor: `solid ${colors.dark}`,
  headerColor: colors.white,
  headerTextColor: colors.dark,
};

export const pinkTheme = {
  bgColor: colors.pink,
  textColor: colors.white,
  borderColor: `solid ${colors.pink}`,
  headerColor: colors.white,
  headerTextColor: colors.pink,
};

export const mintTheme = {
  bgColor: colors.mint,
  textColor: colors.white,
  borderColor: `solid ${colors.mint}`,
  headerColor: colors.white,
  headerTextColor: colors.mint,
};

// theme 객체에 감싸서 반환한다.
export const theme = {
  fontSizes,
  common,
  darkTheme,
  silverTheme,
  pinkTheme,
  mintTheme,
  colors,
};

// export default theme;
