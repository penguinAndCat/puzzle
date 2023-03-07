import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { invitedUsers } from '.mocks/api/users/friends';
import ModalContainer from '../ModalLayout/ModalContainer';
import View from './View';

export default {
  title: 'Common/Modal/InvitedUserModal',
  component: View,
  decorators: [
    (StoryFn) => {
      return (
        <ModalContainer title={'Participants'} content={'invitedUser'} story={true}>
          <StoryFn />
        </ModalContainer>
      );
    },
  ],
} as ComponentMeta<typeof View>;

const Template: ComponentStory<typeof View> = () => <View invitedUser={invitedUsers.data} requestFriend={() => {}} />;

export const Default = Template.bind({});
