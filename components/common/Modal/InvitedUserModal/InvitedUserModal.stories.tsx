import React, { useEffect } from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import InvitedUserModal from '.';
import ModalLayout from '../ModalLayout';
import { handlers } from '.mocks/handlers';
import { useModal, userStore } from 'libs/zustand/store';
import { puzzleId, user } from '.mocks/api/users/friends';

export default {
  title: 'Common/Modal/InvitedUserModal',
  component: InvitedUserModal,
  decorators: [
    (StoryFn) => {
      const { setUser } = userStore();
      const { setPuzzleId } = useModal();
      useEffect(() => {
        setUser(user);
        setPuzzleId(puzzleId);
      }, []);
      return (
        <>
          <div id="modal-root" />
          <ModalLayout content={'invitedUser'}>
            <StoryFn />
          </ModalLayout>
        </>
      );
    },
  ],
} as ComponentMeta<typeof InvitedUserModal>;

const Template: ComponentStory<typeof InvitedUserModal> = () => <InvitedUserModal />;

export const Default = Template.bind({});
Default.parameters = {
  msw: handlers,
};
