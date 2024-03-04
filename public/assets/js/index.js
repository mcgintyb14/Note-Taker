const saveNoteBtn = document.querySelector('.save-note');
const clearFormBtn = document.querySelector('.clear-btn'); // Corrected selector
const newNoteBtn = document.querySelector('.new-note');
const noteTitleInput = document.querySelector('.note-title');
const noteTextInput = document.querySelector('.note-textarea');
const listGroup = document.querySelector('.list-group');
const noteDetailsDiv = document.getElementById('note-details'); // Select the note-details div

document.addEventListener('DOMContentLoaded', function () {
    // Function to fetch and display notes
    const fetchAndDisplayNotes = () => {
        fetch('/api/notes')
            .then(response => response.json())
            .then(notes => {
                listGroup.innerHTML = ''; // Clear previous notes
                notes.forEach(note => {
                    const listItem = document.createElement('li');
                    listItem.classList.add('list-group-item');
                    listItem.dataset.noteId = note.id; // Set the note ID attribute

                    // Create a heading element for the title
                    const titleElement = document.createElement('h5');
                    titleElement.textContent = note.title;
                    listItem.appendChild(titleElement);

                    // Create a paragraph element for the text
                    const textElement = document.createElement('p');
                    textElement.textContent = note.text;
                    listItem.appendChild(textElement);

                    // Create a delete button
                    const deleteButton = document.createElement('button');
                    deleteButton.classList.add('btn', 'btn-danger', 'btn-sm', 'delete-note');
                    deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
                    deleteButton.dataset.noteId = note.id; // Set the note ID attribute
                    listItem.appendChild(deleteButton);

                    listGroup.appendChild(listItem);
                });
            })
            .catch(error => {
                console.error('Error fetching notes:', error);
            });
    };

    // Call fetchAndDisplayNotes when the page loads
    fetchAndDisplayNotes();

    // Add event listener for clicking on an existing note
    listGroup.addEventListener('click', function(event) {
        const deleteButton = event.target.closest('.delete-note');
        if (deleteButton) {
            event.stopPropagation(); // Stop event propagation
            const noteId = deleteButton.dataset.noteId;
            if (!noteId) {
                console.error('Note ID is undefined or null');
                return;
            }
    
            fetch(`/api/notes/${noteId}`, {
                method: 'DELETE'
            })
            .then(response => {
                if (response.ok) {
                    // Refresh the notes list after deletion
                    fetchAndDisplayNotes(); 
                } else {
                    throw new Error('Failed to delete note');
                }
            })
            .catch(error => {
                console.error('Error deleting note:', error);
            });
        } else {
            const listItem = event.target.closest('.list-group-item');
            if (!listItem) return; // Ensure that a list item was clicked
    
            const noteId = listItem.dataset.noteId;
            if (!noteId) {
                console.error('Note ID is undefined or null');
                return;
            }
    
            fetchAndDisplayNoteDetails(noteId);
        }
    });
    

    // Function to fetch and display details of a specific note
    const fetchAndDisplayNoteDetails = (noteId) => {
        fetch(`/api/notes/${noteId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch note');
                }
                return response.json();
            })
            .then(note => {
                // Display the note details on the right side of the page
                noteDetailsDiv.innerHTML = `<h3>${note.title}</h3><p>${note.text}</p>`;
            })
            .catch(error => {
                console.error('Error fetching note:', error);
            });
    };

    newNoteBtn.style.display = 'inline';
    newNoteBtn.addEventListener('click', function (event) {
        // Show the title and text fields for the new note
        noteTitleInput.style.display = 'block';
        noteTextInput.style.display = 'block';
        saveNoteBtn.style.display = 'inline'; // Show the "Save Note" button
        clearFormBtn.style.display = 'inline'; // Show the "Clear Form" button

        // Optionally, clear any existing content in the title and text fields
        noteTitleInput.value = '';
        noteTextInput.value = '';
    });

    // Add event listener for the Save Note button
    saveNoteBtn.addEventListener('click', function (event) {
        const newNote = {
            title: noteTitleInput.value.trim(),
            text: noteTextInput.value.trim()
        };

        // Send a POST request to the server to save the new note
        fetch('/api/notes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newNote) // Convert the note object to JSON format
        })
            .then(response => {
                if (response.ok) {
                    return response.json(); // Parse the response body as JSON
                }
                throw new Error('Failed to save note');
            })
            .then(savedNote => {
                console.log('Note saved successfully:', savedNote);
                noteTitleInput.value = '';
                noteTextInput.value = '';
                fetchAndDisplayNotes(); // Fetch and display notes again to update the UI
            })
            .catch(error => {
                console.error('Error saving note:', error);
            });
    });

    // Add event listener for the Clear Form button
// Add event listener for the Clear Form button
clearFormBtn.addEventListener('click', function (event) {
    // Clear the content of the title and text fields
    noteTitleInput.value = '';
    noteTextInput.value = '';

    // Clear the displayed note details from the right-hand side of the page
    const noteDetailsDiv = document.getElementById('note-details');
    noteDetailsDiv.innerHTML = ''; // Clear the inner HTML content
});
});
