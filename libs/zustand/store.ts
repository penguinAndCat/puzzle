import create from 'zustand';
import { persist } from 'zustand/middleware';

export const useModal = create<ModalProps>()(
  persist(
    (set) => ({
      modalDisplay: false,
      modalImage: { src: '', width: 0, height: 0 },
      number: 1,
      title: '',
      offModal: () => set({ modalDisplay: false }),
      onModal: () => set({ modalDisplay: true }),
      setModalImage: (image) => set({ modalImage: image }),
      initialModalImage: () => set({ modalImage: { src: '', width: 0, height: 0 } }),
      setNumber: (number) => set({ number: number }),
      setTitle: (title) => set({ title: title }),
    }),
    {
      name: 'modal',
    }
  )
);

export const useToastState = create<ToastProps>((set) => ({
  toast: {
    id: '',
    content: '',
    duration: 0,
    top: 0,
    bottom: 0,
  },
  setToast: (toast) => set({ toast: toast }),
}));
