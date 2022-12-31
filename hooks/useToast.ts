import { useToastState } from 'libs/zustand/store';
import { useEffect } from 'react';
import useDebounce from './useDebounce';

export const useToast = () => {
  const { toast, addToast, removeToast } = useToastState();
  const toastData = useDebounce<Toast[]>(toast, 3000);

  const handleToast = (option: Toast) => {
    addToast(option);
  };

  useEffect(() => {
    toastData.forEach(() => {
      removeToast();
    });
  }, [removeToast, toastData]);

  return handleToast;
};
