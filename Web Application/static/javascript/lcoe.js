var classification_LCoE = function (feature, resolution){
  const cost = feature.get('EUR/MWh')
  var layercolor
  if (cost < 28) {
  layercolor='#99ff99';
  }
  else if (cost < 45) {
  layercolor='#33ff33';
  }
  else if (cost < 55) {
  layercolor='#00e600';
  }
  else if (cost < 65) {
  layercolor='#009900';
  }
  else {
  layercolor='#003300';
  }
  return new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: 'rgba(0, 0, 0, 0)',
      width: 0.1
    }),
    fill: new ol.style.Fill({
      color: layercolor
    })
  })
};

var lcoe = new ol.layer.Vector({
  title: 'LCoE/Turbine',
  source: new ol.source.Vector({
    format: new ol.format.GeoJSON(),
    url: 'static/geojson/LCoE.geojson',
  }),
  style: classification_LCoE
});

var layers = [
  new ol.layer.Tile({
    source: new ol.source.OSM()
  }),
  lcoe
]

var map = new ol.Map({
  controls: new ol.control.defaults({
    attributionOptions: {
      collapsible: false
    }
  }).extend([
    new ol.control.ScaleLine()
  ]),
  target: 'lcoe_map',
  layers: layers,
  view: new ol.View({
    center: ol.proj.fromLonLat([20.064049, 59.954122]),
    zoom: 5
  })
});

map.addControl(new ol.control.LayerSwitcher());

//Downloading
download.href = 'static/geojson/LCoE.geojson';

// Popups
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
        // Work only if the click on the layer
        if (layer == lcoe) {
        return feature;
        }
    });
    if (feature) {
        // Show us the property of the feature
        var content = '<p>' + 'LCoE/Turbine: ' + feature.get('EUR/MWh').toFixed(2).toString() + 'EUR' +'</p>';
        content += '<p>' + 'Distance from shore: ' + feature.get('Distance').toFixed(2).toString() + 'km' +'</p>';
        content_element.innerHTML = content;
        overlay.setPosition(evt.coordinate);

        console.info(feature.getProperties());
    }
});

// Change the cursor if on targer layer
map.on('pointermove', function(e) {
  if (e.dragging) return;

  var pixel = e.map.getEventPixel(e.originalEvent);
  var hit = false;
  e.map.forEachFeatureAtPixel(pixel, function(feature, layer) {
    if (layer === lcoe) {
          hit = true;
     }
  });

  e.map.getTargetElement().style.cursor = hit ? 'pointer' : '';
});
