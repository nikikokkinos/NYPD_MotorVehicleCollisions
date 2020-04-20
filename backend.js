    express = require('express')
    path = require('path')
    request = require('request')
    GeoJSON = require('geojson')
    fetch = require('node-fetch')

var url = 'https://data.cityofnewyork.us/resource/h9gi-nx95.json'

var settings = {
  method: "Get"
}

// function output () {
//   fetch(url, settings).then(res => res.json()).then((json) => {
//     GeoJSON.parse(json, {Point: ['lat', 'lng']})
//     })
// }

app = express()

app.set('port', (process.env.PORT || 5000))

app.use(express.static(__dirname + '/public'))

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'))
})

app.get('/NYPD_MotorVehicleCollisions', (req, res) => {
  res.send(fetch(url, settings)
     .then(res => res.json())
     .then((json) => {
      GeoJSON.parse(json, {Point: ['lat', 'lng']})
      })
    )
})

app.listen(app.get('port'), function() {
    console.log("App listening on port " + app.get('port'))
})
