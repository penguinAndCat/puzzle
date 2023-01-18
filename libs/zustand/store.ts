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
      firstRender: true,
      setModalImage: (image) => set({ modalImage: image }),
      initialModal: () =>
        set({ number: 1, title: '', secretRoom: false, modalImage: { src: '', width: 0, height: 0 } }),
      setNumber: (number) => set({ number: number }),
      setSecretRoom: (value) => set({ secretRoom: value }),
      setTitle: (title) => set({ title: title }),
      setFirstRender: (value) => set({ firstRender: value }),
    }),
    {
      name: 'puzzle',
    }
  )
);

export const useToastState = create<ToastProps>((set) => ({
  toast: [],
  addToast: (data) =>
    set((state) => ({
      toast: [...state.toast, data],
    })),
  removeToast: () =>
    set((state) => ({
      toast: state.toast.filter((item, index) => index !== 0),
    })),
}));

export const useNotificationState = create<NotificationProps>((set) => ({
  notification: [],
  addNotification: (data) =>
    set((state) => ({
      notification: [...state.notification, data],
    })),
  removeNotification: () =>
    set((state) => ({
      notification: state.notification.filter((item, index) => index !== 0),
    })),
  removeOneNotification: (id: string) =>
    set((state) => ({
      notification: state.notification.filter((item) => item.noticeId !== id),
    })),
}));

export const useLoading = create<LoadingProps>((set) => ({
  loading: false,
  content: { first: '', second: '' },
  offLoading: () => set({ loading: false }),
  onLoading: (content) => set({ loading: true, content: content }),
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
