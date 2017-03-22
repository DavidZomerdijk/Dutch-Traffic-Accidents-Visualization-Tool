var provinceData;

d3.select("#slider").on("input", function() {
    update( String(+this.value));
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
    update_map()
    updateChart();
}

// Load the data.
function update(year) {
    d3.select("#selectedYear").text( year );
    d3.json("/data/" + String(year), callback)
    //function that updates map
};
update(2009);
