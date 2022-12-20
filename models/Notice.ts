import mongoose from 'mongoose';

const NoticeSchema = new mongoose.Schema(
  {
    requester: {
      type: String,
    },
    requested: {
      type: String,
    },
    type: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Notice || mongoose.model('Notice', NoticeSchema, 'notices');
