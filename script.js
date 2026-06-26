document.addEventListener('DOMContentLoaded', () => {
    const noteForm = document.getElementById('noteForm');
    const notesList = document.getElementById('notesList');
    const filterDate = document.getElementById('filterDate');
    const btnClearFilter = document.getElementById('btnClearFilter');

    async function fetchNotes(dateFilter = '') {
        try {
            const url = dateFilter ? `/api/notes?date=${dateFilter}` : '/api/notes';
            const response = await fetch(url);
            const notes = await response.json();
            
            notesList.innerHTML = notes.length === 0 ? '<p class="no-notes">No notes available.</p>' : '';
            
            notes.forEach(note => {
                const div = document.createElement('div');
                div.className = 'note-card';
                div.innerHTML = `
                    <h3>${note.title}</h3>
                    <small>${note.date}</small>
                    <p>${note.content}</p>
                    <button onclick="deleteNote('${note._id}')" class="btn-delete">Delete</button>
                `;
                notesList.appendChild(div);
            });
        } catch (err) {
            console.error(err);
        }
    }

    noteForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const noteData = {
            date: document.getElementById('noteDate').value,
            title: document.getElementById('noteTitle').value,
            content: document.getElementById('noteText').value
        };
        await fetch('/api/notes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(noteData)
        });
        noteForm.reset();
        fetchNotes();
    });

    filterDate.addEventListener('change', (e) => fetchNotes(e.target.value));
    btnClearFilter.addEventListener('click', () => {
        filterDate.value = '';
        fetchNotes();
    });

    window.deleteNote = async (id) => {
        await fetch(`/api/notes/${id}`, { method: 'DELETE' });
        fetchNotes();
    };

    fetchNotes();
});
