import mongoose, { Schema } from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    provider: {
      type: String,
    },
    nickname: {
      type: String,
    },
    name: {
      type: String,
    },
    email: {
      type: String,
    },
    picture: {
      type: String,
    },
    refreshToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.User || mongoose.model('User', UserSchema, 'users');
