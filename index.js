const express = require('express');

const app = express();

const notes = [
  {
    "id": 1,
    "name": "Arto Hellas",
    "number": "040-123456"
  },
  {
    "id": 2,
    "name": "Ada Lovelace",
    "number": "39-44-5323523"
  },
  {
    "id": 3,
    "name": "Dan Abramov",
    "number": "12-43-234345"
  },
  {
    "id": 4,
    "name": "Mary Poppendieck",
    "number": "39-23-6423122"
  }
];

app.get('/info', (req, res) => {
  const entries = notes.length;
  const time = new Date().toString();

  res.send(`Phonebook has info for ${entries} people.<br><br>${time}`)
})
app.get('/api/notes', (req, res) => res.json(notes));

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`App listens on port ${PORT}`);
});