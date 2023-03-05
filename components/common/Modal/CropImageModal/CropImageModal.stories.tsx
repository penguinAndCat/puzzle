import React, { useEffect } from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import CropImageModal from '.';
import ModalLayout from '../ModalLayout';
import { useModal } from 'libs/zustand/store';

export default {
  title: 'Common/Modal/CropImageModal',
  component: CropImageModal,
  decorators: [
    (StoryFn) => {
      const { setProfileImg } = useModal();
      useEffect(() => {
        setProfileImg('/cp.png');
      }, []);
      return (
        <div>
          <div id="modal-root" />
          <ModalLayout title={'CropImage'} content={'cropImage'}>
            <StoryFn />
          </ModalLayout>
        </div>
      );
    },
  ],
} as ComponentMeta<typeof CropImageModal>;

const Template: ComponentStory<typeof CropImageModal> = () => <CropImageModal />;

export const Default = Template.bind({});
Default.parameters = {};
