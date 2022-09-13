const pixelToRem = (size: number) => `${size / 16}rem`;

const fontSizes = {
  title: pixelToRem(60),
  subtitle: pixelToRem(30),
  paragraph: pixelToRem(18),
};

const colors = {
  dark: '#2b2a2b',
  mint: '#03DBA4',
  pink: '#FFC0CB',
  silver: '#e9e6e4',
  white: '#FFFFFF',
  black: '#000000',
};

const common = {
  flexCenter: `
    display: flex;
    justify-content: center;
    align-items: center;
  `,
  flexCenterColumn: `
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  `,
};

export const silverTheme: Theme = {
  bgColor: colors.silver,
  textColor: colors.dark,
  borderColor: `solid ${colors.dark}`,
  headerColor: colors.silver,
  headerTextColor: colors.dark,
  modalColor: colors.silver,
  modalTextColor: colors.dark,
};

export const darkTheme: Theme = {
  bgColor: colors.dark,
  textColor: colors.white,
  borderColor: `solid ${colors.dark}`,
  headerColor: colors.white,
  headerTextColor: colors.dark,
  modalColor: colors.dark,
  modalTextColor: colors.white,
};

export const pinkTheme: Theme = {
  bgColor: colors.pink,
  textColor: colors.white,
  borderColor: `solid ${colors.pink}`,
  headerColor: colors.white,
  headerTextColor: colors.pink,
  modalColor: colors.white,
  modalTextColor: colors.pink,
};

export const mintTheme: Theme = {
  bgColor: colors.mint,
  textColor: colors.white,
  borderColor: `solid ${colors.mint}`,
  headerColor: colors.white,
  headerTextColor: colors.mint,
  modalColor: colors.white,
  modalTextColor: colors.mint,
};

export const theme = {
  fontSizes,
  common,
  darkTheme,
  silverTheme,
  pinkTheme,
  mintTheme,
  colors,
};
