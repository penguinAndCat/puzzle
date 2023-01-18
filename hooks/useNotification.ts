import { useNotificationState } from 'libs/zustand/store';
import { useEffect } from 'react';
import useDebounce from './useDebounce';

export const useNotification = () => {
  const { notification, addNotification, removeNotification } = useNotificationState();
  const notificationData = useDebounce<NotificationType[]>(notification, 1500000);

  const handleToast = (option: NotificationType) => {
    addNotification(option);
  };

  useEffect(() => {
    notificationData.forEach(() => {
      removeNotification();
    });
  }, [removeNotification, notificationData]);

  return handleToast;
};
