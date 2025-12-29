const express = require('express')
const app = express()

app.use(express.json())
app.use(express.static('dist'))

let persons = [
    {
      "id": "1",
      "name": "Arto Hellas",
      "number": "040-123456"
    },
    {
      "id": "2",
      "name": "Ada Lovelace",
      "number": "39-44-5323523"
    },
    {
      "id": "3",
      "name": "Dan Abramov",
      "number": "12-43-234345"
    },
    {
      "id": "4",
      "name": "Mary Poppendieck",
      "number": "39-23-6423122"
    }
]

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/info', (request, response) => {
  const timeReceived = Date()
  const entriesCount = persons.length
  const body = `Phonebook has info for ${entriesCount} people\n\n${timeReceived}`

  response.set('Content-Type', 'text/plain')
  response.send(body)
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = persons.find(person => person.id === id)

  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

app.post('/api/persons', (request, response) => {
  const nameExists = (name) => persons.some(person => person.name === name)

  let newPerson = request.body
  if (!newPerson.name) {
    response.status(422).send({error: 'name must be included'})
  } else if (!newPerson.phone) {
    response.status(422).send({error: 'phone number must be included'})
  } else if (nameExists(newPerson.name)) {
    response.status(422).send({error: 'that name already exists'})
  } else {
    const id = String(Math.floor(Math.random() * 1000))
    newPerson = {...newPerson, id}
    persons = persons.concat({id, ...newPerson})

    response.json(newPerson)
  }
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

