var circle = new ol.style.Style({
  image: new ol.style.Circle({
    radius: 7,
    fill: new ol.style.Fill({color: 'green'}),
    stroke: new ol.style.Stroke({
      color: 'black', width: 1
    })
  })
});

var wind_farms = new ol.layer.Vector({
  title: 'Existing Wind Farms',
  source: new ol.source.Vector({
    format: new ol.format.GeoJSON(),
    url: 'static/geojson/wind_farms.geojson',
  }),
  style: circle
});

var layers = [
  new ol.layer.Tile({
    source: new ol.source.OSM()
  }),
  wind_farms
]

var map = new ol.Map({
  controls: new ol.control.defaults({
    attributionOptions: {
      collapsible: false
    }
  }).extend([
    new ol.control.ScaleLine()
  ]),
  target: 'existing_farms_map',
  layers: layers,
  view: new ol.View({
    center: ol.proj.fromLonLat([16.176330, 55.384652]),
    zoom: 6
  })
});
map.addControl(new ol.control.LayerSwitcher());

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
        if (layer == wind_farms) {
        return feature;
        }
    });
    if (feature) {
        var geometry = feature.getGeometry();
        var coord = geometry.getCoordinates();
        // Show us the property of the feature
        var content = '<p>' + 'Name: ' + feature.get('Name') + '</p>';
        content += '<p>' + 'Foundation: ' + feature.get('Foundation') + '</p>';
        content += '<p>' + 'Capacity: ' + feature.get('Capacity') + 'MWh' +'</p>';
        content_element.innerHTML = content;
        overlay.setPosition(coord);

        console.info(feature.getProperties());
    }
});

// Change the cursor if on targer layer
map.on('pointermove', function(e) {
  if (e.dragging) return;

  var pixel = e.map.getEventPixel(e.originalEvent);
  var hit = false;
  e.map.forEachFeatureAtPixel(pixel, function(feature, layer) {
    if (layer === wind_farms) {
          hit = true;
     }
  });

  e.map.getTargetElement().style.cursor = hit ? 'pointer' : '';
});
