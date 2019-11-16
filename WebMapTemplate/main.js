var layers = [
  new ol.layer.Tile({
    source: new ol.source.OSM()
  })
  // here we will add the var layer that we create
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

/*window.onload = function() {
var demoTabs = new SimpleTabs(document.getElementById('demo-tabs'));
};
*/

//TABS

function openPage(pageName, elmnt, color) {
  // Hide all elements with class="tabcontent" by default */
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  // Remove the background color of all tablinks/buttons
  tablinks = document.getElementsByClassName("tablink");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].style.backgroundColor = "";
  }

  // Show the specific tab content
  document.getElementById(pageName).style.display = "block";

  // Add the specific color to the button used to open the tab content
  elmnt.style.backgroundColor = color;
}

// Get the element with id="defaultOpen" and click on it
document.getElementById("defaultOpen").click();
