import React, { useEffect } from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import CropImageModal from '.';
import ModalContainer from '../ModalLayout/ModalContainer';
import { useModal } from 'libs/zustand/store';

export default {
  title: 'Common/Modal/CropImageModal',
  component: CropImageModal,
  decorators: [
    (StoryFn) => {
      const { setProfileImg } = useModal();
      useEffect(() => {
        setProfileImg(
          'http://res.cloudinary.com/penguinandcatpuzzle/image/upload/v1672831380/jtguoogjwszywocyeb8o.jpg'
        );
      }, []);
      return (
        <ModalContainer title={'CropImage'} content={'cropImage'} story={true}>
          <StoryFn />
        </ModalContainer>
      );
    },
  ],
} as ComponentMeta<typeof CropImageModal>;

const Template: ComponentStory<typeof CropImageModal> = () => <CropImageModal />;

export const Default = Template.bind({});
Default.parameters = {};
