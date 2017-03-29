var weathercondition = "all";
var selected_year = 2009;

d3.select("#slider").on("input", function() {
    selected_year = String(+this.value);
    update( String(+this.value));
    updateweer(weathercondition);
});

function weather(value)
{
    weathercondition = value;
    updateWeer();
};

// Show the information about a particular point.
var show_info = function (d) {
    d3.select("#info").text( d );
};

function updateMaxValue(){
    $.ajax({
      url: "/maxvalue",
      dataType: 'json',
      async: false,
      success: function(data) {

           maxcolorvalue = data.max_value;
           mincolorvalue = data.min_value;
           diffvalue = (maxcolorvalue - mincolorvalue)/8}

    });
}

var callback = function (d) {
    //d3.select("#info").text( JSON.stringify(d, null, 2) );
    //here we define the data variable
    updateMaxValue()
    provinceData = d
    update_map()
    updateChart()

}

// Load the data.
function update(year) {
    d3.select("#selectedYear").text( year );
    d3.json("/data/" + String(year), callback)
};

function updateWeer() {
    console.log("/data/" + selected_year + "/" + String(weathercondition) )
    d3.json("/data/" + selected_year + "/" + String(weathercondition), callback);
        //underneath we update the map using a function from show_map
    }

updateWeer();
