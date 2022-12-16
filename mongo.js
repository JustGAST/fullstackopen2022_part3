const mongoose = require('mongoose');

const COMMAND_PHONEBOOK = 'phonebook';
const COMMAND_ADD_PERSON = 'add_person';

let command = COMMAND_PHONEBOOK;
if (process.argv.length < 3) {
  console.log('Please provide the password as an argument to get phonebook: node mongo.js <password>');
  console.log('Or provide also name and number to add person to phonebook: node mongo.js <password> "Ivan Ivanovich" 123213-213123');
  process.exit(1);
}

if (process.argv.length === 5) {
  command = COMMAND_ADD_PERSON;
}

const password = process.argv[2]
const url = `mongodb+srv://fullstackopen:${password}@cluster0.szbcl.mongodb.net/phonebook?retryWrites=true&w=majority`

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model('Person', personSchema);

const phonebook = () => {
  Person.find({}).then(people => {
    console.log('Phonebook:');
    people.forEach(person => {
      console.log(`${person.name} ${person.number}`);
    });

    return mongoose.connection.close();
  })
};

const addPerson = () => {
  new Person({
    name: process.argv[3],
    number: process.argv[4],
  }).save().then(person => {
    console.log(`Added ${person.name} ${person.number} to phonebook`);

    return mongoose.connection.close();
  });

}

mongoose
  .set('strictQuery', false)
  .connect(url)
  .then(() => {
    console.log('connected')

    switch (command) {
      case COMMAND_PHONEBOOK:
        return phonebook();
      case COMMAND_ADD_PERSON:
        return addPerson();
      default:
        console.log('Unknown command');
    }
  })
  .catch((err) => console.log(err))