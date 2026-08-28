const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    exercise: {
      type: String,
      required: [true, 'Exercise name is required'],
      trim: true,
    },
    duration: {
      type: Number,
      required: [true, 'Duration is required'],
      min: 1,
    },
    calories: {
      type: Number,
      default: 0,
      min: 0,
    },
    sets: { type: Number, default: 0 },
    reps: { type: Number, default: 0 },
    notes: { type: String, default: '' },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Workout', workoutSchema);
