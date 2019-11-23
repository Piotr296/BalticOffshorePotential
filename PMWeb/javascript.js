var grid = new ol.layer.Vector({
  title: 'Grid',
  source: new ol.source.Vector({
    format: new ol.format.GeoJSON(),
    url: 'grid.geojson',
  }),
  style: new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: 'rgba(255, 120, 0, 0.8)',
      width: 1
    }),
    fill: new ol.style.Fill({
      color: 'rgba(255, 120, 0, 0.1)'
    })
  })
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
var slider1 = document.getElementById("myRange1");
var output1 = document.getElementById("demo1");
output1.innerHTML = slider1.value;

slider1.oninput = function() {
  output1.innerHTML = this.value;
}

var slider2 = document.getElementById("myRange2");
var output2 = document.getElementById("demo2");
output2.innerHTML = slider2.value;

slider2.oninput = function() {
  output2.innerHTML = this.value;
}

var slider3 = document.getElementById("myRange3");
var output3 = document.getElementById("demo3");
output3.innerHTML = slider3.value;

slider3.oninput = function() {
  output3.innerHTML = this.value;
}

function commitWeightFunction() {
  console.log(slider1.value, slider2.value, slider3.value)
        }
