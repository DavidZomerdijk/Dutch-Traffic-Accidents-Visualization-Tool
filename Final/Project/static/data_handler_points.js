

var zoom = function (bounds) {
    console.log(JSON.stringify( bounds))
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


// Show the information about a particular pointMap.
var show_info = function (d) {
    d3.select("#info").text( d );
};

var callback = function (d) {
d3.select("#info").text( JSON.stringify(d, null, 2) );
    console.log(d[0])
    show_points(d)
}

// Load the data.
function updatePointData(year) {
    d3.select("#selectedYear").text( year );
    d3.json("/dataCoordinates/" + String(year), callback)
    //function that updates map
};

updatePointData(2015)




