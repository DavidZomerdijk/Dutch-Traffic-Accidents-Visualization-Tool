//sets the view
var map = L.map('pointMap').setView([52.228172, 5.521980], 7);


//determines the background (thus the map)
 L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
        maxZoom: 18,
        id: 'mapbox.streets'
    }).addTo(map);


//creates a point
function createPoint(x,y, pointRadius, pointColor) {
    L.circle([x,y], pointRadius, {
         fill: pointColor,
         opacity: 0.5}
    ).addTo(map);
}

function show_points(d){
    clearMap()
     L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
        maxZoom: 18,
        id: 'mapbox.streets'
    }).addTo(map);

    var lat
    var long;
    for (var i = 0; i < d.length ; i++){
        lat = d[i]['lat']
        lon = d[i]['lon']
        createPoint(lat,lon, 5, 'red' )
    }
}

function clearMap(){
    for (i in map._layers) {
        if (map._layers[i].options.format == undefined) {
            try {
                map.removeLayer(map._layers[i]);
            } catch (e) {
                console.log("problem with " + e + map._layers[i]);
            }
        }
    }
}

//createRandomPoints(1,50,51,4,5,5,"red");
//createPoint(, 597775, 5, 'red' )







