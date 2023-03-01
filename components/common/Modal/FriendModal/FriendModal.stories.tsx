import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import FriendModal from '.';
import ModalLayout from '../ModalLayout';
import { handlers } from '.mocks/handlers';
import SearchFriend from './Search';

export default {
  title: 'Common/Modal/FriendModal',
  component: FriendModal,
  decorators: [
    (StoryFn) => {
      return (
        <>
          <div id="modal-root" />
          <ModalLayout content={'friend'}>
            <StoryFn />
          </ModalLayout>
        </>
      );
    },
  ],
} as ComponentMeta<typeof FriendModal>;

const Template: ComponentStory<typeof FriendModal> = () => (
  <FriendModal>
    <SearchFriend />
  </FriendModal>
);

export const Default = Template.bind({});
Default.parameters = {
  msw: handlers,
};

const SearchUserTemplate: ComponentStory<typeof FriendModal> = () => (
  <FriendModal>
    <SearchFriend
      picture="http://res.cloudinary.com/penguinandcatpuzzle/image/upload/v1672831380/jtguoogjwszywocyeb8o.jpg"
      nickname="네이버2"
    />
  </FriendModal>
);

export const SearchUser = SearchUserTemplate.bind({});
SearchUser.parameters = {
  msw: handlers,
};

export const NoData = Template.bind({});
