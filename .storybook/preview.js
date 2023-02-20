import { ThemeProvider } from 'styled-components';
import { silverTheme, darkTheme, pinkTheme, mintTheme } from '../libs/theme/theme';

const THEME = {
  pink: pinkTheme,
  dark: darkTheme,
  silver: silverTheme,
  mint: mintTheme,
};

const withTheme = (StoryFn, context) => {
  const theme = context.globals.theme || context.parameters.theme;
  const themeObject = THEME[theme];
  return (
    <ThemeProvider theme={themeObject}>
      <StoryFn />
    </ThemeProvider>
  );
};

// export all decorators that should be globally applied in an array
export const decorators = [withTheme];

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};

export const globalTypes = {
  theme: {
    name: 'Theme',
    description: 'Global theme for components',
    defaultValue: 'pink',
    toolbar: {
      // The icon for the toolbar item
      icon: 'circlehollow',
      // Array of options
      items: [
        { value: 'pink', icon: 'circle', title: 'pink' },
        { value: 'mint', icon: 'circle', title: 'mint' },
        { value: 'dark', icon: 'circle', title: 'dark' },
        { value: 'silver', icon: 'circle', title: 'silver' },
      ],
      // Property that specifies if the name of the item will be displayed
      showName: true,
    },
  },
};
