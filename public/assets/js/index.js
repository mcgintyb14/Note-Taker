const saveNoteBtn = document.querySelector('.save-note');
const clearFormBtn = document.querySelector('.clear-btn'); // Corrected selector
const newNoteBtn = document.querySelector('.new-note');
const noteTitleInput = document.querySelector('.note-title');
const noteTextInput = document.querySelector('.note-textarea');
const listGroup = document.querySelector('.list-group');

document.addEventListener('DOMContentLoaded', function() {
    // Function to fetch and display notes
    const fetchAndDisplayNotes = () => {
        fetch('/api/notes')
            .then(response => response.json())
            .then(notes => {
                listGroup.innerHTML = ''; // Clear previous notes
                notes.forEach(note => {
                    const listItem = document.createElement('li');
                    listItem.classList.add('list-group-item');
                    
                    // Create a heading element for the title
                    const titleElement = document.createElement('h5');
                    titleElement.textContent = note.title;
                    listItem.appendChild(titleElement);
    
                    // Create a paragraph element for the text
                    const textElement = document.createElement('p');
                    textElement.textContent = note.text;
                    listItem.appendChild(textElement);
    
                    // Create a delete button with a trash icon
                    const deleteButton = document.createElement('button');
                    deleteButton.classList.add('btn', 'btn-danger', 'btn-sm', 'delete-note');
                    deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
                    deleteButton.setAttribute('data-note-id', note.id); // Set the note ID as a data attribute
                    deleteButton.addEventListener('click', deleteNote);
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


    newNoteBtn.style.display = 'inline';
    newNoteBtn.addEventListener('click', function(event) {
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
    saveNoteBtn.addEventListener('click', function(event) {
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
            // Do something with the response data if needed
            console.log('Note saved successfully:', savedNote);

            noteTitleInput.value = '';
            noteTextInput.value = '';
    
            // Fetch and display notes again to update the UI
            fetchAndDisplayNotes();
        })
        .catch(error => {
            console.error('Error saving note:', error);
            // Handle any errors that occur during the fetch request
        });
    });

    // Function to handle note deletion
    function deleteNote() {
        const noteId = this.getAttribute('data-note-id'); // Get the note ID from the button
        if (!noteId) {
            console.error('Note ID is undefined or null');
            return;
        }
    
        fetch(`/api/notes/${noteId}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (response.ok) {
                fetchAndDisplayNotes(); // Refresh the notes list after deletion
            } else {
                throw new Error('Failed to delete note');
            }
        })
        .catch(error => {
            console.error('Error deleting note:', error);
        });
    }

    // Add event listener for the Clear Form button
    clearFormBtn.addEventListener('click', function(event) {
        // Clear the content of the title and text fields
        noteTitleInput.value = '';
        noteTextInput.value = '';
    });
});
