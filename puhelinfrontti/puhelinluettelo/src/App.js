import { useEffect, useState } from 'react'
import personService from './services/persons'
 
const Contact = ({ person, removeFunction }) => (
  <div>
    <p>{person.name} {person.number} <button onClick={() => removeFunction(person.id)}>delete</button></p>
  </div>
)

const Filter = ({ inputValue, onInputChange }) => (
  <div>
  filter shown with <input value={inputValue} onChange={onInputChange} />
</div>
)


const SuccessNotification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className='success'>
      {message}
    </div>
  )

}

const ErrorNotification = ({ message }) => {
  if (message == null) {
    return null
  }

  return (
    <div className='error'>
      {message}
    </div>
  )
}


const App = () => {

  const [persons, setPersons] = useState([])

  const [successMsg, setSuccessMsg] = useState(null)
  const [errorMsg, setErrorMsg] = useState(null)
 
  const getPersons = () => {
    personService.getAllPersons()
      .then(response => {
        setPersons(response.data)
      })
  }

  useEffect(getPersons, [])

  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

  const handleInputChange = (event) => {
    setNewName(event.target.value);
  }

  const handleNumberChenge = (event) => {
    setNewNumber(event.target.value);
  }

  const filterBy = (event) => {
    setFilter(event.target.value);
  }

  const createPersonObject = () => {
    const personObject = {
      name: newName,
      number: newNumber
    }

    return personObject
  }

  const personsToShow = filter === '' 
  ? persons
  : persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))

  const addNewPerson = (event) => {
    event.preventDefault();

    const personExistsAlready = doesPersonExist()

    if (personExistsAlready !== false) {
      
      //alert(`${newName} is already added to phonebook`)

      const confirmation = window.confirm(
        `${newName} is already added to phonebook, replace the old number with a new one?`
      )

      if (!confirmation) {
        return
      }

      const newPerson = createPersonObject();
      handlePut(newPerson, personExistsAlready.id)

 

    } else {
      const personObject = createPersonObject();
  
      personService.newPerson(personObject)
      .then(response => {
        setPersons(persons.concat(response.data))
        setSuccessMsg(
          `Added ${response.data.name}`
        )

        setTimeout(() => {
          setSuccessMsg(null)
        }, 5000);
      })
      .catch(error => {
        console.log('error obj', error.response.data.error)
        setErrorMsg(error.response.data.error)

        setTimeout(() => {
          setErrorMsg(null)
        }, 5000)
      })

    } 
    

  }

  const handleRemove = postId => {
    const confirm = window.confirm('Are you sure you want to remove this contact?')

    if (!confirm) {
      return
    }

    const personName = [...persons].filter(person => person.id === postId)[0].name
    
    personService.removePerson(postId)
    .then(
      setPersons(
        persons.filter(person => person.id !== postId)
      )
    )
    .catch(error => {
      setErrorMsg(
        `Information of '${personName}' has already beed removed from server`
      )
      setTimeout(() => {
        setErrorMsg(null)
      }, 5000);
    })


  }

  const handlePut = (person, id) => {
    console.log('called handleput func')

    personService.putPerson(person, id)
    .then(response => {
      const filteredPersons = persons.filter(person => person.id !== id)      
      const newPerson = response.data

      filteredPersons.push(newPerson)
      
      setPersons(filteredPersons)
    
    })
  }
  
  const doesPersonExist = () => {
    const fakeNewPerson = createPersonObject()

    const currentPersons = [...persons].filter(person => person.name === fakeNewPerson.name)

    if (currentPersons.length > 0) {
      return currentPersons[0]
    }
   

    return false;
  }


  return (
    <div>

      <SuccessNotification message={successMsg} />
      <ErrorNotification message={errorMsg} />

      <h2>Phonebook</h2>

      <Filter inputValue={filter} onInputChange={filterBy} />
 
      <h2>add a new</h2>
      <form onSubmit={addNewPerson}>
        <div>
          name: <input value={newName} onChange={handleInputChange} />
        </div>

        <div>number: <input value={newNumber} onChange={handleNumberChenge} /></div>

        <div>
          <button type="submit">add</button>
        </div>

      </form>
      <h2>Numbers</h2>
      
      {personsToShow.map(person => <Contact key={person.name} removeFunction={handleRemove} person={person} />)}

    </div>
  )

}

export default App