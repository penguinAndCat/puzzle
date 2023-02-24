import { ThemeProvider } from 'styled-components';
import { initialize, mswDecorator } from 'msw-storybook-addon';
import { silverTheme, darkTheme, pinkTheme, mintTheme } from '../libs/theme/theme';
import { GlobalStyle } from './GlobalStyle';
import { RouterContext } from 'next/dist/shared/lib/router-context';
import { QueryClient, QueryClientProvider } from 'react-query';

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
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={themeObject}>
        <StoryFn />
        <GlobalStyle />
      </ThemeProvider>
    </QueryClientProvider>
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
  nextRouter: {
    Provider: RouterContext.Provider,
    locale: 'en', // optional
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
