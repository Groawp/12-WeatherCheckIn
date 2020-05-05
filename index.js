const express = require("express")
const Datastore = require("nedb")
require('dotenv').config()

const app = express()
const port = 3000
app.use(express.static('public'))
app.use(express.json())

const database = new Datastore('database.db')
database.loadDatabase()

app.get('/api', (req,res) => {
    
})

app.post('/api', (req,res) => {
    const request = req.body
    const dateString = new Date(request.timestamp).toLocaleString()
    request["date"] = dateString
    console.log("Incoming data....")
    console.log(request)
    database.insert(request)
    res.send({feedback: "Success"})
})

app.listen(3000, () => console.log(`Server listening at port ${port}...`))


