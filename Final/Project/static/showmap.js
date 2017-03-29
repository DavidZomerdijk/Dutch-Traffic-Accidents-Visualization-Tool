// control that shows state info on hover
var info = L.control();
var provinceData;
var maxcolorvalue = 1000;
var mincolorvalue = 0;
var diffvalue = 0;

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info');
    this.update();
    return this._div;
};


//returns information on the province back

info.update = function(props, data) {
    if( props != null){
        var accidents = data[ props.OMSCHRIJVI ]["accidents"]
        var accidents_per_capita = data[ props.OMSCHRIJVI ]["per_capita"]
        accidents_per_capita = String( Math.round(accidents_per_capita * 100 )/100) + "%"
    }

    this._div.innerHTML = (props ?  '<p style="font-size:150%!important;color:#1A1E1F">'+ props.OMSCHRIJVI  + '</p>' +
    '<p color="black">#accidents:</p>' +  '<p style="color:#1A1E1F">' +  String(accidents) + '</p>' +  '<p color="black">Accidents per capita:</p>' + '<p style="color:#1A1E1F">' + accidents_per_capita + '</p>'
            : 'Hover over a state');
};


//controls the colors for the provinces
function getColor(d) {

    return d > (maxcolorvalue-(1*diffvalue)) ? '#800026' :
            d > (maxcolorvalue-(2*diffvalue)) ? '#BD0026' :
            d > (maxcolorvalue-(3*diffvalue)) ? '#E31A1C' :
            d > (maxcolorvalue-(4*diffvalue))  ? '#FC4E2A' :
            d > (maxcolorvalue-(5*diffvalue))   ? '#FD8D3C' :
            d > (maxcolorvalue-(6*diffvalue))   ? '#FEB24C' :
            d > (maxcolorvalue-(7*diffvalue))   ? '#FED976' :
                       '#FFEDA0' ;
}

function style(feature) {
    return {
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '2',
        fillOpacity: 0.6,
        fillColor: fillProvinces(feature)
        //fillColor: getColor(feature.properties.density)
    };
}

function fillProvinces(feature) {
    //alert("fillprovincies");
    var province = feature.properties.OMSCHRIJVI
    if(provinceData[ province ]["per_capita"] == null)
    {
        provinceData[ province ]["per_capita"] = 0;
    }
    var accidents = provinceData[ province ]["per_capita"]

    return getColor(accidents);
}


function highlightFeature(e) {
    var layer = e.target;
    layer.setStyle({
        weight: 5,
        color: "white",
        dashArray: '',
        fillOpacity: 0.7
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }

    info.update(layer.feature.properties, provinceData );
}

var geojson;

function resetHighlight(e) {
    geojson.resetStyle(e.target);
    info.update(e.target.feature.properties, provinceData);
    console.log(e.target.getBounds())

}

function zoomToFeature(e) {

//here we post the json to postProvinceBounds
    $.ajax({
    url: 'http://127.0.0.1:8000/postProvinceBounds',//'postProvinceBounds',
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify( e.target.getBounds() ),
    dataType: 'json',
    success: function (e) {
        console.log(e);
    }
    });

    //route to new page that knows the province
    var location = "/pointMap/" + e.target.feature.properties.OMSCHRIJVI
//    updateLocalStorage(e.target.feature.properties.OMSCHRIJVI);
    window.location.replace( location )
}

function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        //click should go to pointmap
        click: zoomToFeature
    });
}

//controls legend
            //grades = [0, 10, 20, 50, 100, 200, 500, 1000],
var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
            labels = ['<b width="100px!important">Accidents<br> per capita (in %):</b><br>'],
            legendcolors = [(maxcolorvalue-(8*diffvalue)).toFixed(2),(maxcolorvalue-(7*diffvalue)).toFixed(2),(maxcolorvalue-(6*diffvalue)).toFixed(2),(maxcolorvalue-(5*diffvalue)).toFixed(2),(maxcolorvalue-(4*diffvalue)).toFixed(2),(maxcolorvalue-(3*diffvalue)).toFixed(2),(maxcolorvalue-(2*diffvalue)).toFixed(2),(maxcolorvalue-(1*diffvalue)).toFixed(2)],
            from, to;

    for (var i = 0; i < legendcolors.length; i++) {
        from = legendcolors[i];
        to = legendcolors[i + 1];

        labels.push(
                '<i style="background:' + getColor(from ) + '"></i> ' +
                from + "%" + (to ? '&ndash;' + to + "%" : '+'));
    }

    div.innerHTML = labels.join('<br>');
    return div;
};

function update_map(){

    if (geojson != null){
        map.removeLayer(geojson);
        }

    geojson = L.geoJson(statesData, {
        style: style,
        onEachFeature: onEachFeature
    });

    map.addLayer(geojson)

}

//From here all functions are called!

//sets the view
var map = L.map('map').setView([52.228172, 5.521980], 7);

//determines the background (thus the map)
//L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
//    maxZoom: 18,
//    //attribution: '',
//    id: 'mapbox.light'
//}).addTo(map);


info.addTo(map);


//map.attributionControl.addAttribution('Population data &copy; <a href="http://census.gov/">US Census Bureau</a>');


//adds the legend



function updateChart(){
    var accidentsArray = [];
    jQuery.each(provinceData, function(province) {
        accidentsArray.push({"provinceName": province, "values" :this});
    });

    sortedAccidentsData = accidentsArray;
    updateBarChart();
    legend.addTo(map);
}

