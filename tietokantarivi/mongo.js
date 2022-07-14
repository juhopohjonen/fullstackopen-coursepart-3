const mongoose = require('mongoose')

const pwd = process.argv[2]

var hasData = false
var data = {}

if (process.argv.length < 3) {
    console.log('No password as argument!')
    process.exit(1)
} else if (process.argv.length > 3) {
    hasData = true

    data.name = process.argv[3]
    data.number = process.argv[4]
}


const dbUrl = `mongodb+srv://joujoujou:${pwd}@cluster0.nxqbi.mongodb.net/?retryWrites=true&w=majority`

mongoose.connect(dbUrl)

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
    date: Date
})

const Person = mongoose.model('Person', personSchema)

if (hasData) {
    person = new Person({
        name: data.name,
        number: data.number
    })

    person.save().then(result => {
        console.log('Saved data in db')
        mongoose.connection.close()
    })

} else {
    console.log('phonebook:')

    Person.find({}).then(result => {
        result.forEach(person => {
            console.log(`${person.name} ${person.number}`)
        })

        mongoose.connection.close()
    })
}