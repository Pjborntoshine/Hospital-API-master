const express = require('express');
const router = express.Router();


router.use('/doctors',require('./doctor'));
router.use('/patients',require('./pateint'));
router.use('/reports',require('./report'));



module.exports = router;