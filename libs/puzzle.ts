import Paper from 'paper';

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
  shapes: any[];
  tiles: any[];
  project: typeof Paper;
  puzzleImage: any;
  tileIndexes: any[];
  groupArr: any[];
};

const moveTile = (config: Config) => {
  config.tiles.forEach((tile, index) => {
    tile.onMouseDown = (event: any) => {
      console.log('down', event);
    };
    tile.onMouseDrag = (event: any) => {
      console.log('drag', event);
      tile.position.x += event.delta.x;
      tile.position.y += event.delta.y;
    };
    tile.onMouseUp = (event: any) => {
      console.log('up', event);
    };
  });
};

const puzzle = {
  moveTile,
};

export default puzzle;
