const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://oskup99:${password}@fullstack.8pdyl.mongodb.net/?retryWrites=true&w=majority&appName=fullstack`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    required: true,
  },
  number: {
    type: String,
    required: true,
  },
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
    console.log('Contacts:')
    Person.find({}).then(result => {
      result.forEach(person => {
        console.log(`${person.name} ${person.number}`)
      })
      mongoose.connection.close()
    })
  } else if (process.argv.length === 5) {
    const name = process.argv[3]
    const number = process.argv[4]
  
    const person = new Person({
      name: name,
      number: number,
    })
  
    person.save().then(() => {
      console.log(`added ${name} number ${number} to phonebook`)
      mongoose.connection.close()
    })
  } else {
    console.log('Invalid number of arguments. Use either:')
    console.log('node mongo.js <password>')
    console.log('or')
    console.log('node mongo.js <password> <name> <number>')
    process.exit(1)
}

module.exports = mongoose.model('Person', personSchema);