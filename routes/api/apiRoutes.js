const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

router.use(express.json());

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
        const notes = readNotesFromFile().map(note => ({
            ...note,
            id: note.id // Include the ID in the note object
        }));
        res.json(notes);
    } catch (error) {
        console.error('Error reading notes:', error);
        res.status(500).json({ error: 'Error reading notes' });
    }
});

router.post('/notes', (req, res) => {
    try {
        const newNote = req.body;
        newNote.id = uuidv4(); // Generate a unique ID for the new note
        const notes = readNotesFromFile();
        notes.push(newNote);
        writeNotesToFile(notes);
        res.json(newNote);
    } catch (error) {
        console.error('Error adding note:', error);
        res.status(500).json({ error: 'Error adding note' });
    }
});


router.delete('/notes/:id', (req, res) => {
    try {
        const noteId = req.params.id;
        // Read notes from the file
        let notes = readNotesFromFile();
        // Filter out the note with the specified ID
        notes = notes.filter(note => note.id && note.id.toString() !== noteId); // Check if note.id exists before accessing it
        // Write the updated notes to the file
        writeNotesToFile(notes);
        res.status(204).end();
    } catch (error) {
        console.error('Error deleting note:', error);
        res.status(500).json({ error: 'Error deleting note' });
    }
});


module.exports = router;
