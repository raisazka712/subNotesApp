
const baseUrl = 'https://notes-api.dicoding.dev/v2';

// Menampilkan indikator loading
const showLoading = () => {
  const loader = document.createElement('div');
  loader.className = 'loading-indicator';
  loader.textContent = 'Loading...';
  document.body.appendChild(loader);
};

// Menghilangkan indikator loading
const hideLoading = () => {
    const loader = document.querySelector('.loading-indicator');
    if (loader) loader.remove();
};

const showResponseMessage = (message = 'Check your internet connection') => {
    alert(message);
};

// Menampilkan all notes - getNotes
const getNotes = async () => {
  showLoading();
  try {
      const response = await fetch(`${baseUrl}/notes`, {
          method: 'GET',
          headers: { Authorization: 'Bearer your-access-token' },
      });
      const result = await response.json();
      if (response.ok) {
            addNoteToActive;
          renderAllNotes(result.data);
      } else {
          showResponseMessage(result.message);
      }
  } catch (error) {
      showResponseMessage(error.message);
  } finally {
      hideLoading();
  }
};


// Get archived notes
const getArchivedNotes = async () => {
    showLoading();
    try {
        const response = await fetch(`${baseUrl}/notes/archived`, {
            method: 'GET',
            headers: { Authorization: 'Bearer your-access-token' },
        });
        const result = await response.json();
        if (response.ok) {
            renderAllArchivedNotes(result.data);
        } else {
            showResponseMessage(result.message);
        }
    } catch (error) {
        showResponseMessage(error.message);
    } finally {
        hideLoading();
    }
};

// insertNotes (add)
const insertNotes = async (note) => {
  showLoading();
  try {
      const response = await fetch(`${baseUrl}/notes`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              Authorization: 'Bearer your-access-token',
          },
          body: JSON.stringify(note),
      });
      const result = await response.json();
      if (response.ok) {
          getNotes(); // Refresh notes list
          showResponseMessage('Note added successfully!');
      } else {
          showResponseMessage(result.message);
      }
  } catch (error) {
      showResponseMessage(error.message);
  } finally {
      hideLoading();
  }
};

// removeNotes
const removeNotes = async (noteId) => {
  showLoading();
  try {
      const response = await fetch(`${baseUrl}/notes/${noteId}`, {
          method: 'DELETE',
          headers: { 
            Authorization: 'Bearer your-access-token',
            'X-Auth-Token': '12345',
        },
      });
      const result = await response.json();
      if (response.ok) {
        const noteElement = document.querySelector(`#note-${noteId}`);
        if (noteElement) noteElement.remove();
        getNotes(); // Refresh notes list (both active and archived)
        showResponseMessage('Note deleted successfully!');
      } else {
        // Re-add note element if deletion fails (optional)
        if (archivedNoteElement) {
          document.querySelector('#archivedNotesList').appendChild(archivedNoteElement);
        }
        showResponseMessage(result.message || 'Failed to delete note.');
      }
  } catch (error) {
      showResponseMessage(error.message);
      // Re-add note element if deletion fails (optional)
        const archivedNoteElement = document.querySelector(`#note-${noteId}`);
        if (archivedNoteElement) {
        document.querySelector('#archivedNotesList').appendChild(archivedNoteElement);
        }
  } finally {
      hideLoading();
  }
};


// Archive note
const archiveNote = async (noteId) => {
    showLoading();
    try {
        const response = await fetch(`${baseUrl}/notes/${noteId}/archive`, {
            method: 'POST',
            headers: { Authorization: 'Bearer your-access-token' },
        });
        const result = await response.json();
        if (response.ok) {
            getNotes(); // Refresh active notes list
            showResponseMessage('Note archived successfully!');
        } else {
            showResponseMessage(result.message);
        }
    } catch (error) {
        showResponseMessage(error.message);
    } finally {
        hideLoading();
    }
};

// Unarchive note
const unarchiveNote = async (noteId) => {
    showLoading();
    try {
        const response = await fetch(`${baseUrl}/notes/${noteId}/unarchive`, {
            method: 'POST',
            headers: { Authorization: 'Bearer your-access-token' },
        });
        const result = await response.json();
        // console.log('Response result:', result);
        // console.log('Unarchived note data:', result.data);
        if (response.ok) {
           // Optimistic UI update: Move the note element to active notes
            const archivedNoteElement = document.querySelector(`#note-${noteId}`);
            if (archivedNoteElement) {
                const listNotesElement = document.querySelector('#notesList');
                archivedNoteElement.classList.remove('archived-note'); // Optional styling
                listNotesElement.insertAdjacentHTML('beforeend', archivedNoteElement.outerHTML);
                archivedNoteElement.remove(); // Remove from archived list
            }

            getArchivedNotes(); // Refresh archived notes list
            showResponseMessage('Note unarchived successfully!');
        } else {
            showResponseMessage(result.message || 'Failed to unarchive note.');
        }
    } catch (error) {
        showResponseMessage(error.message);
    } finally {
        hideLoading();
    }
};



const addNoteToActive = (note) => {
    const listBookElement = document.querySelector('#notesList');
    const existingNoteElement = document.querySelector(`#note-${note.id}`);
    if (existingNoteElement) {
        existingNoteElement.remove(); 
    }
    const noteCardHTML = `
        <div class="note-card" id="note-${note.id}">
            <h2>${note.title}</h2>
            <p>${note.body}</p>
            <small>Created At: ${new Date(note.createdAt).toLocaleString()}</small>
            <button class="btn-archive" id="${note.id}">Archive</button>
            <button class="btn-delete" id="${note.id}">Delete</button>
        </div>
    `;
    listBookElement.insertAdjacentHTML('beforeend', noteCardHTML);

      // Tambahkan event listener untuk tombol baru
    const archiveButton = document.querySelector(`#note-${note.id} .btn-archive`);
    archiveButton.addEventListener('click', () => archiveNote(note.id));

    const deleteButton = document.querySelector(`#note-${note.id} .btn-delete`);
    deleteButton.addEventListener('click', () => removeNotes(note.id));
};

// Render active notes
const renderAllNotes = (notes) => {
    const listBookElement = document.querySelector('#notesList');
    listBookElement.innerHTML = '';
    notes.forEach(note => {
        listBookElement.innerHTML += `
            <div class="note-card">
                <h2>${note.title}</h2>
                <p>${note.body}</p>
                <small>Created At: ${new Date(note.createdAt).toLocaleString()}</small>
                <button class="btn-archive" id="${note.id}">Archive</button>
                <button class="btn-delete" id="${note.id}">Delete</button>
            </div>
        `;
    });

    document.querySelectorAll('.btn-archive').forEach(button => {
        button.addEventListener('click', (event) => {
            const noteId = event.currentTarget.id;
            if (!noteId) {
                console.error('Button ID is missing:', event.currentTarget); // Debugging
                return;
            }
            archiveNote(noteId);
        });
    });

    document.querySelectorAll('.btn-delete').forEach(button => {
        button.addEventListener('click', (event) => {
            const noteId = event.currentTarget.id;
            removeNotes(noteId);
        });
    });
};


// Render archived notes
const renderAllArchivedNotes = (notes) => {
    const archivedNotesElement = document.querySelector('#archivedNotesList');
    archivedNotesElement.innerHTML = '';
    notes.forEach(note => {
        archivedNotesElement.innerHTML += `
            <div class="note-card">
                <h2>${note.title}</h2>
                <p>${note.body}</p>
                <small>Created At: ${new Date(note.createdAt).toLocaleString()}</small>
                <button class="btn-unarchive" id="${note.id}">Unarchive</button>
                <button class="btn-delete" id="${note.id}">Delete</button>
            </div>
        `;
    });

    document.querySelectorAll('.btn-unarchive').forEach(button => {
        button.addEventListener('click', (event) => {
            const noteId = event.target.id;
            unarchiveNote(noteId);
        });
    });

    document.querySelectorAll('.btn-delete').forEach(button => {
        button.addEventListener('click', (event) => {
            const noteId = event.target.id;
            removeNotes(noteId);
        });
    });
};





/*
    Event Listeners
*/

document.addEventListener('DOMContentLoaded', () => {
    const activeNotesSection = document.getElementById('activeNotesSection');
    const archivedNotesSection = document.getElementById('archivedNotesSection');
    const activeNotesButton = document.getElementById('activeNotesButton');
    const archivedNotesButton = document.getElementById('archivedNotesButton');

    activeNotesButton.addEventListener('click', () => {
        activeNotesSection.style.display = 'block';
        archivedNotesSection.style.display = 'none';
    });

    archivedNotesButton.addEventListener('click', () => {
        activeNotesSection.style.display = 'none';
        archivedNotesSection.style.display = 'block';
        getArchivedNotes(); // Refresh archived notes
    });

    document.querySelectorAll('.btn-unarchive').forEach(button => {
        button.addEventListener('click', (event) => {
          const noteId = event.target.id;
          unarchiveNote(noteId);
        });
      });

    getNotes(); // Fetch and display active notes on load
});


export { getNotes, insertNotes, removeNotes };