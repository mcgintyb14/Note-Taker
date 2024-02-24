// const express = require('express');
// const app = express();
// const path = require('path');
// const fs = require('fs');

// const PORT = process.env.PORT || 3001;

// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());
// app.use(express.static('public'));

// // Define the path to the notes JSON file
// const notesFilePath = path.join(__dirname, 'db', 'notes.json');

// // Function to read notes from the JSON file
// const readNotesFromFile = () => {
//     const data = fs.readFileSync(notesFilePath);
//     return JSON.parse(data);
// };

// // Function to write notes to the JSON file
// const writeNotesToFile = (notes) => {
//     fs.writeFileSync(notesFilePath, JSON.stringify(notes, null, 2));
// };

// // Route to serve the notes.html page
// app.get('/notes', (req, res) => {
//     res.sendFile(path.join(__dirname, 'public', '../notes.html'));
// });

// // Route to serve the homepage
// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, 'public', 'index.html'));
// });

// // Route to get all notes
// app.get('/api/notes', (req, res) => {
//     const notes = readNotesFromFile();
//     res.json(notes);
// });

// // Route to save a new note
// app.post('/api/notes', (req, res) => {
//     const newNote = req.body;
//     const notes = readNotesFromFile();
//     newNote.id = Date.now().toString(); // Assign a unique id
//     notes.push(newNote);
//     writeNotesToFile(notes);
//     res.json(newNote);
// });

// // Route to delete a note
// app.delete('/api/notes/:id', (req, res) => {
//     const noteId = req.params.id;
//     let notes = readNotesFromFile();
//     notes = notes.filter(note => note.id !== noteId);
//     writeNotesToFile(notes);
//     res.json({ message: 'Note deleted successfully' });
// });

// // Start the server
// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });
