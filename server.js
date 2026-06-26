const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect("mongodb+srv://harshsrivastav9315633_db_user:e8bCsHHnOJEwgPBm@cluster0.yjhovgu.mongodb.net/?appName=Cluster0");

const Note = mongoose.model('Note', new mongoose.Schema({
    date: String,
    title: String,
    content: String
}));

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

app.get('/api/notes', async (req, res) => {
    const query = req.query.date ? { date: req.query.date } : {};
    const notes = await Note.find(query);
    res.json(notes);
});

app.post('/api/notes', async (req, res) => {
    const newNote = new Note(req.body);
    await newNote.save();
    res.status(201).json(newNote);
});

app.delete('/api/notes/:id', async (req, res) => {
    await Note.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
