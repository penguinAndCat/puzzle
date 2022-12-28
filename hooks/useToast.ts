import { useToastState } from 'libs/zustand/store';

export const useToast = () => {
  const { setToast, toast } = useToastState();
  const fireToast = (toastProps: Toast) => {
    if (toast.content !== '') return;
    setToast(toastProps);
    setTimeout(
      () =>
        setToast({
          id: '',
          nickname: '',
          content: '',
          duration: 0,
          top: 0,
          left: 0,
        }),
      2000 + (toastProps.duration ?? 700)
    );
  };
  return { toast, fireToast };
};
