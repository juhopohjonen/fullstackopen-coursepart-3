import axios from "axios";
const baseUrl = 'https://guarded-inlet-19710.herokuapp.com/api/persons'

const getAllPersons = () => {
    return axios.get(baseUrl)
}

const newPerson = personObj => {
    return axios.post(baseUrl, personObj)
}

const removePerson = (personId) => {
    const personResource = `${baseUrl}/${personId}`
    return axios.delete(personResource)
}

const putPerson = (personObj, personId) => {
    const personResource = `${baseUrl}/${personId}`
    return axios.put(personResource, personObj)
}

export default {
    getAllPersons: getAllPersons,
    newPerson: newPerson,
    removePerson: removePerson,
    putPerson: putPerson
}