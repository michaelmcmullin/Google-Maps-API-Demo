// Hide all of the transport layers, and reset their toggle buttons
function hideLayers(trafficLayer, transitLayer, bikeLayer) {
  trafficLayer.setMap(null);
  transitLayer.setMap(null);
  bikeLayer.setMap(null);

  $('#toggle-traffic').removeClass('selected');
  $('#toggle-transit').removeClass('selected');
  $('#toggle-bicycling').removeClass('selected');
}

// Toggle the traffic button and layer
function toggleTraffic(map: google.maps.Map, trafficLayer, transitLayer, bikeLayer) {
  if (trafficLayer.getMap() === null) {
    hideLayers(trafficLayer, transitLayer, bikeLayer);
    trafficLayer.setMap(map);
    $('#toggle-traffic').addClass('selected');
  } else {
    trafficLayer.setMap(null);
    $('#toggle-traffic').removeClass('selected');
  }
}

// Toggle the transit button and layer
function toggleTransit(map: google.maps.Map, trafficLayer, transitLayer, bikeLayer) {
  if (transitLayer.getMap() === null) {
    hideLayers(trafficLayer, transitLayer, bikeLayer);
    transitLayer.setMap(map);
    $('#toggle-transit').addClass('selected');
  } else {
    transitLayer.setMap(null);
    $('#toggle-transit').removeClass('selected');
  }
}

// Toggle the bicycling button and layer
function toggleBicycling(map: google.maps.Map, trafficLayer, transitLayer, bikeLayer) {
  if (bikeLayer.getMap() === null) {
    hideLayers(trafficLayer, transitLayer, bikeLayer);
    bikeLayer.setMap(map);
    $('#toggle-bicycling').addClass('selected');
  } else {
    bikeLayer.setMap(null);
    $('#toggle-bicycling').removeClass('selected');
  }
}
