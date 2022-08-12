import paper from 'paper';
import { Point } from 'paper/dist/paper-core';
import puzzle from './moveTIle';

const constant = {
  borderStrokeWidth: 2,
  tileOpacity: 1,
  maskOpacity: 0.2,
};

const config: Config = {
  shapes: [],
  project: '',
  imgWidth: 330,
  imgHeight: 330,
  tilesPerColumn: 3,
  tilesPerRow: 3,
  tileWidth: 330 / 3,
  puzzleImage: { src: '', width: 0, height: 0 },
  tileIndexes: [],
  groupArr: [],
  groupTiles: [],
  tiles: [],
};

export const initConfig = (Paper: typeof paper, puzzleImage: img) => {
  setConfig(Paper, puzzleImage);
  getRandomShapes();
  Paper.project.activeLayer.removeChildren();
  createTiles();
};

const setConfig = (Paper: typeof paper, puzzleImage: img) => {
  config.project = Paper;
  config.puzzleImage = puzzleImage;
};

const createTiles = () => {
  const tileRatio = config.tileWidth / 100;
  config.tiles = [];
  config.groupTiles = [];
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

      const img = getTileRaster(
        config.puzzleImage.src,
        new Point(config.tileWidth * x, config.tileWidth * y),
        Math.max(config.imgWidth / config.puzzleImage.width, config.imgHeight / config.puzzleImage.height),
        config.project
      );

      const border = mask.clone();
      border.strokeColor = new config.project.Color('#333333');
      border.strokeWidth = constant.borderStrokeWidth;
      const tile = new config.project.Group([mask, img]);
      tile.clipped = true;
      tile.opacity = constant.tileOpacity;

      const margin = getMargin(shape);
      // tile.position = new Point(
      //   config.project.view.center.x + (x - (config.tilesPerColumn - 1) / 2) * config.tileWidth + margin.x,
      //   config.project.view.center.y + (y - (config.tilesPerColumn - 1) / 2) * config.tileWidth + margin.y
      // );
      tile.position = new Point(config.project.view.center.x, config.project.view.center.y);
      config.tiles.push(tile);
      config.groupTiles.push([tile, undefined]);
    }
  }
  puzzle.moveTile(config);
};
export const getMargin = (shape: shape) => {
  const margin = { x: 0, y: 0 };
  const marginP = (15 * config.tileWidth) / 100;
  const marginM = (1.5 * config.tileWidth) / 100;
  if (shape.rightTab === 1) {
    margin.x += marginP;
  } else if (shape.rightTab === -1) {
    margin.x += marginM;
  }
  if (shape.leftTab === 1) {
    margin.x -= marginP;
  } else if (shape.leftTab === -1) {
    margin.x -= marginM;
  }
  if (shape.topTab === 1) {
    margin.y -= marginP;
  } else if (shape.topTab === -1) {
    margin.y -= marginM;
  }
  if (shape.bottomTab === 1) {
    margin.y += marginP;
  } else if (shape.bottomTab === -1) {
    margin.y += marginM;
  }
  return margin;
};
const getTileRaster = (puzzleImage: string | Blob, offset: paper.Point, scaleValue: number, Paper: any) => {
  const targetRaster = new Paper.Raster(puzzleImage);
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

  const cx1 = 20,
    cy1 = 3,
    x1 = 20,
    y1 = 3;
  const cx2 = 46,
    cy2 = 3,
    x2 = 44,
    y2 = -7;
  const cx3 = 30,
    cy3 = -30,
    x3 = 50,
    y3 = -30;
  const cx4 = 70,
    cy4 = -30,
    x4 = 100 - x2,
    y4 = y2;
  const cx5 = 100 - cx2,
    cy5 = cy2,
    x5 = 100 - x1,
    y5 = y1;
  const cx6 = 100 - cx1,
    cy6 = cy1;

  const curvyCoords = [
    0,
    0,
    cx1,
    cy1,
    x1,
    y1,

    x1,
    y1,
    cx2,
    cy2,
    x2,
    y2,

    x2,
    y2,
    cx3,
    cy3,
    x3,
    y3,

    x3,
    y3,
    cx4,
    cy4,
    x4,
    y4,

    x4,
    y4,
    cx5,
    cy5,
    x5,
    y5,

    x5,
    y5,
    cx6,
    cy6,
    100,
    0,
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
