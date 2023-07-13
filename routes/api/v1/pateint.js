const express = require('express');
const router = express.Router();
const passport = require('passport');
const pateint_api = require("../../../controllers/api/v1/pateint_controller");


router.post('/register',passport.authenticate('jwt',{session: false}),pateint_api.register);
router.post('/:id/create_report',passport.authenticate('jwt',{session: false}),pateint_api.createReport);
router.get('/:id/all_reports',passport.authenticate('jwt',{session: false}),pateint_api.allReports);

module.exports = router;