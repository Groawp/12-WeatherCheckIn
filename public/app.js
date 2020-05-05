console.log("Weather check in starting....")

var lat, lon, timestamp = 0
const api_key = '658857decc6488835aba34b408f9887a'
var firstTime = true
var submitTime = new Date()

const showPosition = (pos) => {
    document.querySelector('#submit').addEventListener('click', async () => {
        console.log(pos.coords)
        lat = pos.coords.latitude
        lon = pos.coords.longitude
        timestamp = pos.timestamp
        submitTime = Date(timestamp).toLocaleString()
        document.querySelector('#lat').textContent = lat.toFixed(2)
        document.querySelector('#lon').textContent = lon.toFixed(2)
        const api_url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}&units=imperial`
        console.log(api_url)
        
        // Fetching weather API
        const res = await fetch(api_url)
        const weatherdata = await res.json()
        document.querySelector('#city').textContent = weatherdata.name

        //Create Element
        
        
        document.querySelector('.desc').textContent = weatherdata.weather[0].description
               
        const icon = document.createElement('img')
        const ico = weatherdata.weather[0].icon
        icon.src = `http://openweathermap.org/img/wn/${ico}@2x.png`
        
        document.querySelector('.temperature').textContent = weatherdata.main.temp.toFixed(0) + '° F'
        document.querySelector('.feel-like').textContent = "...but feels like " + weatherdata.main.feels_like.toFixed(0) + '° F'
        if (firstTime) {
        document.querySelector('.icon').appendChild(icon)
        firstTime = false
        document.querySelector('.saving').style.cssText = 'visibility: visible; opacity: 1'
        document.querySelector('.info').style.cssText = 'visibility: visible; opacity: 1'
        document.querySelector('.container').style.cssText = 'visibility: visible; opacity: 1'
        document.querySelector('#submit').style.cssText = 'visibility: hidden;'
        }

    })
}

if (navigator.geolocation) {
    navigator.geolocation.watchPosition(showPosition)
}
else {
    console.log("Geolocation is not supported")
}

document.querySelector('#post').addEventListener('click', async () => {
    const data = { lat, lon, timestamp }
    console.log('SendingData...')
    console.log(data)
    option = {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' },
    }
    const response = await fetch('/api', option)
    const feedback = await response.json()
    console.log(feedback)
    if (feedback.feedback == "Success") {
        document.querySelector('.success').textContent = `Successfully saved at ${submitTime}`
    }
    else {
        document.querySelector('.success').textContent = `Error ! Check in cannot be saved.`

    }
})
