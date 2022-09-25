import { ObjectId } from 'mongodb';
import mongoose, { Schema } from 'mongoose';

const PuzzleSchema = new mongoose.Schema(
  {
    userId: {
      type: ObjectId,
    },
    canvasPreSize: {
      width: {
        type: Number,
      },
      height: {
        type: Number,
      },
    },
    canvasSize: {
      width: {
        type: Number,
      },
      height: {
        type: Number,
      },
    },
    firstClient: {
      type: Boolean,
    },
    groupArr: {
      type: [Schema.Types.Mixed],
    },
    groupCheck: {
      type: Boolean,
    },
    groupTile: {
      type: Schema.Types.Mixed,
    },
    imgHeight: {
      type: Number,
    },
    imgWidth: {
      type: Number,
    },
    levels: {
      type: [Schema.Types.Mixed],
    },
    positionArr: {
      type: [Schema.Types.Mixed],
    },
    puzzleImage: {
      src: {
        type: String,
      },
      width: {
        type: Number,
      },
      height: {
        type: Number,
      },
    },
    project: {
      settings: {
        type: Schema.Types.Mixed,
      },
      project: {
        type: Schema.Types.Mixed,
      },
      projects: {
        type: Schema.Types.Mixed,
      },
      tools: {
        type: Schema.Types.Mixed,
      },
      _id: {
        type: Number,
      },
    },
    shapes: {
      type: [Schema.Types.Mixed],
    },
    tileHeight: {
      type: Number,
    },
    tileWidth: {
      type: Number,
    },
    tileIndexes: {
      type: [Schema.Types.Mixed],
    },
    tiles: {
      type: [Schema.Types.Mixed],
    },
    tilesPerColumn: {
      type: Number,
    },
    tilesPerRow: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Puzzle || mongoose.model('Puzzle', PuzzleSchema);
