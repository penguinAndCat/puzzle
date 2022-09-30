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
};

type ModalProps = {
  modalDisplay: boolean;
  modalImage: img;
  number: number;
  title: string;
  onModal: () => void;
  offModal: () => void;
  setModalImage: (value: img) => void;
  initialModalImage: () => void;
  setNumber: (value: number) => void;
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
