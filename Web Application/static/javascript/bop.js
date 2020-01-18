var classification_suitability = function (feature, resolution){
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

var suitability = new ol.layer.Vector({
  title: 'Suitability',
  source: new ol.source.Vector({
    format: new ol.format.GeoJSON(),
    url: 'static/geojson/output.geojson',
  }),
  style: classification_suitability
});

var grayOsmLayer = new ol.layer.Tile({
  source: new ol.source.OSM()
});

grayOsmLayer.on('postcompose', function(event) {
  greyscale(event.context);
});

var map = new ol.Map({
  controls: new ol.control.defaults({
    attributionOptions: {
      collapsible: false
    }
  }).extend([
    new ol.control.ScaleLine()
  ]),
  target: 'map',
  layers: [grayOsmLayer, suitability],
  view: new ol.View({
    center: ol.proj.fromLonLat([20.064049, 59.954122]),
    zoom: 5
  })
});

map.addControl(new ol.control.LayerSwitcher());

// function applies greyscale to every pixel in canvas
function greyscale(context) {
  var canvas = context.canvas;
  var width = canvas.width;
  var height = canvas.height;
  var imageData = context.getImageData(0, 0, width, height);
  var data = imageData.data;
  for (i = 0; i < data.length; i += 4) {
    var r = data[i];
    var g = data[i + 1];
    var b = data[i + 2];
    // CIE luminance for the RGB
    var v = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    // Show white color instead of black color while loading new tiles:
    if (v === 0.0)
      v = 255.0;
    data[i + 0] = v; // Red
    data[i + 1] = v; // Green
    data[i + 2] = v; // Blue
    data[i + 3] = 255; // Alpha
  }
  context.putImageData(imageData, 0, 0);
};

// Range Sliders
var sliderBath = document.getElementById("rangeBath");
var outputBath = document.getElementById("outBath");
outputBath.innerHTML = sliderBath.value*10; // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
sliderBath.oninput = function() {
  outputBath.innerHTML = this.value*10;
}

var sliderShip = document.getElementById("rangeShip");
var outputShip = document.getElementById("outShip");
outputShip.innerHTML = sliderShip.value*10;

sliderShip.oninput = function() {
  outputShip.innerHTML = this.value*10;
}

var sliderWind = document.getElementById("rangeWind");
var outputWind = document.getElementById("outWind");
outputWind.innerHTML = sliderWind.value*10;

sliderWind.oninput = function() {
  outputWind.innerHTML = this.value*10;
}

function commitWeightFunction() {
  if (sliderBath.value/10 + sliderShip.value/10 + sliderWind.value/10 == 1){
    var source = suitability.getSource();
    var features = source.getFeatures();


    features.forEach(function(feature){
      if (feature.get("pareasmean") == 0.0 && feature.get("bufformean") == 0.0 && feature.get("realbathmean") > -50 ) {
        var new_fuzzy_value = (feature.get("bathmean") * sliderBath.value/10) + (feature.get("shipmean") * sliderShip.value/10) + (feature.get("windmean") * sliderWind.value/10)
        feature.set("fuzzyvalue", new_fuzzy_value)
        console.log("Done")
      } else {
      console.log("Not Done")
      }
    });
  } else {
    alert("The weights should sum to 100%");
  }
}

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
        // Work only if the click on the grid layer
        if (layer == suitability) {
        return feature;
        }
    });
    if (feature) {
        // Show the property of the feature
        if (feature.get('pareasmean') == 1 && feature.get('bufformean') == 1) {
          var content = '<p>' + 'Protected Areas (UNESCO/Natura 2000)' + '</p>';
          content += '<p>' + 'Shore Buffor' + '</p>';
        }
        else if (feature.get('pareasmean') == 1) {
          var content = '<p>' + 'Protected Areas (UNESCO/Natura 2000)' + '</p>';
        }
        else if (feature.get('bufformean') == 1) {
          var content = '<p>' + 'Shore Buffor' + '</p>';
        }
        else {
          var content = '<p>' + '<b>Suitability: </b>' + ((1-feature.get('fuzzyvalue'))*100).toFixed(2).toString() + ' %' + '</p>';
          content += '<p>' + 'Annual Wind Speed: ' + feature.get('realwindmean').toFixed(2).toString() + ' m/s' +'</p>';
          content += '<p>' + 'Sea Depth: ' + feature.get('realbathmean').toFixed(2).toString() + ' m' +'</p>';
          content += '<p>' + 'Annual shipping density: ' + feature.get('realshipmean').toFixed(0).toString() + ' ships/year' +'</p>';
        }
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
    if (layer === suitability) {
          hit = true;
     }
  });

  e.map.getTargetElement().style.cursor = hit ? 'pointer' : '';
});
