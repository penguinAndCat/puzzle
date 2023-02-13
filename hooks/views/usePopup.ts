import { useEffect } from 'react';
import useDebounce from 'hooks/utils/useDebounce';
import { usePopupState } from 'libs/zustand/store';

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
