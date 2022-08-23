type shape = {
  rightTab: number | undefined;
  leftTab: number | undefined;
  topTab: number | undefined;
  bottomTab: number | undefined;
};

type img = {
  src: string | Blob;
  width: number;
  height: number;
};

type index = number | undefined;

type Config = {
  imgWidth: number;
  imgHeight: number;
  tilesPerRow: number;
  tilesPerColumn: number;
  tileWidth: number;
  groupTiles: any[];
  shapes: shape[];
  tiles: any[];
  project: any;
  puzzleImage: img;
  tileIndexes: any[];
  groupArr: any[];
  groupCheck: boolean;
  firstClient: boolean;
};
