import { getMargin } from './createPuzzle';

const moveTile = (config: Config) => {
  console.log('tiles', config.tiles);
  config.groupTiles.forEach((tiles, index) => {
    tiles[0].onMouseDown = (event: any) => {
      // console.log('group', config.groupTiles);
      // console.log('down', event.target);
      // config.project.project.activeLayer.addChild(tiles[0]);
    };
    tiles[0].onMouseDrag = (event: any) => {
      tiles[0].position.x += event.delta.x;
      tiles[0].position.y += event.delta.y;
    };
    tiles[0].onMouseUp = (event: any) => {
      fitTile(config, tiles[0]);
    };
    // console.log('tile', tiles);
  });
};

const fitTile = (config: Config, currentTile: any) => {
  let startIndex = config.tilesPerRow * config.tilesPerColumn + 1;
  let index = (currentTile._index - 1) / 2;
  console.log(index);
  let diff = config.tileWidth;

  let leftTile = index !== 0 ? config.tiles[index - 1] : undefined;
  let rightTile = index % config.tilesPerRow !== config.tilesPerRow - 1 ? config.tiles[index + 1] : undefined;
  let topTile = index >= config.tilesPerColumn ? config.tiles[index - config.tilesPerColumn] : undefined;
  let bottomTile =
    index < config.tilesPerRow * config.tilesPerColumn - config.tilesPerRow
      ? config.tiles[index + config.tilesPerRow]
      : undefined;
  console.log(leftTile, rightTile, topTile, bottomTile);
  if (
    leftTile &&
    Math.abs(leftTile.position.x - currentTile.position.x) < diff * 1.2 &&
    Math.abs(leftTile.position.x - currentTile.position.x) > diff * 0.8 &&
    Math.abs(leftTile.position.y - currentTile.position.y) < diff * 1.2
  ) {
    currentTile.position.x = leftTile.position.x + config.tileWidth;
    currentTile.position.y = leftTile.position.y;
    setPosition(config, currentTile, leftTile, 'left');
  } else if (
    rightTile &&
    Math.abs(rightTile.position.x - currentTile.position.x) < diff * 1.2 &&
    Math.abs(rightTile.position.x - currentTile.position.x) > diff * 0.8 &&
    Math.abs(rightTile.position.y - currentTile.position.y) < diff * 1.2
  ) {
    currentTile.position.x = rightTile.position.x - config.tileWidth;
    currentTile.position.y = rightTile.position.y;
    setPosition(config, currentTile, rightTile, 'right');
  } else if (
    topTile &&
    Math.abs(topTile.position.x - currentTile.position.x) < diff * 1.2 &&
    Math.abs(topTile.position.y - currentTile.position.y) < diff * 1.2 &&
    Math.abs(topTile.position.y - currentTile.position.y) > diff * 0.8
  ) {
    currentTile.position.x = topTile.position.x;
    currentTile.position.y = topTile.position.y + config.tileWidth;
    setPosition(config, currentTile, topTile, 'top');
  } else if (
    bottomTile &&
    Math.abs(bottomTile.position.x - currentTile.position.x) < diff * 1.2 &&
    Math.abs(bottomTile.position.y - currentTile.position.y) < diff * 1.2 &&
    Math.abs(bottomTile.position.y - currentTile.position.y) > diff * 0.8
  ) {
    currentTile.position.x = bottomTile.position.x;
    currentTile.position.y = bottomTile.position.y - config.tileWidth;
    setPosition(config, currentTile, bottomTile, 'bottom');
  }
};

const setPosition = (config: Config, tile: any, joinTile: any, joinType: string) => {
  const index = (tile._index - 1) / 2;
  const joinIndex = (joinTile._index - 1) / 2;
  const shape = config.shapes[index];
  const joinShape = config.shapes[joinIndex];
  const margin = getMargin(shape);
  const joinMargin = getMargin(joinShape);

  tile.position.x += margin.x - joinMargin.x;
  tile.position.y += margin.y - joinMargin.y;
};

const puzzle = {
  moveTile,
};

export default puzzle;
