const express = require('express');
const { response } = require('express');
const app = express();
const cors = require('cors');
const Person = require('./models/person');



app.use(cors());
app.use(express.static('build'));
app.use(express.json());

var morgan = require('morgan');

morgan.token('post', (request) => {
    if (request.method === 'POST')
      return JSON.stringify(request.body)
    else
      return ''
  });

  morgan.format('postFormat', ':method :url :status :res[content-length] - :response-time ms :post');

app.use(morgan('postFormat'));


app.get('/', (request, response) => {
    response.send("<h1>Hello There</h1>");
});

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons);
    });
});

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    const person = persons.find(person => person.id === id);
    
    if (person) {
        response.json(person);
    } else {
        response.status(404).end();
    }
});

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);

    persons.filter(person => person.id !== id);

    res.status(204).end();
});


app.post('/api/persons', (request, response) => {
    const body = request.body;
    console.log(body.name)

    if (body.name === undefined) {
        return response.json({ error: 'Content missing'})
    };

    const person = new Person({
        name: body.name,
        number: body.number
    });

    person.save().then(savedPerson => {
        response.json(savedPerson)
    });
  });

app.get('/info', (request, response) => {
    const personsSum = persons.length;
    response.send(`<p>Phonebook has ${personsSum} persons</p><p>${Date()}</p>`)
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
});