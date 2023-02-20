import { exportConfig } from './createPuzzle';
import { savePuzzle } from './savePuzzle';
import { openConfetti } from 'hooks/views/useConfetti';

export const moveIndex = (groupTiles: any, indexArr: number[], socketCanvasSize: size) => {
  const config = exportConfig();
  config.groupTiles.forEach((item, tilesIndex) => {
    item.groupIndex = groupTiles[tilesIndex][2];
    if (!groupTiles[tilesIndex][3]) {
      item.movable = groupTiles[tilesIndex][3];
    }
  });
  let counter = 0;
  let movePositionX: number[] = [];
  let movePositionY: number[] = [];
  indexArr.forEach((index) => {
    movePositionX.push(
      ((groupTiles[index][0] / socketCanvasSize.width) * config.canvasSize.width -
        config.groupTiles[index].tile.position.x) /
        31
    );
    movePositionY.push(
      ((groupTiles[index][1] / socketCanvasSize.width) * config.canvasSize.width -
        config.groupTiles[index].tile.position.y) /
        31
    );
  });
  const moveAnimation: any = () => {
    if (counter > 30) {
      indexArr.forEach((index) => {
        config.groupTiles[index].tile.position.x =
          (groupTiles[index][0] / socketCanvasSize.width) * config.canvasSize.width;
        config.groupTiles[index].tile.position.y =
          (groupTiles[index][1] / socketCanvasSize.width) * config.canvasSize.width;
      });
      cancelAnimationFrame(moveAnimation);
      config.groupTiles.forEach((item, tilesIndex) => {
        if (groupTiles[tilesIndex][3]) {
          item.movable = groupTiles[tilesIndex][3];
        }
      });
      return;
    }
    counter++;
    indexArr.forEach((index, i) => {
      config.groupTiles[index].tile.position.x += movePositionX[i];
      config.groupTiles[index].tile.position.y += movePositionY[i];
    });
    requestAnimationFrame(moveAnimation);
  };
  moveAnimation();

  const newGroupIndex = config.groupTiles[0].groupIndex;
  if (newGroupIndex !== null) {
    let fitCount = 0;
    config.groupTiles.forEach((item) => {
      if (item.groupIndex === newGroupIndex) {
        fitCount++;
      }
    });
    if (fitCount === config.groupTiles.length && config.complete === false) {
      config.complete = true;
      savePuzzle();
      openConfetti();
    }
  }
};

export const movableIndex = (groupTiles: any) => {
  const config = exportConfig();
  config.groupTiles.forEach((item, tilesIndex) => {
    item.groupIndex = groupTiles[tilesIndex][2];
    if (!groupTiles[tilesIndex][3]) {
      item.movable = groupTiles[tilesIndex][3];
    }
  });
};
