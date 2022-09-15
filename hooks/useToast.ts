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
          content: '',
          duration: 0,
          top: 0,
          bottom: 0,
        }),
      2000 + (toastProps.duration ?? 700)
    );
  };
  return { toast, fireToast };
};
