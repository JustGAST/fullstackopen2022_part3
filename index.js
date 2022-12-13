const express = require('express');

const app = express();
app.use(express.json());

let persons = [
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
  const entries = persons.length;
  const time = new Date().toString();

  res.send(`Phonebook has info for ${entries} people.<br><br>${time}`)
});

app.get('/api/persons', (req, res) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.json(persons);
});

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find(person => person.id === id);

  if (!person) {
    res.statusMessage = 'No person with such id';
    res.status(404).end();

    return;
  }

  res.json(person);
});

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter(person => person.id !== id)

  res.status(204).end();
});

app.post('/api/persons', (req, res) => {
  const {name, number} = req.body;

  if (!name || !number) {
    res.status(400).end();

    return;
  }

  const person = {
    id: Math.floor(Math.random() * 9999999),
    name,
    number,
  };

  persons = persons.concat(person);

  res.json(person);
})

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`App listens on port ${PORT}`);
});