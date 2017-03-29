var year = "2013";
var minTijd = "0"
var maxTijd = "24";
var weer = "all"

d3.select("#slider").on("input", function() {
    year = String(+this.value);
    update();
});

var callback = function (d) {
    provinceData = d
    update_map()
    updateChart()
    console.log("provinceData is defined as:")
    console.log( provinceData )
}

// Load the data.
function update() {
    d3.json("/data/" + String(year) + "/" + String(minTijd) + "/" +String( maxTijd ) +"/" +String(weer), callback)
};


update()
