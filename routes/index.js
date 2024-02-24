const express = require('express');
const apiRoutes = require('./apiRoutes'); // Import API routes
const htmlRoutes = require('./htmlRoutes'); // Import HTML routes

const router = express.Router();

// Mount API routes
router.use('/api', apiRoutes);

// Mount HTML routes
router.use('/', htmlRoutes);

module.exports = router;
