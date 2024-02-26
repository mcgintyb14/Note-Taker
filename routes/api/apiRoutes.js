const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const notesFilePath = path.join(__dirname, '../../db/db.json');

const readNotesFromFile = () => {
    try {
        const data = fs.readFileSync(notesFilePath);
        return JSON.parse(data);
    } catch (error) {
        // Handle file not found or invalid JSON
        console.error('Error reading notes from file:', error);
        return [];
    }
};

const writeNotesToFile = (notes) => {
    fs.writeFileSync(notesFilePath, JSON.stringify(notes, null, 2));
};

let notes = [];

router.get('/notes', (req, res) => {
    try {
        const notes = readNotesFromFile();
        res.json(notes);
    } catch (error) {
        console.error('Error reading notes:', error);
        res.status(500).json({ error: 'Error reading notes' });
    }
});

router.post('/notes', (req, res) => {
    try {
        const newNote = req.body;
        notes.push(newNote);
        writeNotesToFile(notes);
        res.json(newNote);
    } catch (error) {
        console.error('Error adding note:', error);
        res.status(500).json({ error: 'Error adding note' });
    }
});

router.delete('/:id', (req, res) => {
    try {
        const noteId = req.params.id;
        notes = notes.filter(note => note.id !== noteId);
        writeNotesToFile(notes);
        res.status(204).end();
    } catch (error) {
        console.error('Error deleting note:', error);
        res.status(500).json({ error: 'Error deleting note' });
    }
});

module.exports = router;
