const express = require('express');
const router = express.Router();
const doctorApi = require("../../../controllers/api/v1/doctor_controller");



router.post('/register',doctorApi.register);
router.post('/login',doctorApi.createSession);


module.exports = router;