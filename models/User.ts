import mongoose, { Schema } from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    provider: {
      type: String,
    },
    nickname: {
      type: String,
      required: true,
      maxlength: 5,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
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
