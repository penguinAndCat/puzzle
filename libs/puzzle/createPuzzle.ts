import paper, { Point } from 'paper/dist/paper-core';
import puzzle from './moveTile';

const constant = {
  borderStrokeWidth: 2,
  tileOpacity: 1,
  maskOpacity: 0.2,
};
let config: Config = {
  shapes: [],
  project: '',
  imgWidth: 500,
  imgHeight: 500,
  tilesPerColumn: 8,
  tilesPerRow: 8,
  tileWidth: 0,
  tileHeight: 0,
  puzzleImage: { src: '', width: 0, height: 0 },
  groupTiles: [],
  groupCheck: false,
  canvasSize: { width: 0, height: 0 },
  canvasPreSize: { width: 0, height: 0 },
  complete: false,
};

let levels: number[][] = [];
let positionArr: position[] = [];
let puzzleLevel = 0;
let puzzleName = '';

export const initConfig = (
  Paper: typeof paper,
  puzzleImage: img,
  canvasSize: size,
  level: number,
  title: string,
  firstRender: boolean = true
) => {
  puzzleLevel = level;
  puzzleName = title;
  setPuzzleRowColumn(puzzleImage);
  setConfig(Paper, puzzleImage, canvasSize);
  if (firstRender) {
    getRandomShapes();
    createTiles();
  } else {
    recreateTiles();
  }
};

export const restartConfig = (
  Paper: typeof paper,
  puzzleImage: img,
  serverConfig: Config,
  canvasSize: size,
  level: number,
  query: string | string[],
  socket: any,
  title: string
) => {
  config = serverConfig;
  puzzleLevel = level;
  puzzleName = title;
  setPuzzleRowColumn(puzzleImage);
  setConfig(Paper, puzzleImage, canvasSize);
  serverCreateTiles(query, socket);
};

export const exportConfig = () => config;
export const exportLevels = () => levels;
export const exportLevel = () => puzzleLevel;
export const exportPuzzleName = () => puzzleName;

export const setPuzzleRowColumn = (puzzleImage: img) => {
  const { width, height } = puzzleImage;
  levels = [];
  for (let i = 2; i < width; i++) {
    for (let j = 2; j < height; j++) {
      if (i * j > 200) continue;
      let ratio = width / i / (height / j);
      if (ratio < 0.9 || ratio > 1.1) continue;
      levels.push([i, j]);
    }
  }
  return levels;
};

const setPuzzleLevel = () => {
  if (puzzleLevel > levels.length - 1) puzzleLevel = levels.length - 1;
  config.tilesPerRow = levels[puzzleLevel][0];
  config.tilesPerColumn = levels[puzzleLevel][1];
};

const setConfig = (Paper: typeof paper, puzzleImage: img, canvasSize: size) => {
  config.project = Paper;
  config.puzzleImage = puzzleImage;
  config.canvasPreSize = config.canvasSize;
  config.canvasSize = canvasSize;
  setPuzzleLevel();
  const positionMargin = 1.1;
  const batchStandard = Math.ceil(Math.sqrt(config.tilesPerRow * config.tilesPerColumn));
  const batchTiles = Math.ceil(batchStandard * 1.5);
  config.imgWidth = (canvasSize.width * (config.tilesPerRow / batchTiles)) / positionMargin;
  config.imgHeight = (config.imgWidth / puzzleImage.width) * puzzleImage.height;
  config.tileWidth = config.imgWidth / config.tilesPerRow;
  config.tileHeight = config.imgHeight / config.tilesPerColumn;

  // row 퍼즐 개수에 따른 배치(괄호 친 부분 비우기)
  // 3(퍼즐 수) 5(배치 빈칸) =>  1 (2 3 4) 5
  // 4 6 =>  1 (2 3 4 5) 6
  // 5 8 =>  1 2 (3 4 5 6 7) 8
  // 6 9 =>  1 2 (3 4 5 6 7) 8 9
  // 7 11 => 1 2 (3 4 5 6 7 8 9) 10 11
  const position = {
    width: config.tileWidth * positionMargin,
    height: config.tileHeight * positionMargin,
  };
  const standard = {
    x: Math.ceil(batchTiles / 2),
    y: Math.ceil(batchTiles / 2),
  };
  let correction = 0;
  if (batchStandard % 2 === 0) {
    correction = 1;
  }
  let tilesCount = config.tilesPerRow * config.tilesPerColumn;
  positionArr = [];
  for (let y = 0; y < batchTiles; y++) {
    for (let x = 0; x < batchTiles; x++) {
      if (
        x >= standard.x - Math.floor(batchStandard / 2) + correction - 1 &&
        x <= standard.x + Math.floor(batchStandard / 2) - 1 &&
        y >= standard.y - Math.floor(batchStandard / 2) + correction - 1 &&
        y <= standard.y + Math.floor(batchStandard / 2) - 1
      ) {
      } else {
        if (tilesCount === 0) break;
        tilesCount--;
        const x1 = (x + 1 / 2) * position.width;
        const y1 = (y + 1 / 2) * position.height;
        positionArr.push({ x: x1, y: y1 });
      }
    }
  }
  Paper.project.activeLayer.removeChildren();
};

const popRandom = (array: position[]) => {
  const random = Math.floor(Math.random() * array.length);
  const el = array.splice(random, 1)[0];
  return el;
};

const createTiles = () => {
  config.groupTiles = [];
  for (let y = 0; y < config.tilesPerColumn; y++) {
    for (let x = 0; x < config.tilesPerRow; x++) {
      const shape = config.shapes[y * config.tilesPerRow + x];
      const mask = getMask(
        shape.topTab,
        shape.rightTab,
        shape.bottomTab,
        shape.leftTab,
        config.tileWidth,
        config.tileHeight,
        config.project,
        config.imgWidth,
        config.imgHeight
      );
      if (mask === undefined) continue;
      mask.opacity = constant.maskOpacity;
      mask.strokeColor = new config.project.Color('#ff0000');

      const img = getTileRaster(
        config.puzzleImage.src,
        new Point(config.tileWidth * x, config.tileHeight * y),
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
      //   config.project.view.center.x + (x - (config.tilesPerRow - 1) / 2) * config.tileWidth + margin.x,
      //   config.project.view.center.y + (y - (config.tilesPerColumn - 1) / 2) * config.tileHeight + margin.y
      // );
      const position = popRandom(positionArr);
      tile.position = new Point(position.x + margin.x, position.y + margin.y);
      config.groupTiles.push({ tile: tile, groupIndex: null, movable: true });
    }
  }
  puzzle.moveTile(config);
};
const recreateTiles = () => {
  const groupTiles = config.groupTiles;
  config.groupTiles = [];
  for (let y = 0; y < config.tilesPerColumn; y++) {
    for (let x = 0; x < config.tilesPerRow; x++) {
      const shape = config.shapes[y * config.tilesPerRow + x];
      const mask = getMask(
        shape.topTab,
        shape.rightTab,
        shape.bottomTab,
        shape.leftTab,
        config.tileWidth,
        config.tileHeight,
        config.project,
        config.imgWidth,
        config.imgHeight
      );
      if (mask === undefined) continue;
      mask.opacity = constant.maskOpacity;
      mask.strokeColor = new config.project.Color('#ff0000');

      const img = getTileRaster(
        config.puzzleImage.src,
        new Point(config.tileWidth * x, config.tileHeight * y),
        Math.max(config.imgWidth / config.puzzleImage.width, config.imgHeight / config.puzzleImage.height),
        config.project
      );

      const border = mask.clone();
      border.strokeColor = new config.project.Color('#333333');
      border.strokeWidth = constant.borderStrokeWidth;
      const tile = new config.project.Group([mask, img]);
      tile.clipped = true;
      tile.opacity = constant.tileOpacity;

      tile.position = new Point(
        (groupTiles[y * config.tilesPerRow + x].tile.position.x * config.canvasSize.width) / config.canvasPreSize.width,
        (groupTiles[y * config.tilesPerRow + x].tile.position.y * config.canvasSize.height) /
          config.canvasPreSize.height
      );
      config.groupTiles.push({
        tile: tile,
        groupIndex: groupTiles[y * config.tilesPerRow + x].groupIndex,
        movable: groupTiles[y * config.tilesPerRow + x].movable,
      });
    }
  }
  puzzle.moveTile(config);
};
const serverCreateTiles = (query: string | string[], socket: any) => {
  const groupTiles = config.groupTiles;
  config.groupTiles = [];
  for (let y = 0; y < config.tilesPerColumn; y++) {
    for (let x = 0; x < config.tilesPerRow; x++) {
      const shape = config.shapes[y * config.tilesPerRow + x];
      const mask = getMask(
        shape.topTab,
        shape.rightTab,
        shape.bottomTab,
        shape.leftTab,
        config.tileWidth,
        config.tileHeight,
        config.project,
        config.imgWidth,
        config.imgHeight
      );
      if (mask === undefined) continue;
      mask.opacity = constant.maskOpacity;
      mask.strokeColor = new config.project.Color('#ff0000');

      const img = getTileRaster(
        config.puzzleImage.src,
        new Point(config.tileWidth * x, config.tileHeight * y),
        Math.max(config.imgWidth / config.puzzleImage.width, config.imgHeight / config.puzzleImage.height),
        config.project
      );

      const border = mask.clone();
      border.strokeColor = new config.project.Color('#333333');
      border.strokeWidth = constant.borderStrokeWidth;
      const tile = new config.project.Group([mask, img]);
      tile.clipped = true;
      tile.opacity = constant.tileOpacity;

      tile.position = new Point(
        (groupTiles[y * config.tilesPerRow + x][0] * config.canvasSize.width) / config.canvasPreSize.width,
        (groupTiles[y * config.tilesPerRow + x][1] * config.canvasSize.height) / config.canvasPreSize.height
      );
      config.groupTiles.push({
        tile: tile,
        groupIndex: groupTiles[y * config.tilesPerRow + x][2],
        movable: true,
      });
    }
  }
  puzzle.moveTile(config, query, socket);
};
export const getMargin = (shape: shape) => {
  const margin = { x: 0, y: 0 };
  const marginP = {
    x: (15 * config.tileHeight) / 100,
    y: (15 * config.tileWidth) / 100,
  };
  const marginM = {
    x: (1.5 * config.tileHeight) / 100,
    y: (1.5 * config.tileWidth) / 100,
  };
  if (shape.rightTab === 1) {
    margin.x += marginP.x;
  } else if (shape.rightTab === -1) {
    margin.x += marginM.x;
  }
  if (shape.leftTab === 1) {
    margin.x -= marginP.x;
  } else if (shape.leftTab === -1) {
    margin.x -= marginM.x;
  }
  if (shape.topTab === 1) {
    margin.y -= marginP.y;
  } else if (shape.topTab === -1) {
    margin.y -= marginM.y;
  }
  if (shape.bottomTab === 1) {
    margin.y += marginP.y;
  } else if (shape.bottomTab === -1) {
    margin.y += marginM.y;
  }
  return margin;
};
export const getTileRaster = (puzzleImage: string | Blob, offset: paper.Point, scaleValue: number, Paper: any) => {
  const targetRaster = new Paper.Raster(puzzleImage);
  targetRaster.crossOrigin = 'Anonymous';
  targetRaster.scale(scaleValue);
  targetRaster.position = new Point(-offset.x, -offset.y);

  return targetRaster;
};

export const getMask = (
  topTab: number | undefined,
  rightTab: number | undefined,
  bottomTab: number | undefined,
  leftTab: number | undefined,
  tileWidth: number,
  tileHeight: number,
  project: any,
  imgWidth: number,
  imgHeight: number
) => {
  if (topTab === undefined || rightTab === undefined || bottomTab === undefined || leftTab === undefined) return;

  const tileWidthRatio = tileWidth / 100;
  const tileHeightRatio = tileHeight / 100;
  const cx11 = 4,
    cy11 = 1,
    cx12 = 10,
    cy12 = 3,
    x1 = 20,
    y1 = 3;
  const cx21 = 42,
    cy21 = 3,
    cx22 = 42,
    cy22 = -2,
    x2 = 42,
    y2 = -5.9;
  const cx31 = 36,
    cy31 = -14,
    cx32 = 36,
    cy32 = -30,
    x3 = 50,
    y3 = -30;
  const cx41 = 100 - cx32,
    cy41 = cy32,
    cx42 = 100 - cx31,
    cy42 = cy31,
    x4 = 100 - x2,
    y4 = y2;
  const cx51 = 100 - cx22,
    cy51 = cy22,
    cx52 = 100 - cx21,
    cy52 = cy21,
    x5 = 100 - x1,
    y5 = y1;
  const cx61 = 100 - cx12,
    cy61 = cy12,
    cx62 = 100 - cx11,
    cy62 = cy11,
    x6 = 100,
    y6 = 0;

  const curvyCoords = [
    cx11,
    cy11,
    cx12,
    cy12,
    x1,
    y1,

    cx21,
    cy21,
    cx22,
    cy22,
    x2,
    y2,

    cx31,
    cy31,
    cx32,
    cy32,
    x3,
    y3,

    cx41,
    cy41,
    cx42,
    cy42,
    x4,
    y4,

    cx51,
    cy51,
    cx52,
    cy52,
    x5,
    y5,

    cx61,
    cy61,
    cx62,
    cy62,
    x6,
    y6,
  ];

  const mask = new project.Path();
  const topLeftEdge = new Point(-imgWidth / 2, -imgHeight / 2);

  mask.moveTo(topLeftEdge);
  //Top
  for (let i = 0; i < curvyCoords.length / 6; i++) {
    const p1 = new Point(
      topLeftEdge.x + curvyCoords[i * 6 + 0] * tileWidthRatio,
      topLeftEdge.y + topTab * curvyCoords[i * 6 + 1] * tileWidthRatio
    );
    const p2 = new Point(
      topLeftEdge.x + curvyCoords[i * 6 + 2] * tileWidthRatio,
      topLeftEdge.y + topTab * curvyCoords[i * 6 + 3] * tileWidthRatio
    );
    const p3 = new Point(
      topLeftEdge.x + curvyCoords[i * 6 + 4] * tileWidthRatio,
      topLeftEdge.y + topTab * curvyCoords[i * 6 + 5] * tileWidthRatio
    );

    mask.cubicCurveTo(p1, p2, p3);
  }

  //Right
  const topRightEdge = new Point(topLeftEdge.x + tileWidth, topLeftEdge.y);
  for (let i = 0; i < curvyCoords.length / 6; i++) {
    const p1 = new Point(
      topRightEdge.x - rightTab * curvyCoords[i * 6 + 1] * tileHeightRatio,
      topRightEdge.y + curvyCoords[i * 6 + 0] * tileHeightRatio
    );
    const p2 = new Point(
      topRightEdge.x - rightTab * curvyCoords[i * 6 + 3] * tileHeightRatio,
      topRightEdge.y + curvyCoords[i * 6 + 2] * tileHeightRatio
    );
    const p3 = new Point(
      topRightEdge.x - rightTab * curvyCoords[i * 6 + 5] * tileHeightRatio,
      topRightEdge.y + curvyCoords[i * 6 + 4] * tileHeightRatio
    );

    mask.cubicCurveTo(p1, p2, p3);
  }

  //Bottom
  const bottomRightEdge = new Point(topRightEdge.x, topRightEdge.y + tileHeight);
  for (let i = 0; i < curvyCoords.length / 6; i++) {
    const p1 = new Point(
      bottomRightEdge.x - curvyCoords[i * 6 + 0] * tileWidthRatio,
      bottomRightEdge.y - bottomTab * curvyCoords[i * 6 + 1] * tileWidthRatio
    );
    const p2 = new Point(
      bottomRightEdge.x - curvyCoords[i * 6 + 2] * tileWidthRatio,
      bottomRightEdge.y - bottomTab * curvyCoords[i * 6 + 3] * tileWidthRatio
    );
    const p3 = new Point(
      bottomRightEdge.x - curvyCoords[i * 6 + 4] * tileWidthRatio,
      bottomRightEdge.y - bottomTab * curvyCoords[i * 6 + 5] * tileWidthRatio
    );

    mask.cubicCurveTo(p1, p2, p3);
  }

  //Left
  const bottomLeftEdge = new Point(bottomRightEdge.x - tileWidth, bottomRightEdge.y);
  for (let i = 0; i < curvyCoords.length / 6; i++) {
    const p1 = new Point(
      bottomLeftEdge.x + leftTab * curvyCoords[i * 6 + 1] * tileHeightRatio,
      bottomLeftEdge.y - curvyCoords[i * 6 + 0] * tileHeightRatio
    );
    const p2 = new Point(
      bottomLeftEdge.x + leftTab * curvyCoords[i * 6 + 3] * tileHeightRatio,
      bottomLeftEdge.y - curvyCoords[i * 6 + 2] * tileHeightRatio
    );
    const p3 = new Point(
      bottomLeftEdge.x + leftTab * curvyCoords[i * 6 + 5] * tileHeightRatio,
      bottomLeftEdge.y - curvyCoords[i * 6 + 4] * tileHeightRatio
    );

    mask.cubicCurveTo(p1, p2, p3);
  }

  return mask;
};

const getRandomShapes = () => {
  config.shapes = [];
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

      shape.rightTab = x < config.tilesPerRow - 1 ? getRandomTabValue() : shape.rightTab;

      if (shapeRight && shape.rightTab !== undefined) shapeRight.leftTab = -shape.rightTab;

      shape.bottomTab = y < config.tilesPerColumn - 1 ? getRandomTabValue() : shape.bottomTab;

      if (shapeBottom && shape.bottomTab !== undefined) shapeBottom.topTab = -shape.bottomTab;
    }
  }
};
const getRandomTabValue = () => {
  return Math.pow(-1, Math.floor(Math.random() * 2));
};
