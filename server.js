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

app.get('/info', (req, res, next) => {
  Person.find({})
    .then(people => {
      const entries = people.length;
      const time = new Date().toString();

      res.send(`Phonebook has info for ${entries} people.<br><br>${time}`)
    })
    .catch(error => next(error));
});

app.get('/api/persons', (req, res, next) => {
  Person.find({})
    .then(people => {
      res.json(people);
    })
    .catch(error => next(error));
});

app.get('/api/persons/:id', (req, res, next) => {
  const id = req.params.id;

  Person.findById(id)
    .then(person => {
      if (!person) {
        res.status(404).end();

        return;
      }

      res.json(person);
    })
    .catch(error => next(error));
});

app.delete('/api/persons/:id', (req, res, next) => {
  const id = req.params.id;

  Person.findByIdAndDelete(id)
    .then(() => {
      res.status(204).end();
    })
    .catch(error => next(error));
});

app.post('/api/persons', (req, res, next) => {
  const {name, number} = req.body;

  Person.find({name: name})
    .then(person => {
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
        .catch(error => next(error));
    })
    .catch(error => next(error));
});

app.put('/api/persons/:id', (req, res, next) => {
  const id = req.params.id;
  const {name, number} = req.body;

  if (!number) {
    res.status(400).json({error: "number is missing"});

    return;
  }

  Person.findByIdAndUpdate(id, {name, number}, {new: true, runValidators: true, context: 'query'})
    .then(updatedPerson => {
      res.json(updatedPerson);
    })
    .catch(error => next(error));
});

const unknownEndpoint = (req, res) => {
  res.status(404).json({error: 'unknown endpoint'});
};

const errorHandler = (error, req, res, next) => {
  console.log(error.message);

  if (error.name === 'CastError') {
    return res.status(404).send({error: 'malformatted id'});
  }
  if (error.name === 'ValidationError') {
    return res.status(400).send({error: error.message});
  }

  next(error);
};

app.use(unknownEndpoint);
app.use(errorHandler);

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`App listens on port ${port}`);
});