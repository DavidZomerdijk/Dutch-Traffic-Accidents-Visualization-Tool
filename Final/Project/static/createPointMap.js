
//sets the view
var map = L.map('pointMap').setView([52.228172, 5.521980], 7);
var pointLayer = null

//determines the background (thus the map)
 L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
        maxZoom: 18,
        id: 'mapbox.streets'
    }).addTo(map);


//creates a point
function createPoint(lat,lon, pointRadius, opacity ,  pointColor) {
    return L.circle([lat,lon], pointRadius, {
         fillColor: pointColor,
         fillOpacity: opacity,
         weight: 0
         }
    )
}

function show_points(d){
    if(pointLayer != null){
        map.removeLayer(pointLayer);
    }

    var points = []
    var lat
    var long;
    for (var i = 0; i < d.length ; i++){
        lat = d[i]['lat']
        lon = d[i]['lon']


        points.push( createPoint(lat,lon, 40, 0.5,'red' ))


    }
    pointLayer = L.layerGroup(points).addTo(map)
    map.addLayer(pointLayer)
}



//createRandomPoints(1,50,51,4,5,5,"red");
//createPoint(, 597775, 5, 'red' )







