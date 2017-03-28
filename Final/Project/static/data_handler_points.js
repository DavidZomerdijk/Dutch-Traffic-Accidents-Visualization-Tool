
var info = L.control();
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
    d3.select("#info").text( JSON.stringify(d, null, 2) );
    show_points(d)

}

// Load the data.
function updatePointData() {
    d3.select("#selectedYear").text( year );
    d3.json("/dataCoordinates/" + String(year), callback)
    d3.select("#title").text( "Traffic accidents in Noord-Holland" );
    //function that updates map
};
//---------------------------------------
// display data on dangerpoints
//---------------------------------------
// DangerousPoints
function dangerInfo(d){
    var inf = L.control({position: "topright"});

    inf.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'title')
        div.innerHTML = '<h1 id="pointTitle"> Traffic accidents in ' + d.province + '</h1>'
        return div;
    };
    inf.addTo(map);
}

//---------------------------------------
// create dangerPoints
//---------------------------------------

var dangerLayer = null

var dangerCallback = function (d) {
    //a function that maps the points in text
    dangerInfo(d);

    var rect;
    d3.select("#dangerPoints").text( JSON.stringify(d, null, 2) );

    if(dangerLayer != null){
        map.removeLayer(dangerLayer);
    }

    var points = []

    //zoom to most dangerous spot
    map.fitBounds(  d.dangerousPoints[0].bounds )

    for (var i = 0; i < d.dangerousPoints.length ; i++){
        //if(bounds[0][0] == bounds[1][0] && bounds[0][1] == bounds[1][1]){

//        rect = L.rectangle(d.dangerousPoints[i].bounds, {fillcolor: 'blue', weight: 3})

        //}else{

        rect = L.rectangle(d.dangerousPoints[i].bounds, {fillcolor: 'blue', weight: 3})
        points.push( rect)}

    dangerLayer = L.layerGroup(points).addTo(map)
    map.addLayer(dangerLayer)


    //    var bounds = [[53.912257, 27.581640], [53.902257, 27.561640]];
    //    var rect = L.rectangle(bounds, {color: 'blue', weight: 1}).on('click', function (e)
}

function updateDangerPoints(){
    console.log("button is clicked");
    d3.json("/dangerousPoints/"  + String(year) , dangerCallback)

}

updatePointData(2015);









