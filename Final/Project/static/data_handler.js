var year = "2013";
var minTijd = "0"
var maxTijd = "24";
var weer = "all"

//d3.select("#slider").on("input", function() {
//    year = String(+this.value);
//    update();
//});

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


//FILTERS
//standard button for dangerous accidents
var filterHeader = '<p id="filterHeader">Filters </p>'
var sliderJaar ='<div id="sliderJaar"></div>'  //'<div id="selectedYear"></div> <input type="range" value=2009 min=2003 max=2015 id="sliderYear" >';
var sliderJaarHeader = '<p><label for="jaar">Year: </label><input style="width:50px!important" type="text" id="yearValue" readonly style="border"</p>'
var sliderTijdHeader = '<p><label for="hours">Time range: </label><input  style="width:50px!important" type="text" id="amount" readonly style="border"</p>'
var sliderTijd = '<div id="slider-range"></div>';
var dropdownWeer ='<select id ="dropDownWeer" value="this.value" onchange="changeWeer(this.value)">'
dropdownWeer = dropdownWeer.concat('<option value="all" >all</option>')
dropdownWeer = dropdownWeer.concat('<option value="D">Dry</option>')
dropdownWeer = dropdownWeer.concat('<option value="R">Rain</option>')
dropdownWeer = dropdownWeer.concat('<option value="M">Mist</option>')
dropdownWeer = dropdownWeer.concat('<option value="S">Snow/Hail</option>')
dropdownWeer = dropdownWeer.concat('<option value="H">Hard wind</option>')
dropdownWeer = dropdownWeer.concat('<option value="O">unknown</option></select>')
var dropDownWeg;


var filters = L.control({position:"bottomleft"})
    filters.onAdd= function(map){
        var div = L.DomUtil.create('div', 'title')
        var htmlText = '<div id="filters"> ';
        htmlText = htmlText.concat( filterHeader )
        htmlText = htmlText.concat(sliderJaarHeader)
        htmlText = htmlText.concat( sliderJaar )
        htmlText = htmlText.concat(sliderTijdHeader)
        htmlText = htmlText.concat( sliderTijd )
        htmlText=  htmlText.concat('<br><div dropDownWeerHeader>Weather condition: </div>')
        htmlText = htmlText.concat( dropdownWeer )
        div.innerHTML = htmlText.concat("</div>");
        div.firstChild.onmousedown = div.firstChild.ondblclick = L.DomEvent.stopPropagation;
        console.log(div.innerHTML)
        return div;
    }

filters.addTo(map)

$( "#sliderJaar" ).slider({
    min:2009,
    max:2015,
    value: 2013,
    slide: function( event, ui ) {
        year = ui.value;
        update();
        $( "#yearValue" ).val(  + ui.value);
    }
});
    $( "#yearValue" ).val(  $( "#sliderJaar" ).slider( "value") )


$( function() {
$( "#slider-range" ).slider({
  range: true,
  min: 0,
  max: 24,
  values: [ 0, 24 ],
  slide: function( event, ui ) {
        minTijd = ui.values[0];
        maxTijd = ui.values[1];
        update();
    $( "#amount" ).val(  + ui.values[ 0 ] + "h -" + ui.values[ 1 ] +"h" );
  }
});
$( "#amount" ).val(  $( "#slider-range" ).slider( "values", 0 ) +
  "h - " + $( "#slider-range" ).slider( "values", 1 ) + "h");
} );



