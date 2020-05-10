console.log("Weather check in starting....");

var lat,
  lon,
  timestamp = 0;
var firstTime = true;
var submitTime = new Date();
var latlon = { lat, lon };
var city = ''


// SHOW MAP

document.querySelector(".map-link a").addEventListener("click", async () => {
  document.querySelector(".map-wrapper").style.cssText =
    "visibility: visible; opacity: 1; ";
  document.querySelector(".info").style.cssText =
    "visibility: hidden; opacity: 0";
  document.querySelector(".container").style.cssText =
    "visibility: hidden; opacity: 0";
  document.querySelector("body").style.cssText =
    "background: linear-gradient(rgba(0,0,0,0.4),rgba(0,0,0,0.4)),url(sky.jpg) center no-repeat;";
  document.querySelector("#submit").style.cssText = "visibility: hidden;";
})

  //load database
async function getDb() {
const dbresponse = await fetch('/data');
dbdata = await dbresponse.json();
console.log(dbdata);
return dbdata;
}
  // MAP SECTION

let mymap = L.map("mapid").setView([0, 0], 2);
// Add tiles to map with Mapbox token
L.tileLayer(
  "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
  {
    attribution:
      'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 5,
    id: "mapbox/streets-v11",
    tileSize: 512,
    zoomOffset: -1,
    accessToken:
      "pk.eyJ1IjoicGV5YWtldzcwMCIsImEiOiJjazltYngzczkwNTUyM2t0c2VqcXM2bDZ2In0.lgXSipZ4X7mIhSzHLuuaxA",
  }
).addTo(mymap);

//Add marker to map

 function getMap() {
var timesRun = 0;
var interval = setInterval(async function(){
    timesRun += 1;
    if(timesRun === 2){
        clearInterval(interval);
    }
    const locationArray = await getDb();
    const updateMap = locationArray.forEach(location => {
        console.log(`${location.city} has been saved to map.`)
        var marker = L.marker([location.lat, location.lon]).addTo(mymap);
        marker.setLatLng([location.lat, location.lon]);
    })
}, 2000)}; 

getMap();


const showPosition = (pos) => {
  document.querySelector("#submit").addEventListener("click", async () => {
    //console.log(pos.coords);
    lat = pos.coords.latitude.toFixed(2);
    lon = pos.coords.longitude.toFixed(2);
    timestamp = pos.timestamp;
    submitTime = Date(timestamp).toLocaleString();
    document.querySelector("#lat").textContent = lat;
    document.querySelector("#lon").textContent = lon;

    //Fetching weather API from Node Server
    const res = await fetch(`/api/${lat},${lon}`);
    const weatherdata = await res.json();
    console.log(weatherdata);
    document.querySelector("#city").textContent = weatherdata.name;
    city = weatherdata.name 

    //Create Element

    document.querySelector(
      ".checkin-count"
    ).textContent = `(${weatherdata.currentCheckIn})`;

    document.querySelector(".desc").textContent =
      weatherdata.weather[0].description;

    const icon = document.createElement("img");
    const ico = weatherdata.weather[0].icon;
    icon.src = `http://openweathermap.org/img/wn/${ico}@2x.png`;

    // Extracting JSON to Web UI
    document.querySelector(".temperature").textContent =
      weatherdata.main.temp.toFixed(0) + "° F";
    document.querySelector(".feel-like").textContent =
      "...but feels like " + weatherdata.main.feels_like.toFixed(0) + "° F";
    if (firstTime) {
      document.querySelector(".icon").appendChild(icon);
      firstTime = false;

      document.querySelector(".map-wrapper").style.cssText =
        "visibility: hidden; opacity: 0; ";
      document.querySelector(".info").style.cssText =
        "visibility: visible; opacity: 1";
      document.querySelector(".container").style.cssText =
        "visibility: visible; opacity: 1";
      document.querySelector("body").style.cssText =
        "background: linear-gradient(rgba(0,0,0,0.5),rgba(0,0,0,0.5)),url(bg.jpg) center no-repeat;";
      document.querySelector("#submit").style.cssText = "visibility: hidden;";
    }
  });
};

if (navigator.geolocation) {
  navigator.geolocation.watchPosition(showPosition);
} else {
  console.log("Geolocation is not supported");
}

document.querySelector(".logo a").addEventListener("click", showPosition);

document.querySelector("#post").addEventListener("click", async () => {
  const data = {city, lat, lon, timestamp };
  console.log("Sending Data To Node Server...");
  console.log(data);
  option = {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
  };
  const response = await fetch("/api/", option);
  const feedback = await response.json();
  console.log(feedback);
  if (feedback.feedback == "Success") {
    document.querySelector(
      ".success"
    ).textContent = `Successfully saved at ${submitTime}`;
    document.querySelector(
      ".checkin-count"
    ).textContent = `(${feedback.currentCheckIn})`;
  } 
  else {
    document.querySelector(".success").textContent = `Error ! Check in cannot be saved.`;
  }
})

