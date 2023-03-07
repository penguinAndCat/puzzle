import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import NoticeModal from '.';
import ModalLayout from '../ModalLayout';
import { handlers } from '.mocks/handlers';

export default {
  title: 'Common/Modal/NoticeModal',
  component: NoticeModal,
  decorators: [
    (StoryFn) => {
      return (
        <>
          <div id="modal-root" />
          <ModalLayout title={'Notice'} content={'notice'}>
            <StoryFn />
          </ModalLayout>
        </>
      );
    },
  ],
} as ComponentMeta<typeof NoticeModal>;

const Template: ComponentStory<typeof NoticeModal> = () => <NoticeModal />;

export const Default = Template.bind({});
Default.parameters = {
  msw: handlers,
};

export const NoData = Template.bind({});
