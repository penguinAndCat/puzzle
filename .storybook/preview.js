import { ThemeProvider } from 'styled-components';
import { silverTheme, darkTheme, pinkTheme, mintTheme } from '../libs/theme/theme';
import { initialize, mswDecorator } from 'msw-storybook-addon';
import { GlobalStyle } from './GlobalStyle';

// Initialize MSW
initialize();

if (typeof global.process === 'undefined') {
  const { worker } = require('../.mocks/browser');
  worker.start();
}

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
      <GlobalStyle />
    </ThemeProvider>
  );
};

export const decorators = [withTheme, mswDecorator];

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
