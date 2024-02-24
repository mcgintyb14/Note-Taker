const express = require('express');
const router = express.Router();
const path = require('path');

// Example data - you can replace this with your actual data handling logic
let notes = [];

// GET route to fetch all notes
router.get('/notes', (req, res) => {
    res.json(notes);
});

// POST route to add a new note
router.post('/notes', (req, res) => {
    const newNote = req.body;
    notes.push(newNote);
    res.status(201).json(newNote);
});

// DELETE route to delete a note
router.delete('/notes/:id', (req, res) => {
    const noteId = req.params.id;
    notes = notes.filter(note => note.id !== noteId);
    res.status(204).end();
});

module.exports = router;
