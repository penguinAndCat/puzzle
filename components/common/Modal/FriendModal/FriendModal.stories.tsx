import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import View from './View';
import { friends } from '.mocks/api/users/friends';
import SearchFriend from './Search';
import ModalContainer from '../ModalLayout/ModalContainer';

export default {
  title: 'Components/Modal/FriendModal',
  component: View,
  decorators: [
    (StoryFn) => {
      return (
        <ModalContainer title={'Friend'} content={'friend'} story={true}>
          <StoryFn />
        </ModalContainer>
      );
    },
  ],
} as ComponentMeta<typeof View>;

const Template: ComponentStory<typeof View> = () => (
  <View friends={friends.friends} deleteFriend={() => {}}>
    <SearchFriend />
  </View>
);

export const Default = Template.bind({});

const SearchUserTemplate: ComponentStory<typeof View> = () => (
  <View friends={friends.friends} deleteFriend={() => {}}>
    <SearchFriend
      picture="http://res.cloudinary.com/penguinandcatpuzzle/image/upload/v1672831380/jtguoogjwszywocyeb8o.jpg"
      nickname="네이버2"
    />
  </View>
);

export const SearchUser = SearchUserTemplate.bind({});

const NoDataTemplate: ComponentStory<typeof View> = () => (
  <View deleteFriend={() => {}}>
    <SearchFriend />
  </View>
);

export const NoData = NoDataTemplate.bind({});
