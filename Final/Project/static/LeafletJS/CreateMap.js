/**
 * Created by julianhana on 18/03/17.
 */

var mymap; //map to put stuff on

//creates the map
function CreateMap(mapName, Latitude, Longitude, Zoom) {
    mymap = L.map(document.getElementById(mapName).id).setView([Latitude, Longitude], Zoom);

    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
        maxZoom: 18,
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
        '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
        'Imagery © <a href="http://mapbox.com"> Mapbox</a>',
        id: 'mapbox.streets'
    }).addTo(mymap);
}

//creates a marker
function CreateMarker(Latitude, Longitude, MarkerText, PopUpText) {
    L.marker([Latitude, Longitude]).addTo(mymap).bindPopup("<b>WMarkerText</b><br />PopUpText").openPopup();
}

//creates a point
function createPoint(locationX, locationY, PointRadius, PointColor) {
    console.log(locationX, locationY, PointRadius, PointColor);
    L.circle([locationX, locationY], PointRadius, {
        color: PointColor,
        fillColor: '#f03',
        fillOpacity: 0.5
    }).addTo(mymap).bindPopup("I am a circle.");
}

//Generates a variable between 2 numbers
function randomInRange(min, max) {
    console.log("point created");
    return Math.random() * (max - min) + min;
}

//create random points
function CreateRandomPoints(Amount, MinLatitude, MaxLatitude, MinLongitude, MaxLongitude, PointRadius, PointColor) {
    for (var i = 0; i < Amount; i++) {
        createPoint(randomInRange(MinLatitude, MaxLatitude), randomInRange(MinLongitude, MaxLongitude), PointRadius, PointColor)
    }
}


/*
 L.polygon([
 [51.509, -0.08],
 [51.503, -0.06],
 [51.51, -0.047]
 ]).addTo(mymap).bindPopup("I am a polygon.");

var popup = L.popup();
 */