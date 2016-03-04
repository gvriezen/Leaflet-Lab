//source data: http://www.minneapolismn.gov/www/groups/public/@publicworks/documents/images/wcms1p-135319.pdf\
//tileset source: http://maps.stamen.com/toner-hybrid/#12/37.7706/-122.3782
//created by Grace Vriezen for Geography 575


//step 1: function to instantiate the Leaflet map
function createMap(){
    //create the map
    var map = L.map('map', {
        center: [44.97, -93.27],
        zoom: 13
    });

    //add OSM base tilelayer
    L.tileLayer('http://b.tile.stamen.com/toner-hybrid/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://maps.stamen.com/toner-hybrid/#12/37.7707/-122.3783</a>'
    }).addTo(map);

    //call getData function
    getData(map);
};


//step 2: function to retrieve the data and place it on the map
function getData(map, attributes){

     //create an attributes array
            function processData(data) {
                 var attributes = [0];
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
    //load the geoJSON data
    $.ajax("data/bikes.geojson", {
        dataType: "json",
        success: function(response){
            var attributes = processData (response);
            //call functions to create proportional symbols and sequencer
            createPropSymbols (response, map, attributes);
            createSequenceControls (map, attributes);
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

function createSequenceControls(map, attributes) {
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

    // //click listener for buttons

    // $('.skip').click(function(){
    //     //sequence
    //     //get the old index value
    //     var index = $('.range-slider').val();
    //     //increment or decrement based on what button is clicked
    //     if ($(this).attr('id') == 'forward'){
    //         index++;
    //         //step 7: if past the last attribute, wrap around to first
    //         index = index > 6 ? 0 : index;
    //     } else if ($(this).attr('id') == 'reverse') {
    //         index --;
    //         //step 7: if past first attribute, wrap to last
    //         index = index < 0 ? 6: index; 
    //     };

    //     //update slider

    //     $('range-slider').val(index);
    // });
    
    // //input listener for slider

    // $('.range-slider').on('input', function(){
    //     //sequence
    //     //get new index value
    //     var index = $(this).val();

    //     function updatePropSymbols (map, attributes [index]);
    //         map.eachLayer (function(layer){
    //             if (layer.feature && layer.feature.properties[attribute]){
    //                 //update the layer style and popup
    //                 //access feature properties
    //                 var props = layer.feature.properties
    //                 //update feature's radius based on new attribute values
    //                 var radius = calcPropRadius (props[attribute]);
    //                 layer.setRadius(radius);
    //                 //add city to popup content string
    //                 var popupContent = "<p><b>Location:</b>" + props.City + "</p>";
    //                 //add formatted attribute to panel content string
    //                 var year = attribute.split ("_") [1];
    //                 popupContent += "<p><b> Bicyclist Counts in" + year + ":</b>" + props[attribute] + "</p>"
    //                 //replace the layer popup
    //                 layer.bindPopup(popupContent), {
    //                     offset: new L.Point (0, -radius)
    //                 });
    //             };
    //         });
    // });

    // console.log (slider);
};


function pointToLayer (feature, latlng, attributes) {


    var attribute = "Bic_2014";
    //check console
    console.log(attribute);

         //create circle marker options
            var options = {
                radius: 8,
                fillColor: "#000000",
                color: "#fff",
                weight: 1.5,
                opacity: 1,
                fillOpacity: 0.7
            };

        
            //determine value for selected attribute
            var attValue = Number(feature.properties[attribute]);
            //Step 6: Give circle markers radius based on attriuvte value
            options.radius = calcPropRadius (attValue);
            //create circle marker layer
            var layer = L.circleMarker (latlng, options);
            //build popup content string
            var popupContent = "<p><b>Location:</b>" +  feature.properties.Location + "</p><p><b>" + attribute + ":</b> " + feature.properties[attribute] + "</p>";
            //add  formatted attribute to popup content string
            var year = attribute.split ("_") [1];
            popupContent += "<p><b>Bike Counts in " + year + ":</b>" + feature.properties ["Bic_2014"] + "</p>";
            //bind popup to circle marker
            layer.bindPopup (popupContent, {
                offset: new L.Point (0, -options.radius)
            });
               // event listeners to open popup on hover
                layer.on({
                    mouseover: function () {
                        this.openPopup();

                    },

                    mouseout: function () {
                        this.closePopup ();
                    }
                });
            // return circle marker to L.geoJson pointToLayer option;
            return layer;


        };

// var polyline = [

// [44.970251, -93.247457],
// [44.966790, -93.238606],


// ];

// var polylineOptions = {

// };


//  L.polyline (polyline, polylineOptions).addTo(map);



   //create a Leaflet GeoJSON layer and add it to the map, point to layer 
   function createPropSymbols (data, map, attributes) {
            L.geoJson(data, {
                pointToLayer: function (feature, latlng) {
                    return pointToLayer(feature, latlng, attributes);
                }
                
            }).addTo(map);
        };

jQuery(document).ready(createMap);