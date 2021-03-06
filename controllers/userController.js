const req = require('express/lib/request');
const res = require('express/lib/response');
const { Thought, User, Reaction } = require('../models');

module.exports = {
  // Get all users
  getUsers(req, res) {
    User.find()
      .then((users) => res.json(users))
      .catch((err) => res.status(500).json(err));
  },
  // Get a single User by its Id
  getSingleUser(req, res) {
    User.findOne({ _id: req.params.userId })
      .populate([
        { path: 'thoughts', select: "-__v"},
        { path: 'friends', select: "-__v"},

      ])
      .select('-__v')
      .then((user) =>
        !user
          ? res.status(404).json({ message: 'No user with that ID' })
          : res.json({
            user
          })
      )
      .catch((err) => res.status(500).json(err));
  },
  // create a new user
  createUser(req, res) {
    User.create(req.body)
    .then((users) => res.json(users))
    .catch((err) => res.status(400).json(err));
  },
  // update a user by their id
  updateUser(req, res) {
    User.findOneAndUpdate(
      {_id: req.params.userId},
      { $set: req.body }
    )
      .then((user) => res.json(user))
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  },
  // Delete a user and their associated thoughts
  deleteUser(req, res) {
    User.findOneAndRemove({ _id: req.params.userId })
      .then((user) =>
        !user
          ? res.status(404).json({ message: 'No user with that ID' })
          : Thought.findOneAndUpdate(
            {users: req.params.userId},
            {$pull: {users: req.params.userId} },
            {new: true }
          )
      )
      .then(() => res.json({ message: 'student and thoughts deleted!' }))
      .catch((err) => res.status(500).json(err));
  },
  // Add a new friend to the user's friend list.
  addFriend(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $addToSet: { friends: req.params.userId } },
      { runValidators: true, new: true }
    )
      .then((user) => {
        if(!user) {
        return res.status(404).json({ message: 'No user with this id!' })
        }
       res.json(user)
      })
      //add userId to friendId's friend List
      User.findOneAndUpdate(
        {_id: req.params.friendId},
        {$addToSet: {friends: req.params.userId}},
        { runValidators: true, new: true }
      )
      .then((userData) => {
        if(userData) {
        return res.json(userData).json({ message: 'No user with this friendId!' })
        }
        
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });;
  },

  // remove a friend from the user
  removeFriend(req, res) {
    User.findOneAndUpdate(
      {_id: req.params.userId },
      {$pull: {friends: {friendsId: req.params.friendsId }}},
      { runValidators: true, new: true}
    )
    .then((user) => 
      !user
        ? res
            .status(404)
            .json({ message: 'no user found with that ID'})
            : res.json(user)
    )
    .catch((err) => res.status(500).json(err));
  },
};


