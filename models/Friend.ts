import mongoose from 'mongoose';

const FriendSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
    },
    friend: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Friend || mongoose.model('Friend', FriendSchema, 'friends');
