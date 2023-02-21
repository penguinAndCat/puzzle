import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import FriendModal from '.';
import ModalLayout from '../ModalLayout';
import { handlers } from '.mocks/handlers';

export default {
  title: 'Common/Modal/FriendModal',
  component: FriendModal,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof FriendModal>;

const Template: ComponentStory<typeof FriendModal> = () => (
  <>
    <div id="modal-root" />
    <ModalLayout content={'friend'}>
      <FriendModal />
    </ModalLayout>
  </>
);

export const Default = Template.bind({});
Default.parameters = {
  theme: 'pink',
  msw: handlers,
};
Default.args = {};

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
