import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import Card from '.';
import CardSkeleton from './CardSkeleton';

export default {
  title: 'Common/Card',
  component: Card,
} as ComponentMeta<typeof Card>;

const Template: ComponentStory<typeof Card> = (args) => <Card {...args} />;

export const Default = Template.bind({});
Default.args = {
  src: 'http://res.cloudinary.com/penguinandcatpuzzle/image/upload/v1672831380/jtguoogjwszywocyeb8o.jpg',
  progress: 100,
  title: '퍼즐 제목의 길이를 아주 많이 늘려보자.',
  puzzleId: Math.random().toString(36).substring(2, 11),
  isPrivate: true,
  isMain: false,
  puzzleNumber: 100,
  width: 250,
};
Default.argTypes = {
  progress: {
    control: {
      type: 'range',
      min: 0,
      max: 100,
      step: 1,
    },
  },
  width: {
    control: {
      type: 'range',
      min: 160,
      max: 250,
      step: 1,
    },
  },
};

const SkeletonTemplate: ComponentStory<typeof Card> = (args) => <CardSkeleton {...args} />;

export const Skeleton = SkeletonTemplate.bind({});
Skeleton.args = {
  width: 250,
  isPrivate: true,
};
Skeleton.argTypes = {
  width: {
    control: {
      type: 'range',
      min: 160,
      max: 250,
      step: 1,
    },
  },
};
