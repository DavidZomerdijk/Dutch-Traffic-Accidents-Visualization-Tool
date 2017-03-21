//sets the view
var map = L.map('pointMap').setView([52.228172, 5.521980], 7);


//determines the background (thus the map)
 L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
        maxZoom: 18,
        id: 'mapbox.streets'
    }).addTo(map);


//creates a point
function createPoint(locationX, locationY, PointRadius, PointColor) {
    console.log(locationX, locationY, PointRadius, PointColor);


    L.circle([locationX, locationY], PointRadius, {
         fill: "red",
         opacity: 0.5}
    ).addTo(map);
}

//Generates a variable between 2 numbers
function randomInRange(min, max) {
    console.log( Math.random() * (max - min) + min);
    return Math.random() * (max - min) + min;
}

//create random points
function createRandomPoints(Amount, MinLatitude, MaxLatitude, MinLongitude, MaxLongitude, PointRadius, PointColor) {
    for (var i = 0; i < Amount; i++) {
        createPoint(randomInRange(MinLatitude, MaxLatitude), randomInRange(MinLongitude, MaxLongitude), PointRadius, PointColor)
    }
    console.log("createRandomPoint")
}

createRandomPoints(200,50,51,4,5,5,"red");








