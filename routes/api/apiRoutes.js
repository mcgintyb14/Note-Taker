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
        console.error('Error reading notes from file:', error);
        return [];
    }
};

const writeNotesToFile = (notes) => {
    fs.writeFileSync(notesFilePath, JSON.stringify(notes, null, 2));
};

router.get('/notes', (req, res) => {
    try {
        const notes = readNotesFromFile().map(note => ({
            ...note,
            id: note.id
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
        newNote.id = uuidv4();
        const notes = readNotesFromFile();
        notes.push(newNote);
        writeNotesToFile(notes);
        res.json(newNote);
    } catch (error) {
        console.error('Error adding note:', error);
        res.status(500).json({ error: 'Error adding note' });
    }
});

router.delete('/notes/:noteID', (req, res) => {
    try {
        const noteID = req.params.noteID;
        let notes = readNotesFromFile();
        // Filter out the note with the specified ID
        notes = notes.filter(note => note.id !== noteID);
        writeNotesToFile(notes); // Update the notes file without the deleted note
        res.sendStatus(200); // Send a success status code
    } catch (error) {
        console.error('Error deleting note:', error);
        res.status(500).json({ error: 'Error deleting note' });
    }
});


router.get('/notes/:noteID', (req, res) => {
    try {
        const noteID = req.params.noteID;
        const notes = readNotesFromFile();
        const note = notes.find(note => note.id === noteID);
        if (!note) {
            return res.status(404).json({ error: 'Note not found' });
        }
        res.json(note);
    } catch (error) {
        console.error('Error fetching note:', error);
        res.status(500).json({ error: 'Error fetching note' });
    }
});

module.exports = router;
