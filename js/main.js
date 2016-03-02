//bikes geojson
//source data: http://www.minneapolismn.gov/www/groups/public/@publicworks/documents/images/wcms1p-135319.pdf

//step 1: function to instantiate the Leaflet map
function createMap(){
    //create the map
    var map = L.map('map', {
        center: [44.97, -93.27],
        zoom: 13
    });

    //add OSM base tilelayer
    L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'
    }).addTo(map);

    //call getData function
    getData(map);
};




//step 2: function to retrieve the data and place it on the map
function getData(map){
    //load the geoJSON data
    $.ajax("data/bikes.geojson", {
        dataType: "json",
        success: function(response){
            //create an attributes array
            function processData(data) {
                 var attributes = [];
                 //properties of the first feature in the dataset
                 var properties = data.features[0].properties;
                 //push each attribute name into attributes array
                 for (var attribute in properties) {
                    //only take attributes with bike count values
                    if (attribute.indexOf("Bic") > -1) {
                        attributes.push(attribute);
                    };
                 };

                 // //check result 
                 // console.log(attributes);

                 return attributes;

            };
          
            //call function to create proportional symbols
            createPropSymbols(response, map);
            createSequenceControls (map);
        }
    });
};

//calculate radius of each proportional symbol
function calcPropRadius (attValue){
    //scale factor to adjust symbol size
    var scaleFactor = 1.5;
    //area based on attribute value and scale factor
    var area = attValue * scaleFactor;
    //radius calculated based on area
    var radius = Math.sqrt(area/Math.PI);

    return radius;

};

//sequence controls

function createSequenceControls(map) {
    //implement slider
    $('#panel').append('<input class = "range-slider" type="range">');
    //set slider attributes
    $('.range-slider').attr({
        max: 7,
        min: 0,
        value: 0,
        step: 1
    });

    $('#panel').append('<button class="skip" id="reverse"> Reverse </button>');
    $('#panel').append('<button class = "skip" id="forward"> Skip </button>');

    // replace reverse and skip with images instead//

    $('#reverse').html('<img src="img/left.png"> <id="left">');
    $('#forward').html('<img src="img/right.png"> <id+"right>');
    

};



    // var attribute = "Bic_2014";

         // //create circle marker options
         //    var geojsonMarkerOptions = {
         //        radius: 8,
         //        fillColor: "#ff7800",
         //        color: "#000",
         //        weight: 1,
         //        opacity: 1,
         //        fillOpacity: 0.8
         //    };

            // //determine value for selected attribute
            // var attValue = Number(feature.properties[attribute]);
            // //Step 6: Give circle markers radius based on attriuvte value
            // geojsonMarkerOptions.radius = calcPropRadius (attValue);
            // //create circle marker layer
            // var layer = L.circleMarker (latlng, options);
            // //build popup content string
            // var popupContent = "<p><b>Location:</b>" +  feature.properties.City + "</p><p><b>" + attribute + ":</b> " + feature.properties[attribute] + "</p>";
            // //bind popup to circle marker
            // layer.bindPopup (popupContent);
            // //return circle marker to L.geoJson pointToLayer option
            // return layer;
        // };

    
//create prop symbols function

//Step 3 Add Circle markers
function createPropSymbols (data, map, attributes) {
    //Step 4: Determine which attribute to visualize
    var attribute = "Bic_2014";


             //create circle marker options
            var geojsonMarkerOptions = {
                radius: 8,
                fillColor: "#ff7800",
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            };

// function pointToLayer (feature, latlng, attributes) {
// }

//     var attribute = "Bic_2014";

//          //create circle marker options
//             var geojsonMarkerOptions = {
//                 radius: 8,
//                 fillColor: "#ff7800",
//                 color: "#000",
//                 weight: 1,
//                 opacity: 1,
//                 fillOpacity: 0.8
//             };

//             //determine value for selected attribute
//             var attValue = Number(feature.properties[attribute]);
//             //Step 6: Give circle markers radius based on attriuvte value
//             geojsonMarkerOptions.radius = calcPropRadius (attValue);
//             //create circle marker layer
//             var layer = L.circleMarker (latlng, options);
//             //build popup content string
//             var popupContent = "<p><b>Location:</b>" +  feature.properties.City + "</p><p><b>" + attribute + ":</b> " + feature.properties[attribute] + "</p>";
//             //add  formatted attribute to popup content string
//             var year = attribute.split ("_") [1];
//             popupContent += "<p><b>Population in " + year + ":</b>" + feature.properties [attribute] + "million</p>";
//             //bind popup to circle marker
//             layer.bindPopup (popupContent);
//                 event listeners to open popup on hover
//                 layer.on({
//                     mouseover: function () {
//                         this.openPopup();

//                     },

//                     mouseout: function () {
//                         this.closePopup ();
//                     }
//                 });
//             //return circle marker to L.geoJson pointToLayer option
//             return layer;
//         };


   //create a Leaflet GeoJSON layer and add it to the map, point to layer 
            L.geoJson(data, {
                pointToLayer: function (feature, latlng){

                    //Step 5: determine values for selected attribute
                    var attValue = Number(feature.properties[attribute]);
                    //examine attribute value to check if correct
                    console.log(feature.properties, attValue);
                    //Step 6: Give circle markers radius based on attriuvte value
                    geojsonMarkerOptions.radius = calcPropRadius (attValue);
                    //create circle markers
                    return L.circleMarker(latlng, geojsonMarkerOptions);
                    
                }
                
            }).addTo(map);
        };



        //end prop symbols function
   


jQuery(document).ready(createMap);