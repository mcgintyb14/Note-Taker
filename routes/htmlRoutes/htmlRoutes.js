const express = require('express');
const router = express.Router();
const path = require('path');

// Define routes for HTML pages

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

router.get('/notes', (req, res) => {
    // Construct the correct path to notes.html
    res.sendFile(path.join(__dirname, '../../public/notes.html'));
});

module.exports = router;
