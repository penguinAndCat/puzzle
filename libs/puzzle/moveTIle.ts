import { getMargin } from './createPuzzle';

const moveTile = (config: Config) => {
  config.groupTiles.forEach((tiles, index) => {
    tiles[0].onMouseDown = (event: any) => {
      // config.project.project.activeLayer.addChild(tiles[0]);
    };
    tiles[0].onMouseDrag = (event: any) => {
      const groupIndex = tiles[1];
      if (groupIndex === undefined) {
        tiles[0].position.x += event.delta.x;
        tiles[0].position.y += event.delta.y;
      } else {
        config.groupTiles.forEach((tiles, index) => {
          if (tiles[1] === groupIndex) {
            tiles[0].position.x += event.delta.x;
            tiles[0].position.y += event.delta.y;
          }
        });
      }
    };
    tiles[0].onMouseUp = (event: any) => {
      fitTile(config, tiles[0], tiles[1]);
    };
  });
};

const fitTile = (
  config: Config,
  currentTile: { _index: number; position: { x: number; y: number } },
  groupIndex: index
) => {
  const index = (currentTile._index - 1) / 2;
  const diff = config.tileWidth;
  const diffMargin = 0.1;

  const leftTile = index % config.tilesPerRow !== 0 ? config.tiles[index - 1] : undefined;
  const rightTile = index % config.tilesPerRow !== config.tilesPerRow - 1 ? config.tiles[index + 1] : undefined;
  const topTile = index >= config.tilesPerColumn ? config.tiles[index - config.tilesPerColumn] : undefined;
  const bottomTile =
    index < config.tilesPerRow * config.tilesPerColumn - config.tilesPerRow
      ? config.tiles[index + config.tilesPerRow]
      : undefined;

  if (calculatePosition(currentTile, leftTile, diff, 0) === true) {
    setPosition(config, currentTile, leftTile, groupIndex, 'left');
  }
  if (calculatePosition(currentTile, rightTile, diff, 0) === true) {
    setPosition(config, currentTile, rightTile, groupIndex, 'right');
  }
  if (calculatePosition(currentTile, topTile, diff, 1) === true) {
    setPosition(config, currentTile, topTile, groupIndex, 'top');
  }
  if (calculatePosition(currentTile, bottomTile, diff, 1) === true) {
    setPosition(config, currentTile, bottomTile, groupIndex, 'bottom');
  }
};

const calculatePosition = (currentTile: any, joinTile: any, diff: number, type: number) => {
  const diffMargin = 0.2;
  if (joinTile === undefined) return false;
  if (type === 0) {
    if (
      Math.abs(currentTile.position.x - joinTile.position.x) < diff * (1 + diffMargin) &&
      Math.abs(currentTile.position.x - joinTile.position.x) > diff * (1 - diffMargin) &&
      Math.abs(currentTile.position.y - joinTile.position.y) < diff * diffMargin
    ) {
      return true;
    }
  } else {
    if (
      Math.abs(currentTile.position.x - joinTile.position.x) < diff * diffMargin &&
      Math.abs(currentTile.position.y - joinTile.position.y) < diff * (1 + diffMargin) &&
      Math.abs(currentTile.position.y - joinTile.position.y) > diff * (1 - diffMargin)
    ) {
      return true;
    }
  }
  return false;
};

const setPosition = (config: Config, currentTile: any, joinTile: any, groupIndex: index, type: string) => {
  const index = (currentTile._index - 1) / 2;
  const joinIndex = (joinTile._index - 1) / 2;
  const shape = config.shapes[index];
  const joinShape = config.shapes[joinIndex];
  const currentMargin = getMargin(shape);
  const joinMargin = getMargin(joinShape);
  const margin = {
    x: joinTile.position.x - currentTile.position.x + currentMargin.x - joinMargin.x,
    y: joinTile.position.y - currentTile.position.y + currentMargin.y - joinMargin.y,
  };
  if (type === 'left') {
    margin.x += config.tileWidth;
  } else if (type === 'right') {
    margin.x -= config.tileWidth;
  } else if (type === 'top') {
    margin.y += config.tileWidth;
  } else if (type === 'bottom') {
    margin.y -= config.tileWidth;
  }
  if (groupIndex === undefined) {
    currentTile.position.x += margin.x;
    currentTile.position.y += margin.y;
  } else {
    config.groupTiles.forEach((tiles) => {
      if (tiles[1] === groupIndex) {
        tiles[0].position.x += margin.x;
        tiles[0].position.y += margin.y;
      }
    });
  }
  setGroup(config, currentTile, joinTile);
};

const setGroup = (config: Config, tile: any, joinTile: any) => {
  console.log(1, config.groupTiles);
  const index = (tile._index - 1) / 2;
  const joinIndex = (joinTile._index - 1) / 2;
  const groupIndex = config.groupTiles[index][1];
  const joinGroupIndex = config.groupTiles[joinIndex][1];
  if (groupIndex === joinGroupIndex && groupIndex !== undefined) return;
  if (config.groupTiles[joinIndex][1] === undefined) {
    config.groupTiles[joinIndex][1] = joinIndex;
    if (config.groupTiles[index][1] === undefined) {
      config.groupTiles[index][1] = joinIndex;
    } else {
      config.groupTiles.forEach((tiles) => {
        if (tiles[1] === groupIndex) {
          tiles[1] = joinIndex;
        }
      });
    }
  } else {
    if (config.groupTiles[index][1] === undefined) {
      config.groupTiles[index][1] = joinGroupIndex;
    } else {
      config.groupTiles.forEach((tiles) => {
        if (tiles[1] === groupIndex) {
          tiles[1] = joinGroupIndex;
        }
      });
    }
  }
  console.log(2, config.groupTiles);
};

const puzzle = {
  moveTile,
};

export default puzzle;
