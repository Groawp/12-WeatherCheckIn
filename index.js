const express = require("express")
const Datastore = require("nedb")
require('dotenv').config()
const fetch = require("node-fetch")
const API_KEY = process.env.API_KEY

const app = express()
const port = 3000
app.use(express.static('public'))
app.use(express.json())

const database = new Datastore('database.db')
database.loadDatabase()

app.get('/api/:latlon', async (req,res) => {
    const latlon = req.params.latlon.split(',')
    const lat = latlon[0]
    const lon = latlon[1]
    const api_url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=imperial`

    var response = await fetch(api_url)
    var fetres = await response.json()
    res.json(fetres)
    
})

app.post('/api', (req,res) => {
    const request = req.body
    const dateString = new Date(request.timestamp).toLocaleString()
    request["date"] = dateString
    console.log("Incoming data....")
    console.log(request)
    database.insert(request)
    database.count({}, function (err, count) {
        res.send({feedback: "Success", currentCheckIn: count})
        // count equals to 4
    });
})

app.get('/data', (req,res) => {
    database.find({}, (err,data)=> {
        if (err) {
            res.end();
            return;
        }
        else {
            console.log(data)
            res.json(data)
        }
    })
})



app.listen(3000, () => console.log(`Server listening at port ${port}...`))


