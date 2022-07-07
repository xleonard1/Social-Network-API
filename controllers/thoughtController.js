const req = require('express/lib/request');
const res = require('express/lib/response');
const { User, Thought } = require('../models');

module.exports = {
  // Get all students
  getThoughts(req, res) {
    Thought.find()
      .then((thoughts) => res.json(thoughts))
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  },
  // Get a single student
  getSingleThought(req, res) {
    Thought.findOne({ _id: req.params.thoughtId })
      .select('-__v')
      .then(async (thought) =>
        !thought
          ? res.status(404).json({ message: 'No thought with that ID' })
          : res.json(thought)
      )
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  },
  // create a new thought
  createThought(req, res) {
    Thought.create(req.body)
    .then((thought) => {
      User.findOneAndUpdate(
        {_id: req.params.userId},
        { $push: {thoughts: thought._id}},
        { new: true }
      )
      .then((user) => {
        if(!user) {
          return res.status(404).json({message: ' No user found with this id'})
        }
        res.json(user)
      })
      .catch((err) => res.json(err));
    })
     .catch((err) => {
      console.log(err) 
      res.status(400).json(err)
    });
      
  },

  // update a thought
  updateThought(req, res) {
    Thought.findOneAndUpdate(
      {_id: req.params.thoughtId},
      {$set: req.body}
    )
    .then((thought) => res.json(thought))
    .catch((err) => {
      return res.status(500).json(err)
    });
  },


  deleteThought(req, res) {
    Thought.findOneAndRemove({ _id: req.params.thoughtId })
      .then((thought) => {
        if(!thought) {
          return res.status(404).json({ message: 'No such thought exists' })
        }
        User.findOneAndUpdate(
              { _id: req.params.userId },
              { $pull: { users: req.params.userId } },
              { new: true }
            )
        })
      .then((user) => {
        if(!user) {
          return res.status(404).json({message: 'thought deleted, but no userfound'})
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },

  // Add a reaction to a thought
  addReaction(req, res) {
    console.log('You are adding a reaction');
    console.log(req.body);
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $addToSet: { reactions: req.body } },
      { runValidators: true, new: true }
    )
      .then((thought) =>
        !thought
          ? res
              .status(404)
              .json({ message: 'No thought found with that ID :(' })
          : res.json(thought)
      )
      .catch((err) => res.status(500).json(err));
  },
  // Remove assignment from a student
  removeReaction(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $pull: { reaction: { reactionId: req.params.reactionId } } },
      { runValidators: true, new: true }
    )
      .then((thought) =>
        !thought
          ? res
              .status(404)
              .json({ message: 'No thought found with that ID :(' })
          : res.json(thought)
      )
      .catch((err) => res.status(500).json(err));
  },
};
