
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
    show_points(d)

}

// Load the data.
function updatePointData() {
    d3.select("#selectedYear").text( year );
    d3.json("/dataCoordinates/" + String(year), callback)
    d3.select("#title").text( "Traffic accidents in Noord-Holland" );
    //function that updates map
};
//---------------------------------------
// display data on dangerpoints
//---------------------------------------
// creates info for dangerouspoints
var street ;

//standard button for dangerous accidents
var inf = L.control({position:topright})
    inf.onAdd= function(map){
        var htmlText = '<div id="dangerButton">'

    }
inf.addTo(map)




//output
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
        htmlText = htmlText.concat('<table><thead><tr><th style="align:left;border-right:1px solid black;border-bottom:1px solid black">#accidents</th><th style="align:center;border-bottom:1px solid black">address</th></tr> </thead> <tbody>')
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
                           street = data.results[0].formatted_address;
                      }
                    });

                htmlText = htmlText.concat( '<tr class="aRow" onclick="map.fitBounds( [[' +  d.dangerousPoints[i].bounds[0] + '],[' +d.dangerousPoints[i].bounds[1] + ']])" ><td style="align:center;border-right:1px solid black" >' + d.dangerousPoints[i].Number_of_accidents + ' </td><td align="center">' + street +' </td></tr>')
            }

        htmlText = htmlText.concat('</tbody></table><\div>')

        div.innerHTML = htmlText;
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
    for (var i = 0; i < d.dangerousPoints.length ; i++){

        if(d.dangerousPoints[i].bounds[0][0] == d.dangerousPoints[i].bounds[1][0] && d.dangerousPoints[i].bounds[0][1] == d.dangerousPoints[i].bounds[1][1]  ){
            rect =  new L.Circle(d.dangerousPoints[i].bounds[0], 20);
            //rect = L.rectangle(circle.getBounds(), {fillcolor: 'blue', weight: 1})
        }else{
            bounds = L.latLngBounds(d.dangerousPoints[i].bounds[0], d.dangerousPoints[i].bounds[1])
            rect = L.rectangle(bounds.pad(0.3), {fillcolor: 'blue', weight: 1})
        }
        points.push( rect)
    }

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









