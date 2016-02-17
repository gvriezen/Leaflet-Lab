//this is my tutorials file

//Leaflet Quick Start Guide

//intializing the map and zoom - this creates the map and how it will first load
//set view lets you define a center and a zoom
var map = L.map('map').setView([51.505,-0.09], 13);

//Adding tile layer - displays tile layer given the url and code I added from OSM 
//addTo method is used to implement the layer
//other methods you could use include bringing to front/sending to back, changing opacity, redrawing layer, etc.

var Stamen_Watercolor = L.tileLayer('http://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.{ext}', {
	attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
	subdomains: 'abcd',
	minZoom: 1,
	maxZoom: 16,
	ext: 'png'
}).addTo(map);
//add marker - puts marker(s) on the map at various points; can have an options object too
//addTo Method is used

 var marker = L.marker([51.5,-0.09]).addTo(map);
//add circle - draws circle overlays
//addTo method is used again
var circle = L.circle ([51.508,-0.11], 500, {
	color:'red',
	fillColor: '#f03',
	fillOpacity: '0.5'
}).addTo(map);

//add polygon - addTo method

var polygon = L.polygon([
	[51.509,-0.08],
	[51.503, -0.06],
	[51.51, -0.047]

	]).addTo(map);

//popups

marker.bindPopup("<b>Look!</b><br>It's London! This is where Harry Potter goes through Platform Nine and Three Quarters.").openPopup();
circle.bindPopup("I am a circle. This represents the resurrection stone in Harry Potter");
polygon.bindPopup("I am a polygon.");


//setContent method is used - implements HTML content of the popup
//setLatLng method is used - to pinpoint geographic location of popup
//openOn is used to add popup while closing the previous popup

var popup = L.popup()
	.setLatLng ([51.5, -0.09])
	.setContent("I am a standalone popup.")
	.openOn(map);

function onMapClick (e) {
	popup
		.setLatLng(e.latlang)
		.setContent("Hi, you've clicked the map" + e.latlng.toString ())
		.openOn(map);

}
map.on('click', onMapClick);

//GeoJSON tutorial
//Geo JSON Feature

var geojsonFeature = {
    "type": "Feature",
    "properties": {
        "name": "Coors Field",
        "amenity": "Baseball Stadium",
        "popupContent": "This is where the Rockies play!"
    },
    "geometry": {
        "type": "Point",
        "coordinates": [-104.99404, 39.75621]
    }
};
//geoJSON layer

var myLines = [{
	"type": "LineString",
	"coordinates": [[-100, 40],[-105, 45][-110,55]]
},{
	"type": "LineString",
	"coordinates": [[-105, 40],[-110, 45][-115,55]]
}];



var myStyle = {
    "color": "#ff7800",
    "weight": 5,
    "opacity": 0.65
};

L.geoJson(myLines, {
    style: myStyle
}).addTo(map);

var states = [{
    "type": "Feature",
    "properties": {"party": "Republican"},
    "geometry": {
        "type": "Polygon",
        "coordinates": [[
            [-104.05, 48.99],
            [-97.22,  48.98],
            [-96.58,  45.94],
            [-104.03, 45.94],
            [-104.05, 48.99]
        ]]
    }
}, {
    "type": "Feature",
    "properties": {"party": "Democrat"},
    "geometry": {
        "type": "Polygon",
        "coordinates": [[
            [-109.05, 41.00],
            [-102.06, 40.99],
            [-102.03, 36.99],
            [-109.04, 36.99],
            [-109.05, 41.00]
        ]]
    }
}];

L.geoJson(states, {
    style: function(feature) {
        switch (feature.properties.party) {
            case 'Republican': return {color: "#ff0000"};
            case 'Democrat':   return {color: "#0000ff"};
        }
    }
}).addTo(map);

//point to layer

var geojsonMarkerOptions = {
    radius: 8,
    fillColor: "#ff7800",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
};

L.geoJson(someGeojsonFeature, {
    pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, geojsonMarkerOptions);
    }
}).addTo(map);

function onEachFeature(feature, layer) {
    // does this feature have a property named popupContent?
    if (feature.properties && feature.properties.popupContent) {
        layer.bindPopup(feature.properties.popupContent);
    }
}

var geojsonFeature = {
    "type": "Feature",
    "properties": {
        "name": "Coors Field",
        "amenity": "Baseball Stadium",
        "popupContent": "This is where the Rockies play!"
    },
    "geometry": {
        "type": "Point",
        "coordinates": [-104.99404, 39.75621]
    }
};

L.geoJson(geojsonFeature, {
    onEachFeature: onEachFeature
}).addTo(map);

//filter

var someFeatures = [{
    "type": "Feature",
    "properties": {
        "name": "Coors Field",
        "show_on_map": true
    },
    "geometry": {
        "type": "Point",
        "coordinates": [-104.99404, 39.75621]
    }
}, {
    "type": "Feature",
    "properties": {
        "name": "Busch Field",
        "show_on_map": false
    },
    "geometry": {
        "type": "Point",
        "coordinates": [-104.98404, 39.74621]
    }
}];

L.geoJson(someFeatures, {
    filter: function(feature, layer) {
        return feature.properties.show_on_map;
    }
}).addTo(map);






