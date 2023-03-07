import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import PuzzleModal from '.';
import ModalLayout from '../ModalLayout';

export default {
  title: 'Common/Modal/PuzzleModal',
  component: PuzzleModal,
  decorators: [
    (StoryFn) => {
      return (
        <>
          <div id="modal-root" />
          <ModalLayout title={'Create'} content={'puzzle'}>
            <StoryFn />
          </ModalLayout>
        </>
      );
    },
  ],
} as ComponentMeta<typeof PuzzleModal>;

const Template: ComponentStory<typeof PuzzleModal> = () => <PuzzleModal />;

export const Default = Template.bind({});
Default.parameters = {};
