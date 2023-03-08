import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import PuzzleModal from '.';
import ModalContainer from '../ModalLayout/ModalContainer';

export default {
  title: 'Components/Modal/PuzzleModal',
  component: PuzzleModal,
  decorators: [
    (StoryFn) => {
      return (
        <>
          <div id="modal-root" />
          <ModalContainer title={'Create'} content={'puzzle'} story={true}>
            <StoryFn />
          </ModalContainer>
        </>
      );
    },
  ],
} as ComponentMeta<typeof PuzzleModal>;

const Template: ComponentStory<typeof PuzzleModal> = () => <PuzzleModal />;

export const Default = Template.bind({});
Default.parameters = {};
