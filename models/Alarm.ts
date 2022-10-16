import mongoose from 'mongoose';

const AlarmSchema = new mongoose.Schema(
  {
    requester: {
      type: String,
    },
    requested: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Alarm || mongoose.model('Alarm', AlarmSchema, 'alarms');
