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

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
    .then(person => {
        if (person) {
            response.json(person);
        } else {
            response.status(404).end();
        }
    })
    .catch(error => next(error))
});

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndRemove(request.params.id)
    .then(result => {
        response.status(204).end()
    })
    .catch(error => next(error))
});

app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body;

    const person = {
        name: body.name,
        number: body.number
    };

    Person.findByIdAndUpdate(request.params.id, person, {new: true})
    .then(updatedPerson => {
        response.json(updatedPerson);
    })


})


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

app.get('/info', (request, response, next) => {
    const personsSum = Person.estimatedDocumentCount({})
    .then((count) => {
        response.send(`<p>Phonebook has ${count} persons</p><p>${Date()}</p>`)
    })
    .catch(error => next(error));
    
});

const errorHandler = (error, request, response, next) => {
    console.error(error);

    if (error.name === 'CastError') {
        response.status(400).send({error: 'Malformatted id'});
    };
    
    next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
});