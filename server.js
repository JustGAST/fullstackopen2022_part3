require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const Person = require('./models/person');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('build'));
morgan.token('body', req => JSON.stringify(req.body));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

app.get('/info', (req, res) => {
  Person.find({}).then(people => {
    const entries = people.length;
    const time = new Date().toString();

    res.send(`Phonebook has info for ${entries} people.<br><br>${time}`)
  });

});

app.get('/api/persons', (req, res) => {
  Person.find({}).then(people => {
    res.json(people);
  });
});

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);

  Person.findById(id).then(person => {
    if (!person) {
      res.statusMessage = 'No person with such id';
      res.status(404).end();

      return;
    }

    res.json(person);
  });
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

  Person.find({name: name}).then(person => {
    if (person.length > 0) {
      res.status(400).json({error: "name must be unique"});

      return;
    }

    const newPerson = new Person({
      name,
      number,
    });

    newPerson.save()
      .then(person => {
        res.json(person);
      })
  });
});

const unknownEndpoint = (req, res) => {
  res.status(404).json({error: 'unknown endpoint'});
};

app.use(unknownEndpoint);

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`App listens on port ${port}`);
});