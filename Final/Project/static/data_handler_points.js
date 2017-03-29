
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
       var distance = $("#dangerDrop").val();
       updateDangerPoints(distance);

    });
  });


// ------------
// old functions underneath
// ------------
//GLOBAL VARIABLES
var year = "2013";
var minTijd = "0"
var maxTijd = "24";
var weer = "all"
var provinceData;


// Show the information about a particular pointMap.
var show_info = function (d) {
    d3.select("#info").text( d );
};

var callback = function (d) {
    show_points(d)

}

// Load the data.
function updatePointData() {
    d3.json( "/dataCoordinates/" + String(year) + "/" + String(minTijd) + "/" +String( maxTijd ) +"/" +String(weer), callback)
    d3.select("#title").text( "Traffic accidents in Noord-Holland" );
    //function that updates map
};

//---------------------------------------
// display data on dangerpoints
//---------------------------------------
// creates info for dangerouspoints
var street;

//standard button for dangerous accidents
var inf2 = L.control({position:"topright"})
    inf2.onAdd= function(map){
        var div = L.DomUtil.create('div', 'title')
        var htmlText = '<div id="dangerButton"> ';
        //htmlText = htmlText.concat( '<div id="dangerButton2">Find the dangerous locations in this province</div>')
        htmlText = htmlText.concat( '<div id="DangerQuestion">')
        htmlText = htmlText.concat('Cluster accidents ')
        htmlText = htmlText.concat('<select id ="dangerDrop" value="this.value">')
        htmlText = htmlText.concat('<option value="1" >1</option>')
        htmlText = htmlText.concat('<option value="20">20</option>')
        htmlText = htmlText.concat('<option value="50">50</option>')
        htmlText = htmlText.concat('<option value="100">100</option></select>')
        htmlText = htmlText.concat(' meters from each other.</div>')
        htmlText = htmlText.concat( '<input type="button" value="Find the dangerous locations in this province" id="dangerPointButton" >');
        div.innerHTML = htmlText.concat("</div>");
        div.firstChild.onmousedown = div.firstChild.ondblclick = L.DomEvent.stopPropagation;
        return div;
    }
inf2.addTo(map)

//output
var inf;
function dangerInfo(d){
    var lat;
    var lon;
    var my_json;

    if (inf != undefined) {
        map.removeControl(inf);
    }

    inf = L.control({position: "topright"});

    inf.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'title')
        var htmlText = '<div id="dangerInfoWrapper"> ';
        htmlText = htmlText.concat('<div id = dangerInfoHeader> Most Dangerous locations in '+ currentProvince + ' ordered by #accidents:</div>')
        htmlText = htmlText.concat('<table><thead><tr><th style="align:center;border-right:1px solid black;border-bottom:1px solid black">#accidents</th><th style="align:center;border-bottom:1px solid black">address</th></tr> </thead> <tbody>')
            for (var i = 0; i < d.dangerousPoints.length ; i++){

                lat = d.dangerousPoints[i].bounds[0][0] ;
                lon = d.dangerousPoints[i].bounds[0][1] ;
                gAPI =  'http://maps.googleapis.com/maps/api/geocode/json?latlng=' + lat + ',' + lon + '&sensor=true'
                //$.getJSON(gAPI).done(function(json) { street = json[0].formatted_address;});

                $.ajax({
                      url: gAPI,
                      dataType: 'json',
                      async: false,
                      success: function(data) {
                        if( typeof(data.results[0]) == "undefined"){
                            street = "unknown"
                        }else{
                           street = data.results[0].formatted_address;}
                      }
                    });

                htmlText = htmlText.concat( '<tr class="aRow" onclick="map.fitBounds( [[' +  d.dangerousPoints[i].bounds[0] + '],[' +d.dangerousPoints[i].bounds[1] + ']])" ><td style="text-align:center;border-right:1px solid black">' + d.dangerousPoints[i].Number_of_accidents + ' </td><td align="center">' + street +' </td></tr>')
            }
        htmlText = htmlText.concat('</tbody></table><\div>')


        div.innerHTML = htmlText;
        div.firstChild.onmousedown = div.firstChild.ondblclick = L.DomEvent.stopPropagation;
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
//  map.fitBounds(  d.dangerousPoints[0].bounds )
    var bounds;
    var circle;
    var numbers;
    for (var i = 0; i < d.dangerousPoints.length ; i++){

        if(d.dangerousPoints[i].bounds[0][0] == d.dangerousPoints[i].bounds[1][0] && d.dangerousPoints[i].bounds[0][1] == d.dangerousPoints[i].bounds[1][1]  ){
            rect =  new L.Circle(d.dangerousPoints[i].bounds[0], 20);
            //rect = L.rectangle(circle.getBounds(), {fillcolor: 'blue', weight: 1})
        }else{
            bounds = L.latLngBounds(d.dangerousPoints[i].bounds[0], d.dangerousPoints[i].bounds[1])
            rect = L.rectangle(bounds.pad(0.3), {fillcolor: 'blue', weight: 1});
        }

//some code to add popup
        rect.bindPopup('<p>#Accidents: ' + d.dangerousPoints[i].Number_of_accidents + ' </p>');
        rect.on('mouseover', function (e) {this.openPopup();});
        rect.on('mouseout', function (e) {this.closePopup();});
        points.push( rect)
        }

    dangerLayer = L.layerGroup(points).addTo(map)
    map.addLayer(dangerLayer)

}

function updateDangerPoints(dist){
    console.log("button is clicked");
    d3.json("/dangerousPoints/" + String(dist) , dangerCallback)

}

function changeWeer(d){
    console.log(d)
    weer = d;
    updatePointData()
}

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
        updatePointData();
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
        updatePointData();
    $( "#amount" ).val(  + ui.values[ 0 ] + "h -" + ui.values[ 1 ] +"h" );
  }
});
$( "#amount" ).val(  $( "#slider-range" ).slider( "values", 0 ) +
  "h - " + $( "#slider-range" ).slider( "values", 1 ) + "h");
} );



updatePointData(2015);









