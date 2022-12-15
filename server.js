const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('build'));
morgan.token('body', req => JSON.stringify(req.body));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

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
    res.status(400).json({error: "name or number is missing"});

    return;
  }

  const person = persons.find(person => person.name === name);
  if (person) {
    res.status(400).json({error: "name must be unique"});

    return;
  }

  const newPerson = {
    id: Math.floor(Math.random() * 9999999),
    name,
    number,
  };

  persons = persons.concat(newPerson);

  res.json(newPerson);
});

const unknownEndpoint = (req, res) => {
  res.status(404).json({error: 'unknown endpoint'});
};

app.use(unknownEndpoint);

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`App listens on port ${port}`);
});