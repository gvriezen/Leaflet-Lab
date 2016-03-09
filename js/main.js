//data source: http://www.minneapolismn.gov/www/groups/public/@publicworks/documents/images/wcms1p-135319.pdf\
//tileset source: http://maps.stamen.com/toner-hybrid/#12/37.7706/-122.3782
//created by Grace Vriezen for Geography 575

//step 1: function to instantiate the Leaflet map
function createMap(){

    var southWest = L.latLng(44.893141, -93.327398),
        northEast = L.latLng(45.013166, -93.118221),
        bounds = L.latLngBounds(southWest, northEast);
    //create the map
    var map = L.map('map', {
        center: [44.963, -93.26],
        zoom: 13,
        minZoom: 12,
        maxBounds: bounds,
       
    });

   // function overlay () {
   //  var bridge = L.marker([44.980530, -93.254743]).bindPopup('Stone Arch Bridge'),
   //      midtown = L.marker([44.950503, -93.269043]).bindPopup('Midtown Greenway');
   //  var landmarks = L.layerGroup ([bridge, midtown]);

   //  var overlayMap = {
   //      "Landmarks": landmarks
   //      };
   //  L.control.layers(overlayMap).addTo(map);
   //  };

    //add Stamen base tilelayer
    L.tileLayer('http://b.tile.stamen.com/toner-hybrid/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://maps.stamen.com/toner-hybrid/#12/37.7707/-122.3783</a>'
    }).addTo(map);

    //call getData function
    getData(map);
};
//step 2: function to retrieve the data and place it on the map

   function processData(data) {
    //empty array
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
         return attributes;

            };
//get data function to retrieve geojson
function getData(map, attributes){
    //load the geoJSON data
    $.ajax("data/bikes.geojson", {
        dataType: "json",
        success: function(response){
            var attributes = processData (response);
            //call functions to create proportional symbols and sequencer
            createPropSymbols (response, map, attributes);
            createSequenceControls (map, attributes);
            createLegend (map, attributes);
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

     var SequenceControl = L.Control.extend({
        options: {
            position: 'bottomleft'
        },

        onAdd: function (map) {
            // create the control container div with a particular class name
            var container = L.DomUtil.create('div', 'sequence-control-container');

            //kill any mouse event listeners on the map
            $(container).on('mousedown dblclick', function(e){
                L.DomEvent.stopPropagation(e);
            });

            // ... initialize other DOM elements, add listeners, etc.

             $(container).append('<input class="range-slider" type="range">');
            // //reverse and skip buttons
            $(container).append('<button class="skip" id="reverse"> Reverse </button>');
            $(container).append('<button class="skip" id="forward"> Skip </button>');

            return container;
        }
    });

      map.addControl(new SequenceControl());


    // //implement slider
    //set slider attributes
    $('.range-slider').attr({
        max: 7,
        min: 0,
        value: 0,
        step: 1
    });
    // replace reverse and skip with images instead//

    $('#reverse').html('<img src="img/left.png"> <id="left">');
    $('#forward').html('<img src="img/right.png"> <id="right">');
    //click listener

    $('.skip').click(function(){
        //sequence
        //get the old index value
        var index = $('.range-slider').val();
        // increment or decrement depending on button clicked
        if ($(this).attr('id')== 'forward'){
            index++
            //step 7: if past the last attribute, wrap aroudn to the first attribute
            index = index > 7 ? 0 : index;

        } else if ($(this).attr('id') == 'reverse'){
            index --;
            //if past the first attribute, wrap around to last
            index = index < 0 ? 7 : index; 
        };
        //update slider
        $('.range-slider').val(index);

        //pass new attribute to update symbols
        updatePropSymbols (map, attributes [index]);
    });
    //input listener for slider
    $('.range-slider').on('input', function(){
        //get new index value
        var index = $(this).val();
        //pass new attribute to update symbols
        updatePropSymbols (map, attributes[index]);

    });
};

//create legend

//PSEUDO-CODE FOR ATTRIBUTE LEGEND
// 1. Add an `<svg>` element to the legend container
// 2. Add a `<circle>` element for each of three attribute values: max, mean, and min
// 3. Assign each `<circle>` element a center and radius based on the dataset max, mean, and min values of the current attribute
// 4. Create legend text to label each circle
// 5. Update circle attributes and legend text when the data attribute is changed by the user

function createLegend (map, attributes) {
    var LegendControl = L.Control.extend ({
        options: {
            position: 'bottomright'
        },
        onAdd: function (map) {
            //create the control container w/ particular class name
            var container = L.DomUtil.create ('div', 'legend-control-container');
            //script for temporal legend
            // //add city to legend content string
            // var legendContent = "<p><b>Bicyclists in:&nbsp;&nbsp;</b>" + year + ":&nbsp;&nbsp;</b>" + props[attribute] + "</p>";
            //use jquerty to append to div
            $(container).append('<div id="temporal-legend">')

            //Step 1: start attribute legend svg string
            var svg = '<svg id="attribute-legend" width="160px" height="60px">';

             //array of circle names to base loop on
            var circles = {
                max: 20, 
                mean: 40, 
                min: 60,
            };

            //Step 2: loop to add each circle and text to svg string
            for (var circle in circles){
            //circle string
            svg += '<circle class="legend-circle" id="' + circle + 
            '" fill="#4EB0AC" fill-opacity="0.8" stroke="#F1F2F2" cx="80"/>';

             //text string
            svg += '<text id="' + circle + '-text" x="130" y=" ' + circles[circle] + ' "></text>';
        };

        //close svg string
        svg += "</svg>";

             //add attribute legend svg to container
            $(container).append(svg);

            return container;
        }
    });


    map.addControl (new LegendControl());
     updateLegend(map, attributes[0]);
};

//Calculate the max, mean, and min values for a given attribute
function getCircleValues(map, attribute){
    //start with min at highest possible and max at lowest possible number
    var min = Infinity,
        max = -Infinity;

    map.eachLayer(function(layer){
        //get the attribute value
        if (layer.feature){
            var attributeValue = Number(layer.feature.properties[attribute]);

            //test for min
            if (attributeValue < min){
                min = attributeValue;
            };

            //test for max
            if (attributeValue > max){
                max = attributeValue;
            };
        };
    });

    //set mean
    var mean = (max + min) / 2;

    //return values as an object
    return {
        max: max,
        mean: mean,
        min: min
    };
};

//Update the legend with new attribute
function updateLegend(map, attribute){
    //create content for legend
    var year = attribute.split("_")[1];
    var content = "Bicyclists in " + year;
    //replace legend content
    $('#temporal-legend').html(content);

    //get the max, mean, and min values as an object
    var circleValues = getCircleValues(map, attribute);

    for (var key in circleValues) {
        //get the radius
        var radius = calcPropRadius (circleValues[key]);
        //assign cy and r attributes
        $('#' + key).attr({
            cy: 84 - radius, 
            r: radius 
        });

        //Step 4: add legend text
        $('#'+key+'-text').text(Math.round(circleValues[key]*100)/100);
    };

    updateLegend(map, attributes[1]);
};

// update prop symbols

function updatePropSymbols (map, attribute) {
            map.eachLayer (function(layer){
                if (layer.feature && layer.feature.properties[attribute]){
                    //update the layer style and popup
                    //access feature properties
                    var props = layer.feature.properties;
                    //update feature's radius based on new attribute values
                    var radius = calcPropRadius (props[attribute]);
                    layer.setRadius(radius);
                    //add city to popup content string
                    var popupContent = "<p><b>Location:&nbsp;&nbsp;</b>" + props.Location + "</p>";
                    //add formatted attribute to panel content string
                    var year = attribute.split ("_") [1];
                    popupContent += "<p><b> Bicyclist Counts in " + year + ":&nbsp;&nbsp;</b>" + props[attribute] + "</p>";
                    //replace the layer popup
                    layer.bindPopup(popupContent, {
                        offset: new L.Point (0, -radius)
                    });
                };

            }); 
                // allow legend circles to change when attribute changes

            updateLegend(map, attribute);

        };

function pointToLayer (feature, latlng, attributes) {
    var attribute = attributes [0];
    //check console
    console.log(attribute);

         //create circle marker options
            var options = {
                radius: 8,
                fillColor: "#4fb0ad",
                color: "#fff",
                weight: 2,
                opacity: 1,
                fillOpacity: 0.7
            };
            //determine value for selected attribute
            var attValue = Number(feature.properties[attribute]);
            //Step 6: Give circle markers radius based on attribute value
            options.radius = calcPropRadius (attValue);
            //create circle marker layer
            var layer = L.circleMarker (latlng, options);
            //build popup content string
            var popupContent = "<p><b>Location:&nbsp;&nbsp;</b>" +  feature.properties.Location + "</p><p><b>" +  "</b></p>";
            //add  formatted attribute to popup content string
            var year = attribute.split ("_") [1];
            popupContent += "<p><b>Bicyclist Counts in " + year + ":&nbsp;&nbsp;</b>" + feature.properties [attribute] + "</p>";
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

   function createPropSymbols (data, map, attributes) {
            L.geoJson(data, {
                pointToLayer: function (feature, latlng) {
                    return pointToLayer(feature, latlng, attributes);
                }
                
            }).addTo(map);
        };

$(document).ready(createMap);