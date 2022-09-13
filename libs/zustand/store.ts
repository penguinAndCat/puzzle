import create from 'zustand';

export const useModal = create<ModalProps>((set) => ({
  modalDisplay: false,
  modalImage: { src: '', width: 0, height: 0 },
  offModal: () => set({ modalDisplay: false }),
  onModal: () => set({ modalDisplay: true }),
  setModalImage: (image) => set({ modalImage: image }),
  initialModalImage: () => set({ modalImage: { src: '', width: 0, height: 0 } }),
}));
