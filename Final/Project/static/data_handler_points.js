

var zoom = function (bounds) {
    map.fitBounds(  bounds.bounds )
}

function ZoomToProvince(){

    d3.json("/getProvinceBounds", zoom)
}

ZoomToProvince()

$(document).ready(function(){
    $('#dangerPointButton').click(function(){
       updateDangerPoints();
    });
  });


// ------------
// old functions underneath
// ------------

var year = "2013";

var provinceData;

d3.select("#slider").on("input", function() {
//    year =  String(+this.value);
    year = this.value;
    updatePointData();
});


// Show the information about a particular pointMap.
var show_info = function (d) {
    d3.select("#info").text( d );
};

var callback = function (d) {
//d3.select("#info").text( JSON.stringify(d, null, 2) );
    show_points(d)
}

// Load the data.
function updatePointData() {
    d3.select("#selectedYear").text( year );
    d3.json("/dataCoordinates/" + String(year), callback)
    //function that updates map
};


//---------------------------------------
// create dangerPoints
//---------------------------------------
var dangerLayer = null

var dangerCallback = function (d) {
    var rect;
    d3.select("#dangerPoints").text( JSON.stringify(d, null, 2) );

    if(dangerLayer != null){
        map.removeLayer(dangerLayer);
    }

    var points = []
    for (var i = 0; i < d.dangerousPoints.length ; i++){

        rect = L.rectangle(d.dangerousPoints[i].bounds, {color: 'blue', weight: 1})
        points.push( rect)
    }
    dangerLayer = L.layerGroup(points).addTo(map)
    map.addLayer(dangerLayer)
    //    var bounds = [[53.912257, 27.581640], [53.902257, 27.561640]];
    //    var rect = L.rectangle(bounds, {color: 'blue', weight: 1}).on('click', function (e)
}

function updateDangerPoints(){
    console.log("button is clicked");
    d3.json("/dangerousPoints/", dangerCallback)

}



updatePointData(2015);




