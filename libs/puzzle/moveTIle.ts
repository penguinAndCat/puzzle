import { getMargin } from './createPuzzle';

const moveTile = (config: Config) => {
  config.groupTiles.forEach((tiles, index) => {
    tiles[0].onMouseDown = (event: any) => {};
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
      const groupIndex = tiles[1];
      if (groupIndex === undefined) {
        fitTile(config, tiles[0], tiles[1]);
      } else {
        config.groupTiles.forEach((tiles, index) => {
          if (tiles[1] === groupIndex) {
            fitTile(config, tiles[0], tiles[1]);
          }
        });
      }
    };
  });
};

const fitTile = (
  config: Config,
  currentTile: { _index: number; position: { x: number; y: number } },
  groupIndex: index
) => {
  const index = (currentTile._index - 1) / 2;
  const leftTile = index % config.tilesPerRow !== 0 ? config.groupTiles[index - 1][0] : undefined;
  const rightTile = index % config.tilesPerRow !== config.tilesPerRow - 1 ? config.groupTiles[index + 1][0] : undefined;
  const topTile = index >= config.tilesPerRow ? config.groupTiles[index - config.tilesPerRow][0] : undefined;
  const bottomTile =
    index < config.tilesPerRow * config.tilesPerColumn - config.tilesPerRow
      ? config.groupTiles[index + config.tilesPerRow][0]
      : undefined;

  // 동작 설명
  // 4개의 방향에 대해 근처에 그룹화 가능한 조각이 있는지 확인한다.
  // 이미 그룹화 된 조각은 다시 그룹화 하지 않는다.
  // 그룹화 가능한 조각이 두 개 이상 있을 경우, 하나의 조각만 그룹화한다.
  config.groupCheck = false;
  if (calculatePosition(currentTile, leftTile, config.tileWidth, 0) === true && config.groupCheck === false) {
    setPosition(config, currentTile, leftTile, groupIndex, 'left');
  }
  if (calculatePosition(currentTile, rightTile, config.tileWidth, 0) === true && config.groupCheck === false) {
    setPosition(config, currentTile, rightTile, groupIndex, 'right');
  }
  if (calculatePosition(currentTile, topTile, config.tileHeight, 1) === true && config.groupCheck === false) {
    setPosition(config, currentTile, topTile, groupIndex, 'top');
  }
  if (calculatePosition(currentTile, bottomTile, config.tileHeight, 1) === true && config.groupCheck === false) {
    setPosition(config, currentTile, bottomTile, groupIndex, 'bottom');
  }
};

const calculatePosition = (currentTile: any, joinTile: any, tileSize: number, type: number) => {
  const diffMargin = 0.2;
  if (joinTile === undefined) return false;
  if (type === 0) {
    if (
      Math.abs(currentTile.position.x - joinTile.position.x) < tileSize * (1 + diffMargin) &&
      Math.abs(currentTile.position.x - joinTile.position.x) > tileSize * (1 - diffMargin) &&
      Math.abs(currentTile.position.y - joinTile.position.y) < tileSize * diffMargin
    ) {
      return true;
    }
  } else {
    if (
      Math.abs(currentTile.position.x - joinTile.position.x) < tileSize * diffMargin &&
      Math.abs(currentTile.position.y - joinTile.position.y) < tileSize * (1 + diffMargin) &&
      Math.abs(currentTile.position.y - joinTile.position.y) > tileSize * (1 - diffMargin)
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
    margin.y += config.tileHeight;
  } else if (type === 'bottom') {
    margin.y -= config.tileHeight;
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
  config.groupCheck = true;
};

const puzzle = {
  moveTile,
};

export default puzzle;
