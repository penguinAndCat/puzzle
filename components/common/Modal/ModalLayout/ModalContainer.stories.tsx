import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import ModalLayout from '.';

export default {
  title: 'Components/Modal/ModalLayout',
  component: ModalLayout,
  decorators: [
    (StoryFn) => {
      return (
        <>
          <div id="modal-root" />
          <StoryFn />
        </>
      );
    },
  ],
} as ComponentMeta<typeof ModalLayout>;

const Template: ComponentStory<typeof ModalLayout> = (args) => <ModalLayout {...args} />;

export const Default = Template.bind({});
Default.args = {
  title: 'Title',
  content: 'content',
  width: 300,
  height: 400,
};
