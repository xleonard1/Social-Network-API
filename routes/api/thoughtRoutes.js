const router = require('express').Router();
const {
  getThoughts,
  getSingleThought,
  createThought,
  updateThought,
  deleteThought,
  addReaction,
  removeReaction,
} = require('../../controllers/thoughtController');

// /api/students
router.route('/').get(getThoughts);

// /api/students/:studentId
router.route('/:thoughtId').get(getSingleThought).put(updateThought).delete(deleteThought);


router.route('/:userId').post(createThought)
// /api/students/:studentId/reactions
router.route('/reactions/:thoughtId').put(addReaction).delete(removeReaction);

module.exports = router;
