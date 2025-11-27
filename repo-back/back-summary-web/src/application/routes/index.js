const express = require('express');

const getSummary = require('./getSummary.route');
const router = new express.Router();

router.use('/', getSummary);

module.exports = router;
