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
  firstClient: boolean;
  canvasSize: size;
  canvasPreSize: size;
  complete: boolean;
};

type ModalProps = {
  modalDisplay: boolean;
  modal: string[];
  addModal: (value: string) => void;
  removeModal: (value: string) => void;
};

type PuzzleProps = {
  modalImage: img;
  number: number;
  title: string;
  secretRoom: boolean;
  setModalImage: (value: img) => void;
  initialModal: () => void;
  setNumber: (value: number) => void;
  setSecretRoom: (value: boolean) => void;
  setTitle: (value: string) => void;
};

interface Toast {
  id?: string;
  content: string;
  duration?: number;
  top?: number;
  bottom?: number;
}

type ToastProps = {
  toast: Toast;
  setToast: (value: Toast) => void;
};

type LoadingProps = {
  loading: boolean;
  offLoading: () => void;
  onLoading: () => void;
};
type userInfo = {
  id: string;
  name: string;
  email: string;
  provider: string;
  nickname: string;
  picture: string;
};
type userStoreProps = {
  user: userInfo | null;
  setUser: (user: userInfo | null) => void;
};

type SocketProps = {
  participants: string[];
  setParticipant: (value: string[]) => void;
  addParticipant: (value: string) => void;
  removeParticipant: (value: string) => void;
};