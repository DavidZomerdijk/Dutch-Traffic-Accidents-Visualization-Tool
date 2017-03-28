

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
// display data on dangerpoints
//---------------------------------------
info.update = function(props, data) {
    this._div.innerHTML = (props ?  '<b>'  + props.OMSCHRIJVI  +
    '<p>#accidents:</p>' +   String(accidents) +    '<p>Accidents per capita:</p>' +  accidents_per_capita
            : 'Hover over a state');
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




