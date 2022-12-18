import create from 'zustand';
import { persist } from 'zustand/middleware';

export const useModal = create<ModalProps>()((set) => ({
  modalDisplay: false,
  modal: [],
  addModal: (value) => {
    set((state) => ({
      modal: [...state.modal, value],
    }));
  },
  removeModal: (value) => {
    set((state) => ({
      modal: state.modal.filter((modal: string) => modal !== value),
    }));
  },
}));

export const usePuzzle = create<PuzzleProps>()(
  persist(
    (set) => ({
      modalImage: { src: '', width: 0, height: 0 },
      number: 1,
      title: '',
      secretRoom: false,
      setModalImage: (image) => set({ modalImage: image }),
      initialModal: () =>
        set({ number: 1, title: '', secretRoom: false, modalImage: { src: '', width: 0, height: 0 } }),
      setNumber: (number) => set({ number: number }),
      setSecretRoom: (value) => set({ secretRoom: value }),
      setTitle: (title) => set({ title: title }),
    }),
    {
      name: 'puzzle',
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

export const useLoading = create<LoadingProps>((set) => ({
  loading: false,
  offLoading: () => set({ loading: false }),
  onLoading: () => set({ loading: true }),
}));

export const userStore = create<UserStoreProps>((set) => ({
  user: null,
  setUser: (user: UserInfo | null) => set({ user: user }),
}));

export const useSocket = create<SocketProps>((set) => ({
  participants: [],
  setParticipant: (value) => {
    set(() => ({
      participants: value,
    }));
  },
  addParticipant: (value) => {
    set((state) => ({
      participants: [...state.participants, value],
    }));
  },
  removeParticipant: (value) => {
    set((state) => ({
      participants: state.participants.filter((participants: string) => participants !== value),
    }));
  },
}));
