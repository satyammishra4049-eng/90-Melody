const express = require('express');
const router = express.Router();
const onlineController = require('../controllers/onlineController');

router.get('/count', onlineController.getOnlineCount);
router.post('/heartbeat', onlineController.heartbeat);
router.post('/remove', onlineController.removeSession);

module.exports = router;
