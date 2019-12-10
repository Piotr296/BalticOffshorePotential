var classification_sustainability = function (feature, resolution){
  const fuzzyvalue = feature.get('fuzzyvalue')
  var layercolor
  if (fuzzyvalue < 0.2) {
  layercolor='rgb(0, 100, 0)';
  }
  else if (fuzzyvalue < 0.4) {
  layercolor='rgb(0, 150, 0)';
  }
  else if (fuzzyvalue < 0.6) {
  layercolor='rgb(0, 200, 0)';
  }
  else if (fuzzyvalue < 0.8) {
  layercolor='rgb(133, 200, 0)';
  }
  else if (fuzzyvalue < 1) {
  layercolor='rgb(217, 200, 0)';
  }
  else { layercolor='#ABD3DF';
  }
  return new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: 'rgba(0, 0, 0, 1)',
      width: 0.1
    }),
    fill: new ol.style.Fill({
      color: layercolor
    })
  })
};

// var classification_LCoE = function (feature, resolution){
//   const cost = feature.get('EUR/MWh')
//   var layercolor
//   if (cost < 28) {
//   layercolor='rgb(255, 100, 0)';
//   }
//   else if (cost < 45) {
//   layercolor='rgb(125, 150, 0)';
//   }
//   else if (cost < 55) {
//   layercolor='rgb(0, 200, 0)';
//   }
//   else if (cost < 65) {
//   layercolor='rgb(0, 100, 0)';
//   }
//   else {
//   layercolor='rgb(0, 50, 0)';
//   }
//   return new ol.style.Style({
//     stroke: new ol.style.Stroke({
//       color: 'rgba(0, 0, 0, 0)',
//       width: 0.1
//     }),
//     fill: new ol.style.Fill({
//       color: layercolor
//     })
//   })
// };
//
// var classification_eez = function (feature, resolution){
//   const territory1 = feature.get('territory1')
//   var layercolor
//   if (territory1 === "Germany") {
//   layercolor='rgb(0, 255, 191, 0.5)';
//   }
//   else if (territory1 === "Russia" ) {
//   layercolor='rgb(0, 255, 0, 0.5)';
//   }
//   else if (territory1 === "Sweden") {
//   layercolor='	rgb(0, 191, 255, 0.5)';
//   }
//   else if (territory1 === "Latvia") {
//   layercolor='rgb(0, 128, 255, 0.5)';
//   }
//   else if (territory1 === "Estonia") {
//   layercolor='rgb(0, 64, 255, 0.5)';
//   }
//   else if (territory1 === "Poland") {
//   layercolor='rgb	rgb(0, 0, 255, 0.5)';
//   }
//   else if (territory1 === "Finland") {
//   layercolor='rgb(64, 0, 255, 0.5)';
//   }
//   else if (territory1 === "Denmark") {
//   layercolor='rgb(128, 0, 255, 0.5)';
//   }
//   else if (territory1 === "Lithuania") {
//   layercolor='rgb(191, 0, 255, 0.5)';
//   }
//   else {
//   layercolor='rgb(0, 50, 0, 0.5)';
//   }
//   return new ol.style.Style({
//     stroke: new ol.style.Stroke({
//       color: 'rgba(0, 0, 0, 0)',
//       width: 0.5
//     }),
//     fill: new ol.style.Fill({
//       color: layercolor
//     })
//   })
// };

var sustainability = new ol.layer.Vector({
  title: 'Sustainability',
  source: new ol.source.Vector({
    format: new ol.format.GeoJSON(),
    url: 'static/geojson/output.geojson',
  }),
  style: classification_sustainability
});

// var lcoe = new ol.layer.Vector({
//   title: 'LCoE',
//   source: new ol.source.Vector({
//     format: new ol.format.GeoJSON(),
//     url: 'static/LCoE.geojson',
//   }),
//   style: classification_LCoE
// });
//
// var eez = new ol.layer.Vector({
//   title: 'EEZ',
//   source: new ol.source.Vector({
//     format: new ol.format.GeoJSON(),
//     url: 'static/EEZ _BALTIC _SEA.geojson',
//   }),
//   style: classification_eez
// });

var layers = [
  new ol.layer.Tile({
    source: new ol.source.OSM()
  }),
  sustainability
]


var map = new ol.Map({
  controls: new ol.control.defaults({
    attributionOptions: {
      collapsible: false
    }
  }).extend([
    new ol.control.ScaleLine()
  ]),
  target: 'map',
  layers: layers,
  view: new ol.View({
    center: ol.proj.fromLonLat([20.064049, 59.954122]),
    zoom: 5
  })
});

map.addControl(new ol.control.LayerSwitcher());


// Range Sliders
var sliderBath = document.getElementById("rangeBath");
var outputBath = document.getElementById("outBath");
outputBath.innerHTML = sliderBath.value/10; // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
sliderBath.oninput = function() {
  outputBath.innerHTML = this.value/10;
}

var sliderShip = document.getElementById("rangeShip");
var outputShip = document.getElementById("outShip");
outputShip.innerHTML = sliderShip.value/10;

sliderShip.oninput = function() {
  outputShip.innerHTML = this.value/10;
}

var sliderWind = document.getElementById("rangeWind");
var outputWind = document.getElementById("outWind");
outputWind.innerHTML = sliderWind.value/10;

sliderWind.oninput = function() {
  outputWind.innerHTML = this.value/10;
}

// TODO - create the one-sum assert (Fotis)

function commitWeightFunction() {
  if (sliderBath.value/10 + sliderShip.value/10 + sliderWind.value/10 == 1){
    // Create a JSON object
    var weights = [
      { "wB": sliderBath.value/10 },
      { "wS": sliderShip.value/10 },
      { "wW": sliderWind.value/10 }
    ];
    // Send POST request to receiver endpoint
    $.post("receiver", JSON.stringify(weights), function(){
      location.reload()
    }); //Just in case keep the function()

    //progress bar http://www.freakyjolly.com/simple-progress-percentage-small-bar-css-jquery/
    // or check https://loading.io/progress/
    $(document).ready(function(){
     var progressSelector = $(".progress-wrap");
     progressSelector.each(function(){
     var getPercent = $(this).attr("data-progresspercent");
     var getSpeed = parseInt($(this).attr("data-speed"));
     var getColor = $(this).attr("data-color");
     var getHeight = $(this).attr("data-height");
     var getWidth = $(this).attr("data-width");
     $(this).css({"height":getHeight,"width":getWidth});
     $(this).find(".progress-bar").css({"background-color":"#"+getColor}).animate({ width:getPercent+'%' },getSpeed)
     });
    });
    // Stop link reloading the page
   event.preventDefault();
  } else {
    alert("The weights are not equal to one!");
  }
}

// Popup
var
    container = document.getElementById('popup'),
    content_element = document.getElementById('popup-content'),
    closer = document.getElementById('popup-closer');

closer.onclick = function() {
    overlay.setPosition(undefined);
    closer.blur();
    return false;
};
var overlay = new ol.Overlay({
    element: container,
    autoPan: true,
    offset: [0, -10]
});

map.addOverlay(overlay);

map.on('click', function(evt){
    var feature = map.forEachFeatureAtPixel(evt.pixel,
      function(feature, layer) {
        // Work only if the click on the grid layer
        if (layer == sustainability) {
        return feature;
        }
    });
    if (feature) {
        // TODO - repair the pop-ups (Fotis)
        var geometry = feature.getGeometry();
        var coord = geometry.getCoordinates();
        // Show us the propertis of the feature
        var content = '<p>' + 'Sustainability: ' + ((1-feature.get('fuzzyvalue'))*100).toFixed(2).toString() + '%' + '</p>';
        content_element.innerHTML = content;
        overlay.setPosition(coord);

        console.info(feature.getProperties());
    }
});

map.on('pointermove', function(e) {
  if (e.dragging) return;

  var pixel = e.map.getEventPixel(e.originalEvent);
  var hit = false;
  e.map.forEachFeatureAtPixel(pixel, function(feature, layer) {
    if (layer === sustainability) {
          hit = true;
     }
  });

  e.map.getTargetElement().style.cursor = hit ? 'pointer' : '';
});
