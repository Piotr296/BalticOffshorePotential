var classification = function (feature, resolution){
  const fuzzyvalue = feature.get('fuzzyvalue')
  var layercolor
  if (fuzzyvalue < 0.2) {
  layercolor='rgb(0, 255, 0)';
  }
  else if (fuzzyvalue < 0.4) {
  layercolor='rgb(148, 255, 155)';
  }
  else if (fuzzyvalue < 0.6) {
  layercolor='rgb(255, 148, 148)';
  }
  else if (fuzzyvalue < 0.8) {
  layercolor='rgb(212, 94, 94)';
  }
  else if (fuzzyvalue < 1) {
  layercolor='rgb(255, 0, 0)';
  }
  else {
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


var grid = new ol.layer.Vector({
  title: 'Grid',
  source: new ol.source.Vector({
    format: new ol.format.GeoJSON(),
    url: 'grid.geojson',
  }),
  style: classification
});


var layers = [
  new ol.layer.Tile({
    source: new ol.source.OSM()
  }),
  grid
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
outputBath.innerHTML = sliderBath.value/10;

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

function commitWeightFunction() {
  var
  sliderBathWeight = sliderBath.value/10
  sliderShipWeight = sliderShip.value/10
  sliderWindWeight = sliderWind.value/10
  console.log(sliderBathWeight, sliderShipWeight, sliderWindWeight)
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
        if (layer == grid) {
        return feature;
        }
    });
    if (feature) {
        var geometry = feature.getGeometry();
        var coord = geometry.getCoordinates();
        // Show us the propertis of the feature
        var content = '<p>' + 'Fuzzy Value: ' + feature.get('fuzzyvalue') + '</p>';

        content_element.innerHTML = content;
        overlay.setPositioning(coord);

        console.info(feature.getProperties());
        console.log(coord)
    }
});

map.on('pointermove', function(e) {
  if (e.dragging) return;

  var pixel = e.map.getEventPixel(e.originalEvent);
  var hit = false;
  e.map.forEachFeatureAtPixel(pixel, function(feature, layer) {
    if (layer === grid) {
          hit = true;
     }
  });

  e.map.getTargetElement().style.cursor = hit ? 'pointer' : '';
});
