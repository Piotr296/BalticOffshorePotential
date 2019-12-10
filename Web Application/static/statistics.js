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
    url: 'static/wind_farms.geojson',
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
