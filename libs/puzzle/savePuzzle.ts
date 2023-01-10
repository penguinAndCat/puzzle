import axios from 'libs/axios';
import paper from 'paper';
import { Point } from 'paper/dist/paper-core';
import { exportConfig, exportLevel, exportPuzzleName } from './createPuzzle';

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
  firstClient: true,
  canvasSize: { width: 0, height: 0 },
  canvasPreSize: { width: 0, height: 0 },
  complete: false,
};

let levels: number[][] = [];
let positionArr: position[] = [];

export const savePuzzle = () => {
  const saveConfig = exportConfig();
  const level = exportLevel();
  const puzzleName = exportPuzzleName();
  const width = saveConfig.puzzleImage.width;
  const height = saveConfig.puzzleImage.height;
  const canvasSize = { width: width, height: height };

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  paper.setup(canvas);
  initConfig(paper, saveConfig.puzzleImage, saveConfig, canvasSize, level);

  setTimeout(() => {
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio;
    const image = ctx?.getImageData(0, 0, width * dpr, height * dpr);
    const target = window.document.createElement('canvas');
    if (!image) return;
    target.width = width * dpr;
    target.height = height * dpr;
    target.getContext('2d')?.putImageData(image, 0, 0);
    const link = document.createElement('a');
    link.download = `${puzzleName}.jpg`;
    link.href = target?.toDataURL('image/jpeg');
    link.click();
  }, 1000);
};

export const saveServerPuzzle = async (puzzleId: string | string[] | undefined) => {
  const response = await axios.get(`/api/puzzle/${puzzleId}`);
  const item = response.data.item;
  const serverConfig = { ...item.config };
  const puzzleImage = { ...serverConfig.puzzleImage };
  const canvasSize = { width: puzzleImage.width, height: puzzleImage.height };
  const level = item.level;
  const title = item.title;
  const width = puzzleImage.width;
  const height = puzzleImage.height;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  paper.setup(canvas);
  initConfig(paper, puzzleImage, serverConfig, canvasSize, level);

  setTimeout(() => {
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio;
    const image = ctx?.getImageData(0, 0, width * dpr, height * dpr);
    const target = window.document.createElement('canvas');
    if (!image) return;
    target.width = width * dpr;
    target.height = height * dpr;
    target.getContext('2d')?.putImageData(image, 0, 0);
    const link = document.createElement('a');
    link.download = `${title}.jpg`;
    link.href = target?.toDataURL('image/jpeg');
    link.click();
  }, 500);
};

const initConfig = (Paper: typeof paper, puzzleImage: img, saveConfig: Config, canvasSize: size, level: number) => {
  config = saveConfig;
  setPuzzleRowColumn(puzzleImage);
  setConfig(Paper, puzzleImage, canvasSize, level);
  createTiles();
};

const setPuzzleRowColumn = (puzzleImage: img) => {
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

const setPuzzleLevel = (level: number) => {
  if (level > levels.length - 1) level = levels.length - 1;
  config.tilesPerRow = levels[level][0];
  config.tilesPerColumn = levels[level][1];
};

const setConfig = (Paper: typeof paper, puzzleImage: img, canvasSize: size, level: number) => {
  config.project = Paper;
  config.puzzleImage = puzzleImage;
  config.canvasPreSize = config.canvasSize;
  config.canvasSize = canvasSize;
  setPuzzleLevel(level);
  const positionMargin = 1.1;
  const batchStandard = Math.ceil(Math.sqrt(config.tilesPerRow * config.tilesPerColumn));
  const batchTiles = Math.ceil(batchStandard * 1.5);
  config.imgWidth = canvasSize.width;
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

const createTiles = () => {
  const tileRatio = config.tileWidth / 100;
  const tileRatio2 = config.tileHeight / 100;
  config.groupTiles = [];
  for (let y = 0; y < config.tilesPerColumn; y++) {
    for (let x = 0; x < config.tilesPerRow; x++) {
      const shape = config.shapes[y * config.tilesPerRow + x];
      const mask = getMask(
        tileRatio,
        tileRatio2,
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
      tile.position = new Point(
        config.project.view.center.x + (x - (config.tilesPerRow - 1) / 2) * config.tileWidth + margin.x,
        config.project.view.center.y + (y - (config.tilesPerColumn - 1) / 2) * config.tileHeight + margin.y
      );
      // const position = popRandom(positionArr);
      // tile.position = new Point(position.x + margin.x, position.y + margin.y);
      config.groupTiles.push({ tile: tile, groupIndex: null, movable: true });
    }
  }
};

const getMargin = (shape: shape) => {
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

const getTileRaster = (puzzleImage: string | Blob, offset: paper.Point, scaleValue: number, Paper: any) => {
  const targetRaster = new Paper.Raster(puzzleImage);
  targetRaster.crossOrigin = 'Anonymous';
  targetRaster.scale(scaleValue);
  targetRaster.position = new Point(-offset.x, -offset.y);

  return targetRaster;
};

const getMask = (
  tileRatio: number,
  tileRatio2: number,
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
      topRightEdge.x - rightTab * curvyCoords[i * 6 + 1] * tileRatio2,
      topRightEdge.y + curvyCoords[i * 6 + 0] * tileRatio2
    );
    const p2 = new Point(
      topRightEdge.x - rightTab * curvyCoords[i * 6 + 3] * tileRatio2,
      topRightEdge.y + curvyCoords[i * 6 + 2] * tileRatio2
    );
    const p3 = new Point(
      topRightEdge.x - rightTab * curvyCoords[i * 6 + 5] * tileRatio2,
      topRightEdge.y + curvyCoords[i * 6 + 4] * tileRatio2
    );

    mask.cubicCurveTo(p1, p2, p3);
  }

  //Bottom
  const bottomRightEdge = new Point(topRightEdge.x, topRightEdge.y + tileHeight);
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
      bottomLeftEdge.x + leftTab * curvyCoords[i * 6 + 1] * tileRatio2,
      bottomLeftEdge.y - curvyCoords[i * 6 + 0] * tileRatio2
    );
    const p2 = new Point(
      bottomLeftEdge.x + leftTab * curvyCoords[i * 6 + 3] * tileRatio2,
      bottomLeftEdge.y - curvyCoords[i * 6 + 2] * tileRatio2
    );
    const p3 = new Point(
      bottomLeftEdge.x + leftTab * curvyCoords[i * 6 + 5] * tileRatio2,
      bottomLeftEdge.y - curvyCoords[i * 6 + 4] * tileRatio2
    );

    mask.cubicCurveTo(p1, p2, p3);
  }

  return mask;
};
