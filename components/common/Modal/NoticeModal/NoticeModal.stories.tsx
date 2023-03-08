import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import View from './View';
import ModalContainer from '../ModalLayout/ModalContainer';
import { notices } from '.mocks/api/users/notices';

export default {
  title: 'Components/Modal/NoticeModal',
  component: View,
  decorators: [
    (StoryFn) => {
      return (
        <ModalContainer title={'Notice'} content={'notice'} story={true}>
          <StoryFn />
        </ModalContainer>
      );
    },
  ],
} as ComponentMeta<typeof View>;

const Template: ComponentStory<typeof View> = () => (
  <View
    notice={notices.notice}
    acceptFriend={() => {}}
    rejectFriend={() => {}}
    acceptInvite={() => {}}
    rejectInvite={() => {}}
  />
);

export const Default = Template.bind({});

const NoDataTemplate: ComponentStory<typeof View> = () => (
  <View acceptFriend={() => {}} rejectFriend={() => {}} acceptInvite={() => {}} rejectInvite={() => {}} />
);

export const NoData = NoDataTemplate.bind({});
