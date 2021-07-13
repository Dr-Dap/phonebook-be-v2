const mongoose = require('mongoose');

const url = 
'mongodb+srv://fullstack:fullstack@cluster0.q0wc2.mongodb.net/phonebook-app?retryWrites=true&w=majority';

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  });

  const personSchema = new mongoose.Schema({
      name: String,
      number: String
  });

  personSchema.set('toJSON', {
      transform: (document, returnedObject) => {
          returnedObject.id = returnedObject._id.toString();
          delete returnedObject._id;
          delete returnedObject.__v;
      }
  })

  module.exports = mongoose.model('Person', personSchema);