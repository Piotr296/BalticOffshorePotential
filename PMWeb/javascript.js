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
      color: 'rgba(0, 0, 0, 0.8)',
      width: 1
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
  view: new ol.View({ // change the center to Cologne
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
  console.log(sliderBath.value/10, sliderShip.value/10, sliderWind.value/10)
        }
