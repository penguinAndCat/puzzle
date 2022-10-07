import create from 'zustand';
import { persist } from 'zustand/middleware';

export const useModal = create<ModalProps>()(
  persist(
    (set) => ({
      modalDisplay: false,
      modalImage: { src: '', width: 0, height: 0 },
      number: 1,
      title: '',
      secretRoom: false,
      offModal: () => set({ modalDisplay: false }),
      onModal: () => set({ modalDisplay: true }),
      setModalImage: (image) => set({ modalImage: image }),
      initialModal: () =>
        set({ number: 1, title: '', secretRoom: false, modalImage: { src: '', width: 0, height: 0 } }),
      setNumber: (number) => set({ number: number }),
      setSecretRoom: (value) => set({ secretRoom: value }),
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
