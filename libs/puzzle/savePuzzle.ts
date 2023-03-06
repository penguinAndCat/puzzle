import axios from 'apis/axios';
import paper, { Point } from 'paper/dist/paper-core';
import { exportConfig, exportLevel, exportPuzzleName, getMargin, getMask, getTileRaster } from './createPuzzle';

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
  }, 500);
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
  config.imgWidth = canvasSize.width;
  config.imgHeight = (config.imgWidth / puzzleImage.width) * puzzleImage.height;
  config.tileWidth = config.imgWidth / config.tilesPerRow;
  config.tileHeight = config.imgHeight / config.tilesPerColumn;
  Paper.project.activeLayer.removeChildren();
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
