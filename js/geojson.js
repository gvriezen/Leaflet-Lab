/* Map of GeoJSON data from MegaCities.geojson */
//function to instantiate the Leaflet map
function createMap(){
    //create the map
    var map = L.map('map', {
        center: [51.505, -0.09],
        zoom: 2
    });

    //add OSM base tilelayer
    L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'
    }).addTo(map);

    //call getData function
    getData(map);
};




//function to retrieve the data and place it on the map
function getData(map){
    //load the geoJSON data and add to map
    $.ajax("data/MegaCities.geojson", {
        dataType: "json",
        success: function(response){
             //create circle marker options
            var geojsonMarkerOptions = {
                radius: 8,
                fillColor: "#ff7800",
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            };



   //create a Leaflet GeoJSON layer and add it to the map, point to layer 
            L.geoJson(response, {
                pointToLayer: function (feature, latlng){
                    return L.circleMarker(latlng, geojsonMarkerOptions);
                }
                
            }).addTo(map);
        }
    });

}




jQuery(document).ready(createMap);