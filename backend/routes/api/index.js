const router = require('express').Router();
const asyncHandler = require('express-async-handler');
const sessionRouter = require('./session.js');
const usersRouter = require('./users.js');
const soungsRouter = require('./songs.js')

router.use('/session', sessionRouter);

router.use('/users', usersRouter);
router.use('/songs', soungsRouter);

router.post('/test', (req, res) => {
  res.json({ requestBody: req.body });
});

module.exports = router;
