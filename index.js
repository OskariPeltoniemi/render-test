const express = require('express')
const morgan = require('morgan')
const path = require('path')
const app = express()
const cors = require('cors')

app.use(cors())
app.use(express.json())
app.use(express.static('dist'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :personData'))

morgan.token('personData', (req, res) => {
  if (req.method === 'POST' && req.body) {
    return `Name: ${req.body.name || 'N/A'}, Number: ${req.body.number || 'N/A'}`
  }
  return ''
})

let persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456"
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523"
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234245"
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122"
  }
]

const generateId = () => {
  const maxId = persons.length > 0
    ? Math.max(...persons.map(p => Number(p.id))) 
    : 0
  return String(maxId + 1)
}

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
  const id = req.params.id
  const person = persons.find(person => person.id === id)

  if (person) {
    res.json(person)
  } else {
    res.status(404).end()
  }
})

app.post('/api/persons', (req, res) => {
  const body = req.body

  if (!body.name) {
    return res.status(400).json({ 
      error: 'name missing' 
    })
  }

  if (!body.number) {
    return res.status(400).json({ 
      error: 'number missing' 
    })
  }

  if (persons.some(person => person.name === body.name)) {
    return res.status(400).json({ 
      error: 'name must be unique' 
    })
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number,
  }

  persons = persons.concat(person)

  res.json(person)
})

app.delete('/api/persons/:id', (req, res) => {
  const id = req.params.id
  persons = persons.filter(person => person.id !== id)

  res.status(204).end()
})

app.get('/info', (req, res) => {
  const contacts = persons.length
  const time = new Date() 
  res.send(`
    Phonebook has info for ${contacts} people </br>
    ${time}
  `)
})

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'dist', 'index.html'))
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})