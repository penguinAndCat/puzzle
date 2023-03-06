import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import Popup from '.';
import { usePopup } from 'hooks/views/usePopup';
import PopupList from './PopupList';
import { Button } from '../Button';

export default {
  title: 'Common/Popup',
  component: Popup,
  decorators: [
    (StoryFn) => {
      return <StoryFn />;
    },
  ],
} as ComponentMeta<typeof Popup>;

const Template: ComponentStory<typeof Popup> = (args) => <Popup {...args} />;

export const Default = Template.bind({});
Default.args = {
  nickname: '고양이다요',
  content: `저랑 친구하실래요?`,
  picture: 'http://res.cloudinary.com/penguinandcatpuzzle/image/upload/v1672831380/jtguoogjwszywocyeb8o.jpg',
  type: 'friend',
  animation: false,
};

const PopupListTemplate: ComponentStory<typeof Popup> = (args) => {
  const popup = usePopup();
  return (
    <>
      <Button onClick={() => popup(args)}>usePopup</Button>
      <PopupList />
    </>
  );
};
export const PopupListView = PopupListTemplate.bind({});
PopupListView.args = {
  nickname: '고양이다요',
  content: `저랑 친구하실래요?`,
  picture: 'http://res.cloudinary.com/penguinandcatpuzzle/image/upload/v1672831380/jtguoogjwszywocyeb8o.jpg',
  noticeId: Math.random().toString(36).substring(2, 11),
  type: 'friend',
};
