const noteForm = document.getElementById('noteForm');
const noteDateInput = document.getElementById('noteDate');
const noteTextInput = document.getElementById('noteText');
const notesListContainer = document.getElementById('notesList');
const filterDateInput = document.getElementById('filterDate');
const btnClearFilter = document.getElementById('btnClearFilter');



let allNotes = [];

async function fetchNotes() {
    const response = await fetch('/api/notes');
    allNotes = await response.json();
    applyFilterAndRender();
}

function applyFilterAndRender() {
    const filterValue = filterDateInput.value;
    let filteredNotes = allNotes;

    if (filterValue) {
        filteredNotes = allNotes.filter(note => note.date === filterValue);
    }

    renderNotes(filteredNotes);
}

function renderNotes(notes) {
    notesListContainer.innerHTML = '';

    if (notes.length === 0) {
        notesListContainer.innerHTML = '<p class="no-notes">No entries found. Your logs will appear here.</p>';
        return;
    }

    notes.sort((a, b) => new Date(b.date) - new Date(a.date));

    notes.forEach(note => {
        const noteElement = document.createElement('div');
        noteElement.classList.add('note-item');
        
        const formattedDate = new Date(note.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        noteElement.innerHTML = `
            <div class="note-content">
                <span class="note-date">${formattedDate}</span>
                <p style="white-space: pre-wrap;">${note.text}</p>
            </div>
            <button class="btn-delete" onclick="deleteNote('${note.id}')">Delete</button>
        `;
        
        notesListContainer.appendChild(noteElement);
    });
}

filterDateInput.addEventListener('input', applyFilterAndRender);

btnClearFilter.addEventListener('click', () => {
    filterDateInput.value = '';
    applyFilterAndRender();
});

noteForm.addEventListener('submit', async function(event) {
    event.preventDefault();

    const response = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            date: noteDateInput.value,
            text: noteTextInput.value
        })
    });

    if (response.ok) {
        noteTextInput.value = '';
        fetchNotes();
    }
});

async function deleteNote(noteId) {
    const response = await fetch(`/api/notes/${noteId}`, {
        method: 'DELETE'
    });

    if (response.ok) {
        fetchNotes();
    }
}

fetchNotes();