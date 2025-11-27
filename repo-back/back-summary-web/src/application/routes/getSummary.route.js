const express = require('express');
const getSummary = require('../controllers/getSummary.controller');
const router = new express.Router();

router.route('/summary/:accountId/:dateFrom/:dateThru').get(getSummary.get);

module.exports = router;
