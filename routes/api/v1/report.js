const express = require('express');
const router = express.Router();
const passport = require('passport');
const report_api = require("../../../controllers/api/v1/report_controller");


router.get('/:status',passport.authenticate('jwt',{session: false}),report_api.reportByFiler);


module.exports = router;