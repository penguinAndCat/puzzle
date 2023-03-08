import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Button } from '.';

export default {
  title: 'Components/Button',
  component: Button,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof Button>;

const Template: ComponentStory<typeof Button> = (args) => <Button {...args} />;

export const Default = Template.bind({});
Default.parameters = {
  theme: 'pink',
};
Default.args = {
  label: 'button',
  buttonType: 'default',
};

// export const PinkTheme = Template.bind({});
// PinkTheme.args = Default.args;
// PinkTheme.parameters = {
//   theme: 'pink',
// };

// export const MintTheme = Template.bind({});
// MintTheme.args = Default.args;
// MintTheme.parameters = {
//   theme: 'mint',
// };
