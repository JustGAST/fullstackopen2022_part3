const mongoose = require('mongoose');

const url = process.env.MONGODB_URI

mongoose.set('strictQuery', false);
mongoose.connect(url)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(err => {
    console.log('Error connecting to MongoDB: ', err.message);
  });


const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true,
  },
  number: {
    type: String,
    validate: {
      validator: value => (
        /\d{2,3}-\d+/.test(value)
      ),
      message: props => `${props.value} is not a valid phone number`
    },
    required: true,
  },
});

personSchema.set('toJSON', {
  transform: (document,  returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
})

module.exports = mongoose.model('Person', personSchema);
