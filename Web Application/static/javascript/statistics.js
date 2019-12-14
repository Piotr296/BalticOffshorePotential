var circle = new ol.style.Style({
  image: new ol.style.Circle({
    radius: 7,
    fill: new ol.style.Fill({
      color: 'rgb(255, 216, 0)'
    }),
    stroke: new ol.style.Stroke({
      color: 'black',
      width: 1
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

// INTERACTIVE GRAPH

let chartConfig = {
  type: 'hbullet',
  title: {
    text: 'Installed wind power capacity in the Baltic Sea ( May 2018 )',
    fontColor: '#212121'
  },
  plot: {
    tooltip: {
      text: '%t: %v MW', //printed text in the tooltip
      borderRadius: '3px',
      borderWidth: '0px',
      fontSize: '12px'
    },
    barSpace: '4px',
    goal: {
      alpha: 0.8, //opacity
      borderWidth: '0px'
    }
  },
  plotarea: {
    margin: '100 20 60 120' //top-right-bottom-left margins
  },
  scaleX: {
    guide: {
      lineStyle: 'solid',
      lineWidth: '2px',
      visible: true
    },
    item: {
      visible: false
    },
    label: {
      text: 'Countries',
      offsetX: '-70px'
    }
  },
  scaleY: {
    guide: {
      visible: false
    },
    label: {
      text: 'Rated Power (maximum capacity) in MW'
    }
  },
  labels: [{
      text: 'Denmark',
      backgroundImage: '',
      hook: 'scale:name=scale-x,index=8',
      offsetX: '-50px',
      width: '50px',
      height: '50px'
    },
    {
      text: 'Estonia',
      backgroundImage: '',
      hook: 'scale:name=scale-x,index=7',
      offsetX: '-50px',
      width: '50px',
      height: '50px'
    },
    {
      text: 'Finland',
      backgroundImage: '',
      hook: 'scale:name=scale-x,index=6',
      offsetX: '-50px',
      width: '50px',
      height: '50px'
    },
    {
      text: 'Germany',
      backgroundImage: '',
      hook: 'scale:name=scale-x,index=5',
      offsetX: '-50px',
      width: '50px',
      height: '50px'
    },
    {
      text: 'Latvia',
      backgroundImage: '',
      hook: 'scale:name=scale-x,index=4',
      offsetX: '-50px',
      width: '50px',
      height: '50px'
    },
    {
      text: 'Lithuania',
      backgroundImage: '',
      hook: 'scale:name=scale-x,index=3',
      offsetX: '-50px',
      width: '50px',
      height: '50px'
    },
    {
      text: 'Poland',
      backgroundImage: '',
      hook: 'scale:name=scale-x,index=2',
      offsetX: '-50px',
      width: '50px',
      height: '50px'
    },
    {
      text: 'Russia',
      backgroundImage: '',
      hook: 'scale:name=scale-x,index=1',
      offsetX: '-50px',
      width: '50px',
      height: '50px'
    },
    {
      text: 'Sweden',
      backgroundImage: '',
      hook: 'scale:name=scale-x,index=0',
      offsetX: '-50px',
      width: '50px',
      height: '50px'
    }
  ],
  // Values based on "Offshore Wind and Grid in the Baltic Sea – Status and Outlook until 2050"
  //22 March 2019 Swedish Agency for Marine and Water Management RISE Research Institutes of Sweden Authors: Johannes Hüffmeier, Mats Goldberg (RISE)
  series: [{
      text: 'Operational (parks in service)',
      values: [200, 0, 0, 0, 0, 689, 90, 0, 880],
      backgroundColor: '#4ff080'
    },
    {
      text: 'Under Construction (ongoing construction work)',
      values: [0, 0, 0, 0, 0, 385, 0, 0, 598],
      backgroundColor: '#4fbff0'
    },
    {
      text: 'Approved',
      values: [2760, 0, 2400, 0, 0, 504, 0, 0, 140],
      backgroundColor: '#f04fbf'
    },
    {
      text: 'Planned',
      values: [3080, 433, 8610, 1630, 0, 271, 2070, 433, 640],
      backgroundColor: '#f0804f'
    }
  ]
};

zingchart.render({
  id: 'myChart',
  data: chartConfig
});
