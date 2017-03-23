var provinceData;
var weathercondition = "all";
var selected_year = 2009;

d3.select("#slider").on("input", function() {
    selected_year = String(+this.value)
    update( String(+this.value));
    updateweer(weathercondition)
});

function weather(value)
{
    console.log(value);
    weathercondition = value;
    updateweer( String(+this.value));
};

// Show the information about a particular point.
var show_info = function (d) {
    d3.select("#info").text( d );
};

var callback = function (d) {
    //d3.select("#info").text( JSON.stringify(d, null, 2) );
    //here we define the data variable
    provinceData = d

}

// Load the data.
function update(year) {
    d3.select("#selectedYear").text( year );
    d3.json("/data/" + String(year), callback)
    //function that updates map

};
function updateweer(weer) {
    d3.json("/data/" + selected_year + "/" + String(weathercondition), callback);
        //underneath we update the map using a function from show_map
    update_map();
    updateChart();
    }
update(2009);
updateweer(weathercondition)
