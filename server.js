const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

let notesDatabase = [];

app.get('/api/notes', (req, res) => {
    res.json(notesDatabase);
});

app.post('/api/notes', (req, res) => {
    const { date, text } = req.body;
    
    if (!date || !text) {
        return res.status(400).json({ error: "Date and Text are required" });
    }

    const newNote = {
        id: Date.now().toString(),
        date,
        text
    };

    notesDatabase.push(newNote);
    res.status(201).json(newNote);
});

app.delete('/api/notes/:id', (req, res) => {
    const { id } = req.params;
    notesDatabase = notesDatabase.filter(note => note.id !== id);
    res.json({ message: "Note deleted successfully" });
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});