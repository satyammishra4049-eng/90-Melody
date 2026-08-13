const express = require('express');
const router = express.Router();
const playerController = require('../controllers/playerController');

router.get('/now-playing', playerController.getNowPlaying);

module.exports = router;
