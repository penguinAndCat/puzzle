import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import View from './View';
import ModalContainer from '../ModalLayout/ModalContainer';
import { puzzleFriends } from '.mocks/api/users/friends';

export default {
  title: 'Common/Modal/PuzzleFriendModal',
  component: View,
  decorators: [
    (StoryFn) => {
      return (
        <ModalContainer title={'Friend'} content={'puzzleFriend'} story={true}>
          <StoryFn />
        </ModalContainer>
      );
    },
  ],
} as ComponentMeta<typeof View>;

const Template: ComponentStory<typeof View> = () => (
  <View puzzleFriend={puzzleFriends.friends} inviteFriend={() => {}} />
);

export const Default = Template.bind({});

const NoDataTemplate: ComponentStory<typeof View> = () => <View inviteFriend={() => {}} />;

export const NoData = NoDataTemplate.bind({});
