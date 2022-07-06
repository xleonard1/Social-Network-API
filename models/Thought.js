const { Schema, model } = require('mongoose');
const assignmentSchema = require('./Assignment');

// Schema to create Student model
const thoughtSchema = new Schema(
  {
    thoughtText: {
      type: String,
      required: true,
      max_length: 280,
    },
    createdAt: {
      type: Date,
      default: () => new Date(+new Date() + 84 * 24 * 60 * 60 * 1000),
      get: (date) => timeSince(date)
    },
    username: {
      type: String,
      required: true,
    },
    reactions: [reactionSchema],
  },
  {
    toJSON: {
      getters: true,
    },
  }
);

userSchema.virtual('reactionCount').get(function() {
  return this.reactions.length
})

const Thought = model('Thought', thoughtSchema);

module.exports = Thought;
