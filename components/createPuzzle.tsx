import Paper from 'paper';
import { Point, Size } from 'paper/dist/paper-core';
import puzzle from '../libs/puzzle';

const constant = {
  percentageTotal: 100.0,
  borderStrokeWidth: 2,
  tileOpacity: 1,
  maskOpacity: 0.9,
  orgTileLoc: 100,
  tileMarginM: 10,
  tileMarginP: 30,
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
  shapes: any[];
  tiles: any[];
  project: any;
  puzzleImage: any;
  tileIndexes: any[];
  groupArr: any[];
};

const config: Config = {
  tileWidth: 110,
  tilesPerColumn: 3,
  tilesPerRow: 3,
  shapes: [],
  project: '',
  imgWidth: 330,
  imgHeight: 330,
  originWidth: 330,
  originHeight: 330,
  puzzleImage: '',
  imgName: 'http://localhost:3000/test.jpg',
  tileIndexes: [],
  groupArr: [],
  groupTiles: [],
  tiles: [],
};

const setConfig = (Paper: any) => {
  config.project = Paper;
};

export const initConfig = (Paper: any) => {
  setConfig(Paper);
  getRandomShapes();
  const tileRatio = config.tileWidth / 100;
  for (let y = 0; y < config.tilesPerColumn; y++) {
    for (let x = 0; x < config.tilesPerRow; x++) {
      const shape = config.shapes[y * config.tilesPerRow + x];
      const mask = getMask(
        tileRatio,
        shape.topTab,
        shape.rightTab,
        shape.bottomTab,
        shape.leftTab,
        config.tileWidth,
        config.project,
        config.imgWidth,
        config.imgHeight
      );
      if (mask === undefined) continue;
      mask.opacity = constant.maskOpacity;
      mask.strokeColor = new config.project.Color('#ff0000');

      console.log(config.tileWidth * x, config.tileWidth * y);
      const img = getTileRaster(
        new Size(config.tileWidth, config.tileWidth),
        new Point(config.tileWidth * x, config.tileWidth * y),
        Math.max(config.imgWidth / config.originWidth, config.imgHeight / config.originHeight),
        Paper
      );

      const border = mask.clone();
      border.strokeColor = new config.project.Color('#333333');
      border.strokeWidth = constant.borderStrokeWidth;
      console.log(mask, img, border);
      const tile = new config.project.Group([mask, img]);
      tile.clipped = true;
      tile.opacity = constant.tileOpacity;
      shape.topTab, shape.rightTab, shape.bottomTab, shape.leftTab;

      let marginX = 0;
      let marginY = 0;
      const marginP = 11;
      const marginM = 5;
      if (shape.rightTab === 1) {
        marginX += marginP;
      } else if (shape.rightTab === -1) {
        marginX += marginM;
      }
      if (shape.leftTab === 1) {
        marginX -= marginP;
      } else if (shape.leftTab === -1) {
        marginX -= marginM;
      }
      if (shape.topTab === 1) {
        marginY -= marginP;
      } else if (shape.topTab === -1) {
        marginY -= marginM;
      }
      if (shape.bottomTab === 1) {
        marginY += marginP;
      } else if (shape.bottomTab === -1) {
        marginY += marginM;
      }
      tile.position = new Point(
        Paper.view.center._x + (x - 1) * config.tileWidth + marginX,
        Paper.view.center._y + (y - 1) * config.tileWidth + marginY
      );
      config.tiles.push(tile);
      puzzle.moveTile(config);
    }
  }
};

const getTileRaster = (size: paper.Size, offset: paper.Point, scaleValue: number, Paper: any) => {
  const targetRaster = new Paper.Raster('/test.jpg');
  targetRaster.scale(scaleValue);
  targetRaster.position = new Point(-offset.x, -offset.y);

  return targetRaster;
};

const getMask = (
  tileRatio: number,
  topTab: number | undefined,
  rightTab: number | undefined,
  bottomTab: number | undefined,
  leftTab: number | undefined,
  tileWidth: number,
  project: any,
  imgWidth: number,
  imgHeight: number
) => {
  if (topTab === undefined || rightTab === undefined || bottomTab === undefined || leftTab === undefined) return;

  const curvyCoords = [
    0, 0, 35, 15, 37, 5, 37, 5, 40, 0, 38, -5, 38, -5, 20, -20, 50, -20, 50, -20, 80, -20, 62, -5, 62, -5, 60, 0, 63, 5,
    63, 5, 65, 15, 100, 0,
  ];

  const mask = new project.Path();
  const topLeftEdge = new Point(-imgWidth / 2, -imgHeight / 2);

  mask.moveTo(topLeftEdge);
  //Top
  for (let i = 0; i < curvyCoords.length / 6; i++) {
    const p1 = new Point(
      topLeftEdge.x + curvyCoords[i * 6 + 0] * tileRatio,
      topLeftEdge.y + topTab * curvyCoords[i * 6 + 1] * tileRatio
    );

    const p2 = new Point(
      topLeftEdge.x + curvyCoords[i * 6 + 2] * tileRatio,
      topLeftEdge.y + topTab * curvyCoords[i * 6 + 3] * tileRatio
    );

    const p3 = new Point(
      topLeftEdge.x + curvyCoords[i * 6 + 4] * tileRatio,
      topLeftEdge.y + topTab * curvyCoords[i * 6 + 5] * tileRatio
    );

    mask.cubicCurveTo(p1, p2, p3); // 곡선의 첫점, 중앙점, 끝점
  }

  //Right
  const topRightEdge = new Point(topLeftEdge.x + tileWidth, topLeftEdge.y);
  for (let i = 0; i < curvyCoords.length / 6; i++) {
    const p1 = new Point(
      topRightEdge.x - rightTab * curvyCoords[i * 6 + 1] * tileRatio,
      topRightEdge.y + curvyCoords[i * 6 + 0] * tileRatio
    );
    const p2 = new Point(
      topRightEdge.x - rightTab * curvyCoords[i * 6 + 3] * tileRatio,
      topRightEdge.y + curvyCoords[i * 6 + 2] * tileRatio
    );
    const p3 = new Point(
      topRightEdge.x - rightTab * curvyCoords[i * 6 + 5] * tileRatio,
      topRightEdge.y + curvyCoords[i * 6 + 4] * tileRatio
    );

    mask.cubicCurveTo(p1, p2, p3);
  }

  //Bottom
  const bottomRightEdge = new Point(topRightEdge.x, topRightEdge.y + tileWidth);
  for (let i = 0; i < curvyCoords.length / 6; i++) {
    const p1 = new Point(
      bottomRightEdge.x - curvyCoords[i * 6 + 0] * tileRatio,
      bottomRightEdge.y - bottomTab * curvyCoords[i * 6 + 1] * tileRatio
    );
    const p2 = new Point(
      bottomRightEdge.x - curvyCoords[i * 6 + 2] * tileRatio,
      bottomRightEdge.y - bottomTab * curvyCoords[i * 6 + 3] * tileRatio
    );
    const p3 = new Point(
      bottomRightEdge.x - curvyCoords[i * 6 + 4] * tileRatio,
      bottomRightEdge.y - bottomTab * curvyCoords[i * 6 + 5] * tileRatio
    );

    mask.cubicCurveTo(p1, p2, p3);
  }

  //Left
  const bottomLeftEdge = new Point(bottomRightEdge.x - tileWidth, bottomRightEdge.y);
  for (let i = 0; i < curvyCoords.length / 6; i++) {
    const p1 = new Point(
      bottomLeftEdge.x + leftTab * curvyCoords[i * 6 + 1] * tileRatio,
      bottomLeftEdge.y - curvyCoords[i * 6 + 0] * tileRatio
    );
    const p2 = new Point(
      bottomLeftEdge.x + leftTab * curvyCoords[i * 6 + 3] * tileRatio,
      bottomLeftEdge.y - curvyCoords[i * 6 + 2] * tileRatio
    );
    const p3 = new Point(
      bottomLeftEdge.x + leftTab * curvyCoords[i * 6 + 5] * tileRatio,
      bottomLeftEdge.y - curvyCoords[i * 6 + 4] * tileRatio
    );

    mask.cubicCurveTo(p1, p2, p3);
  }

  return mask;
};

const getRandomShapes = () => {
  for (let y = 0; y < config.tilesPerColumn; y++) {
    for (let x = 0; x < config.tilesPerRow; x++) {
      let topTab: undefined | number;
      let rightTab: undefined | number;
      let bottomTab: undefined | number;
      let leftTab: undefined | number;

      if (y === 0) topTab = 0;
      if (y === config.tilesPerColumn - 1) bottomTab = 0;
      if (x === 0) leftTab = 0;
      if (x === config.tilesPerRow - 1) rightTab = 0;

      config.shapes.push({
        topTab: topTab,
        rightTab: rightTab,
        bottomTab: bottomTab,
        leftTab: leftTab,
      });
    }
  }

  for (let y = 0; y < config.tilesPerColumn; y++) {
    for (let x = 0; x < config.tilesPerRow; x++) {
      const shape = config.shapes[y * config.tilesPerRow + x];

      const shapeRight = x < config.tilesPerRow - 1 ? config.shapes[y * config.tilesPerRow + (x + 1)] : undefined;

      const shapeBottom = y < config.tilesPerColumn - 1 ? config.shapes[(y + 1) * config.tilesPerRow + x] : undefined;

      config.shapes[y * config.tilesPerRow + x].rightTab =
        x < config.tilesPerRow - 1 ? getRandomTabValue() : shape.rightTab;

      if (shapeRight && shape.rightTab !== undefined) shapeRight.leftTab = -shape.rightTab;

      config.shapes[y * config.tilesPerRow + x].bottomTab =
        y < config.tilesPerColumn - 1 ? getRandomTabValue() : shape.bottomTab;

      if (shapeBottom && shape.bottomTab !== undefined) shapeBottom.topTab = -shape.bottomTab;
    }
  }
};
const getRandomTabValue = () => {
  return Math.pow(-1, Math.floor(Math.random() * 2));
};
