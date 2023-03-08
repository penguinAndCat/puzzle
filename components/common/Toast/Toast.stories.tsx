import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import Toast from '.';
import { useToast } from 'hooks/views/useToast';
import ToastList from './ToastList';
import { Button } from '../Button';

export default {
  title: 'Components/Toast',
  component: Toast,
  decorators: [
    (StoryFn) => {
      return <StoryFn />;
    },
  ],
} as ComponentMeta<typeof Toast>;

const Template: ComponentStory<typeof Toast> = (args) => <Toast {...args} />;

export const Default = Template.bind({});
Default.args = {
  nickname: '고양이다요',
  content: '님이 퍼즐 방에 초대되었습니다.',
  type: 'info',
  animation: false,
};

const ToastListTemplate: ComponentStory<typeof Toast> = (args) => {
  const toast = useToast();
  return (
    <>
      <Button onClick={() => toast(args)}>useToast</Button>
      <ToastList />
    </>
  );
};
export const ToastListView = ToastListTemplate.bind({});
ToastListView.args = {
  nickname: '고양이다요',
  content: '님이 퍼즐 방에 초대되었습니다.',
  type: 'info',
};
