import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import LoginModal from '.';
import ModalLayout from '../ModalLayout';

export default {
  title: 'Common/Modal/LoginModal',
  component: LoginModal,
  decorators: [
    (StoryFn) => {
      return (
        <>
          <div id="modal-root" />
          <ModalLayout content={'puzzle'}>
            <StoryFn />
          </ModalLayout>
        </>
      );
    },
  ],
} as ComponentMeta<typeof LoginModal>;

const Template: ComponentStory<typeof LoginModal> = () => <LoginModal />;

export const Default = Template.bind({});
Default.parameters = {};
