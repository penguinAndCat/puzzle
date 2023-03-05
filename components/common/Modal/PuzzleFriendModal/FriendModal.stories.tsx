import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import PuzzleFriendModal from '.';
import ModalLayout from '../ModalLayout';
import { handlers } from '.mocks/handlers';
import { puzzleId } from '.mocks/api/users/friends';

export default {
  title: 'Common/Modal/PuzzleFriendModal',
  component: PuzzleFriendModal,
  decorators: [
    (StoryFn) => {
      return (
        <>
          <div id="modal-root" />
          <ModalLayout title={'Friend'} content={'puzzleFriend'}>
            <StoryFn />
          </ModalLayout>
        </>
      );
    },
  ],
} as ComponentMeta<typeof PuzzleFriendModal>;

const Template: ComponentStory<typeof PuzzleFriendModal> = () => <PuzzleFriendModal />;

export const Default = Template.bind({});
Default.parameters = {
  msw: handlers,
  nextRouter: {
    query: {
      id: puzzleId,
    },
  },
};

export const NoData = Template.bind({});
