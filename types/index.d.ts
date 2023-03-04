type shape = {
  rightTab: number | undefined;
  leftTab: number | undefined;
  topTab: number | undefined;
  bottomTab: number | undefined;
};

type img = {
  src: string;
  width: number;
  height: number;
};

type size = {
  width: number;
  height: number;
};

type position = {
  x: number;
  y: number;
};

type index = number | undefined;

type Config = {
  imgWidth: number;
  imgHeight: number;
  tilesPerRow: number;
  tilesPerColumn: number;
  tileWidth: number;
  tileHeight: number;
  groupTiles: any[];
  shapes: shape[];
  project: any;
  puzzleImage: img;
  groupCheck: boolean;
  canvasSize: size;
  canvasPreSize: size;
  complete: boolean;
};

type ModalProps = {
  modalDisplay: boolean;
  modal: string[];
  puzzleId: string;
  profileImg: string;
  croppedImg: string;
  addModal: (value: string) => void;
  removeModal: (value: string) => void;
  setPuzzleId: (value: string) => void;
  setProfileImg: (value: string) => void;
  setCroppedImg: (value: string) => void;
};

type PuzzleProps = {
  modalImage: img;
  number: number;
  title: string;
  secretRoom: boolean;
  firstRender: boolean;
  setModalImage: (value: img) => void;
  initialModal: () => void;
  setNumber: (value: number) => void;
  setSecretRoom: (value: boolean) => void;
  setTitle: (value: string) => void;
  setFirstRender: (value: boolean) => void;
};

interface Toast {
  nickname?: string;
  content: string;
  type: 'success' | 'warning' | 'info';
}

type ToastProps = {
  toast: Toast[];
  addToast: (data: Toast) => void;
  removeToast: () => void;
};

interface PopupType {
  nickname: string;
  picture: string;
  content: string;
  noticeId: string;
  type: 'friend' | 'puzzle';
  puzzleId?: string;
}

type NotificationProps = {
  popup: PopupType[];
  addPopup: (data: PopupType) => void;
  removePopup: () => void;
  removeOnePopup: (id: string) => void;
};

interface LoadingContent {
  first: string;
  second: string;
}

type LoadingProps = {
  loading: boolean;
  content: LoadingContent;
  offLoading: () => void;
  onLoading: (content: LoadingContent) => void;
};

type RoomInfo = {
  title: string;
  secretRoom: boolean;
  level: number;
};

type UserInfo = {
  id: string;
  name: string;
  email: string;
  provider: string;
  nickname: string;
  picture: string;
};

type UserStoreProps = {
  user: userInfo | null;
  setUser: (user: userInfo | null) => void;
};

type SocketProps = {
  participants: string[];
  setParticipant: (value: string[]) => void;
  addParticipant: (value: string) => void;
  removeParticipant: (value: string) => void;
};

type Area = {
  width: number;
  height: number;
  x: number;
  y: number;
};
