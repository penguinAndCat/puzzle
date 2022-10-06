import axios from 'axios';
import { openConfetti } from 'hooks/useConfetti';
import { getMargin } from './createPuzzle';

const moveTile = (config: Config, query?: string | string[], socket?: any) => {
  config.groupTiles.forEach((item, index) => {
    item.tile.onMouseDown = (event: any) => {
      const gIndex = item.groupIndex;
      if (gIndex !== null) {
        config.groupTiles.forEach(({ tile, groupIndex }) => {
          if (groupIndex === gIndex) {
            config.project.project.activeLayer.addChild(tile);
          }
        });
      } else {
        config.project.project.activeLayer.addChild(event.target);
      }
    };
    item.tile.onMouseDrag = (event: any) => {
      const groupIndex = item.groupIndex;
      if (
        item.tile.position.x + event.delta.x < 0 ||
        item.tile.position.y + event.delta.y < 0 ||
        item.tile.position.x + event.delta.x > config.canvasSize.width ||
        item.tile.position.y + event.delta.y > config.canvasSize.height ||
        event.point.x < 0 ||
        event.point.y < 0 ||
        event.point.x > config.canvasSize.width ||
        event.point.y > config.canvasSize.height
      )
        return;
      if (groupIndex === null) {
        item.tile.position.x += event.delta.x;
        item.tile.position.y += event.delta.y;
      } else {
        config.groupTiles.forEach((item, index) => {
          if (item.groupIndex === groupIndex) {
            item.tile.position.x += event.delta.x;
            item.tile.position.y += event.delta.y;
          }
        });
      }
    };
    item.tile.onMouseUp = (event: any) => {
      const groupIndex = item.groupIndex;
      if (groupIndex === null) {
        fitTile(config, item.tile, item.groupIndex);
      } else {
        config.groupTiles.forEach((item, index) => {
          if (item.groupIndex === groupIndex) {
            fitTile(config, item.tile, item.groupIndex);
          }
        });
      }

      const newGroupIndex = item.groupIndex;
      let indexArr = [];
      if (newGroupIndex === null) {
        indexArr.push(index);
      } else {
        config.groupTiles.forEach((item, index) => {
          if (item.groupIndex === newGroupIndex) {
            indexArr.push(index);
          }
        });
      }

      if (query !== undefined) {
        axios.put(`/api/puzzle/${query}`, {
          data: {
            config: {
              ...config,
              groupTiles: config.groupTiles.map((item) => {
                return [item.tile.position.x, item.tile.position.y, item.groupIndex];
              }),
            },
            indexArr: indexArr,
            socketId: socket.id,
          },
        });
      }

      if (newGroupIndex !== null) {
        let fitCount = 0;
        config.groupTiles.forEach((item) => {
          if (item.groupIndex === newGroupIndex) {
            fitCount++;
          }
        });
        if (fitCount === config.groupTiles.length && config.complete === false) {
          config.complete = true;
          openConfetti();
        }
      }

      const copy = [...config.groupTiles];
      const data = copy.reduce((acc, { tile, groupIndex }) => {
        if (groupIndex !== null) {
          acc[groupIndex] ? (acc[groupIndex] = [...acc[groupIndex], tile]) : (acc[groupIndex] = [tile]);
        }
        if (groupIndex === null) {
          acc['notGroup'] ? (acc['notGroup'] = [...acc['notGroup'], tile]) : (acc['notGroup'] = [tile]);
        }
        return acc;
      }, {});

      const arr1: any[] = [];
      const arr2: any[] = data['notGroup'];
      Object.entries(data).forEach(([key, value]) => {
        if (key !== 'notGroup') {
          arr1.push(value);
        }
      });

      arr1.sort((a, b) => b.length - a.length);

      arr1?.forEach((item) => {
        item.forEach((tile: any) => {
          config.project.project.activeLayer.addChild(tile);
        });
      });
      arr2?.forEach((tile: any) => {
        config.project.project.activeLayer.addChild(tile);
      });
    };
  });
};

const fitTile = (config: Config, currentTile: any, groupIndex: index) => {
  const index = config.groupTiles.findIndex((item) => item.tile === currentTile);
  const leftTile = index % config.tilesPerRow !== 0 ? config.groupTiles[index - 1].tile : undefined;
  const rightTile =
    index % config.tilesPerRow !== config.tilesPerRow - 1 ? config.groupTiles[index + 1].tile : undefined;
  const topTile = index >= config.tilesPerColumn ? config.groupTiles[index - config.tilesPerColumn].tile : undefined;
  const bottomTile =
    index < config.tilesPerRow * config.tilesPerColumn - config.tilesPerRow
      ? config.groupTiles[index + config.tilesPerRow].tile
      : undefined;

  // 동작 설명!!
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
  const index = config.groupTiles.findIndex((item) => item.tile === currentTile);
  const joinIndex = config.groupTiles.findIndex((item) => item.tile === joinTile);
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
  if (groupIndex === null) {
    currentTile.position.x += margin.x;
    currentTile.position.y += margin.y;
  } else {
    config.groupTiles.forEach((item) => {
      if (item.groupIndex === groupIndex) {
        item.tile.position.x += margin.x;
        item.tile.position.y += margin.y;
      }
    });
  }
  setGroup(config, currentTile, joinTile);
};

const setGroup = (config: Config, tile: any, joinTile: any) => {
  const index = config.groupTiles.findIndex((item) => item.tile === tile);
  const joinIndex = config.groupTiles.findIndex((item) => item.tile === joinTile);
  const groupIndex = config.groupTiles[index].groupIndex;
  const joinGroupIndex = config.groupTiles[joinIndex].groupIndex;
  if (groupIndex === joinGroupIndex && groupIndex !== null) return;
  if (config.groupTiles[joinIndex].groupIndex === null) {
    config.groupTiles[joinIndex].groupIndex = joinIndex;
    if (config.groupTiles[index].groupIndex === null) {
      config.groupTiles[index].groupIndex = joinIndex;
    } else {
      config.groupTiles.forEach((item) => {
        if (item.groupIndex === groupIndex) {
          item.groupIndex = joinIndex;
        }
      });
    }
  } else {
    if (config.groupTiles[index].groupIndex === null) {
      config.groupTiles[index].groupIndex = joinGroupIndex;
    } else {
      config.groupTiles.forEach((item) => {
        if (item.groupIndex === groupIndex) {
          item.groupIndex = joinGroupIndex;
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
