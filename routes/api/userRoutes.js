const router = require('express').Router();
const {
  getUsers,
  getSingleUser,
  createUser,
  updateUser,
  deleteUser,
  addFriend,
  removeFriend
} = require('../../controllers/userController.js');

// /api/courses
router.route('/').get(getUsers).post(createUser);

// /api/courses/:userId
router
  .route('/:userId/friends/:friendId').delete(removeFriend);
//update a single user
router.route('/:userId/friends').put(addFriend)

router.route('/:userId').get(getSingleUser).put(updateUser).delete(deleteUser)

module.exports = router;
