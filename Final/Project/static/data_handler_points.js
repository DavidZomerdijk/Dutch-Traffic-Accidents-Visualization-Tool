

var zoom = function (bounds) {
    map.fitBounds(  bounds.bounds )
}

function ZoomToProvince(){

    d3.json("/getProvinceBounds", zoom)
}

ZoomToProvince()


// ------------
// old functions underneath
// ------------

var provinceData;

d3.select("#slider").on("input", function() {
    updatePointData( String(+this.value));
});


// Show the information about a particular point.
var show_info = function (d) {
    d3.select("#info").text( d );
};

var callback = function (d) {
//d3.select("#info").text( JSON.stringify(d, null, 2) );
    show_points(d)
}

// Load the data.
function updatePointData(year) {
    d3.select("#selectedYear").text( year );
    d3.json("/dataCoordinates/" + String(year), callback)
    //function that updates map
};

function updateDangerPoints(){
}

updatePointData(2015)




