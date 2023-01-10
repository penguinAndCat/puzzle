import { getCookie } from 'cookies-next';

const pixelToRem = (size: number) => `${size / 16}rem`;

const fontSizes = {
  title: pixelToRem(60),
  subtitle: pixelToRem(30),
  paragraph: pixelToRem(18),
};

const colors = {
  dark: 'rgb(43, 42, 43)', // #2b2a2b
  mint: 'rgb(3, 219, 164)', // #03dba4
  pink: 'rgb(255, 192, 203)', // #ffc0cb
  silver: 'rgb(233, 230, 228)', // #e9e6e4
  white: 'rgb(255, 255, 255)', // #ffffff
  black: 'rgb(0, 0, 0)', // #000000
  similarDark: ['#655E4D', '#FFFFFF', '#D96907'],
  similarMint: ['#085CA6', '#069DBF', '#ACF2DE'],
  similarPink: ['#F28DB2', '#F26716', '#F27979'],
  similarSilver: ['#0E2440', '#010D00', '#594239'],
  similarWhite: ['#91AA9D', '#3E606F', '#193441'],
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
  profileColor: colors.silver,
  profileTextColor: colors.dark,
  loadingColor1: colors.similarSilver[0],
  loadingColor2: colors.similarSilver[1],
  loadingColor3: colors.similarSilver[2],
  paletteColor: colors.dark,
  paletteBgColor: colors.silver,
};

export const darkTheme: Theme = {
  bgColor: colors.dark,
  textColor: colors.white,
  borderColor: `solid ${colors.dark}`,
  headerColor: colors.white,
  headerTextColor: colors.dark,
  modalColor: colors.dark,
  modalTextColor: colors.white,
  profileColor: colors.dark,
  profileTextColor: colors.white,
  loadingColor1: colors.similarDark[0],
  loadingColor2: colors.similarDark[1],
  loadingColor3: colors.similarDark[2],
  paletteColor: colors.dark,
  paletteBgColor: colors.white,
};

export const pinkTheme: Theme = {
  bgColor: colors.pink,
  textColor: colors.white,
  borderColor: `solid ${colors.pink}`,
  headerColor: colors.white,
  headerTextColor: colors.pink,
  modalColor: colors.white,
  modalTextColor: colors.pink,
  profileColor: colors.pink,
  profileTextColor: colors.white,
  loadingColor1: colors.similarPink[0],
  loadingColor2: colors.similarPink[1],
  loadingColor3: colors.similarPink[2],
  paletteColor: colors.pink,
  paletteBgColor: colors.white,
};

export const mintTheme: Theme = {
  bgColor: colors.mint,
  textColor: colors.white,
  borderColor: `solid ${colors.mint}`,
  headerColor: colors.white,
  headerTextColor: colors.mint,
  modalColor: colors.white,
  modalTextColor: colors.mint,
  profileColor: colors.mint,
  profileTextColor: colors.white,
  loadingColor1: colors.similarMint[0],
  loadingColor2: colors.similarMint[1],
  loadingColor3: colors.similarMint[2],
  paletteColor: colors.mint,
  paletteBgColor: colors.white,
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

const THEME: {
  [key in string]: {
    backgroundColor: string;
    color: string;
    hover: string;
  };
} = {
  pink: {
    backgroundColor: 'rgb(255, 192, 203)',
    color: 'rgb(255, 255, 255)',
    hover: 'rgb(245, 182, 193)',
  },
  dark: {
    backgroundColor: 'rgb(43, 42, 43)',
    color: 'rgb(255, 255, 255)',
    hover: 'rgb(33, 32, 33)',
  },
  silver: {
    backgroundColor: 'rgb(233, 230, 228)',
    color: 'rgb(43, 42, 43)',
    hover: 'rgb(223, 220, 218)',
  },
  mint: {
    backgroundColor: 'rgb(3, 219, 164)',
    color: 'rgb(255, 255, 255)',
    hover: 'rgb(0, 209, 154)',
  },
};

const THEME_ARRAY = ['pink', 'dark', 'mint', 'silver'];

export const getTheme = () => {
  let localTheme: any = getCookie('localTheme');
  if (!THEME_ARRAY.includes(localTheme)) localTheme = 'pink';
  return THEME[localTheme];
};
