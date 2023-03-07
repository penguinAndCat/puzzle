import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import LoginModal from '.';
import ModalContainer from '../ModalLayout/ModalContainer';

export default {
  title: 'Common/Modal/LoginModal',
  component: LoginModal,
  decorators: [
    (StoryFn) => {
      return (
        <ModalContainer title={'Login'} content={'login'} width={240} height={220} story={true}>
          <StoryFn />
        </ModalContainer>
      );
    },
  ],
} as ComponentMeta<typeof LoginModal>;

const Template: ComponentStory<typeof LoginModal> = () => <LoginModal />;

export const Default = Template.bind({});
Default.parameters = {};
