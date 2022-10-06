import mongoose, { Schema } from 'mongoose';

const PuzzleSchema = new mongoose.Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
    },
    config: {
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
      complete: {
        type: Boolean,
      },
      firstClient: {
        type: Boolean,
      },
      groupCheck: {
        type: Boolean,
      },
      groupTile: {
        type: Schema.Types.Mixed,
      },
      groupTiles: {
        type: Schema.Types.Mixed,
      },
      imgHeight: {
        type: Number,
      },
      imgWidth: {
        type: Number,
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
      shapes: {
        type: [Schema.Types.Mixed],
      },
      tileHeight: {
        type: Number,
      },
      tileWidth: {
        type: Number,
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
    level: {
      type: Number,
    },
    title: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Puzzle || mongoose.model('Puzzle', PuzzleSchema, 'puzzles');
