import { usePopupState } from 'libs/zustand/store';
import { useEffect } from 'react';
import useDebounce from './useDebounce';

export const usePopup = () => {
  const { popup, addPopup, removePopup } = usePopupState();
  const popupData = useDebounce<PopupType[]>(popup, 60000);

  const handleToast = (option: PopupType) => {
    addPopup(option);
  };

  useEffect(() => {
    popupData.forEach(() => {
      removePopup();
    });
  }, [removePopup, popupData]);

  return handleToast;
};
