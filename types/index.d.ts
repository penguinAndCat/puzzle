type shape = {
  rightTab: number | undefined;
  leftTab: number | undefined;
  topTab: number | undefined;
  bottomTab: number | undefined;
};

type Config = {
  originHeight: number;
  originWidth: number;
  imgWidth: number;
  imgHeight: number;
  tilesPerRow: number;
  tilesPerColumn: number;
  tileWidth: number;
  imgName: String;
  groupTiles: any[];
  shapes: shape[];
  tiles: any[];
  project: any;
  puzzleImage: any;
  tileIndexes: any[];
  groupArr: any[];
};
