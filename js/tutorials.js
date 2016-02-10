//this is my tutorials fil

//Leaflet Quick Start Guide

//intializing the map and zoom
var map = L.map('map').setView([51.505,-0.09], 13);

//Adding tile layer

var Stamen_Watercolor = L.tileLayer('http://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.{ext}', {
	attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
	subdomains: 'abcd',
	minZoom: 1,
	maxZoom: 16,
	ext: 'png'
}).addTo(map);
//add marker

 var marker = L.marker([51.5,-0.09]).addTo(map);
//add circle
var circle = L.circle ([51.508,-0.11], 500, {
	color:'red',
	fillColor: '#f03',
	fillOpacity: '0.5'
}).addTo(map);

//add polygon

var polygon = L.polygon([
	[51.509,-0.08],
	[51.503, -0.06],
	[51.51, -0.047]

	]).addTo(map);

//popups

marker.bindPopup("<b>Look!</b><br>It's London! This is where Harry Potter goes through Platform Nine and Three Quarters.").openPopup();
circle.bindPopup("I am a circle. This represents the resurrection stone in Harry Potter");
polygon.bindPopup("I am a polygon.");

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
