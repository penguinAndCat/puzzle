const path = require('path');

module.exports = {
  stories: [
    '../stories/**/*.stories.mdx',
    '../stories/**/*.stories.@(js|jsx|ts|tsx)',
    '../components/common/**/*.stories.@(js|jsx|ts|tsx)',
  ],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials', '@storybook/addon-interactions'],
  framework: '@storybook/react',
  webpackFinal: async (config) => {
    config.resolve.modules = [path.resolve(__dirname, '..'), 'node_modules', 'styles'];
    config.resolve.alias = {
      ...config.resolve.alias,
      // 절대 경로 추가
      apis: path.resolve(__dirname, '../apis'),
      components: path.resolve(__dirname, '../components'),
      config: path.resolve(__dirname, '../config'),
      hooks: path.resolve(__dirname, '../hooks'),
      libs: path.resolve(__dirname, '../libs'),
      public: path.resolve(__dirname, '../public'),
      mocks: path.resolve(__dirname, '../.mocks'),
      styles: path.resolve(__dirname, '../styles'),
    };
    return config;
  },
};
