const mongoose = require('mongoose');

console.log(process.argv.length);

if (process.argv.length < 3) {
    console.log('Please provide the password as an argument: node mongo.js <password>')
    process.exit(1)
  } else if (process.argv.length < 6 && process.argv.length > 3) {
      console.log(`added ${process.argv [3]}, number: ${process.argv [4]} to phonebook`)
  };
  
  const password = process.argv[2];
  
  const url =
    `mongodb+srv://fullstack:${password}@cluster0.q0wc2.mongodb.net/phonebook-app?retryWrites=true&w=majority`
  
  mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true });


  const personSchema = new mongoose.Schema({
      name: String,
      number: String,
  });

  const Person = mongoose.model('Person', personSchema);

  if (process.argv.length === 3) {
    Person.find({}).then(results =>{
        results.forEach(person => {
            console.log(person);
        })
        mongoose.connection.close();
    })
} else {
    const person = new Person({
        name: process.argv[3],
        number: process.argv[4]
    });
  
    person.save().then(result => {
        console.log(`${process.argv[3]} saved to phonebook`);
        mongoose.connection.close();
    });
}

  
  