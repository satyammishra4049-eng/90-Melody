const express = require('express');
const router = express.Router();
const songController = require('../controllers/songController');

router.get('/', songController.getAllSongs);
router.get('/:id', songController.getSongById);

// Keep create/update/delete for admin or general depending on auth later.
// The prompt asked for full CRUD in songRoutes as well.
router.post('/', songController.createSong);
router.put('/:id', songController.updateSong);
router.delete('/:id', songController.deleteSong);

module.exports = router;
