

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


// Show the information about a particular point.
var show_info = function (d) {
    d3.select("#info").text( d );
};

var callback = function (d) {
d3.select("#info").text( JSON.stringify(d, null, 2) );
    //here we define the data variable
    provinceData = d

    //underneath we update the map using a function from show_map
    //update_map()
}

// Load the data.
function updatePointData(year) {
    d3.select("#selectedYear").text( year );
    d3.json("/dataCoordinates/" + String(year), callback)
    //function that updates map
};

updatePointData(2015)




