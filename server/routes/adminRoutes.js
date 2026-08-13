const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const auth = require('../middleware/auth');

router.post('/login', adminController.login);
router.get('/stats', auth, adminController.getStats);
router.get('/songs', auth, adminController.getAllSongs);
router.post('/songs', auth, adminController.createSong);
router.put('/songs/:id', auth, adminController.updateSong);
router.delete('/songs/:id', auth, adminController.deleteSong);

module.exports = router;
