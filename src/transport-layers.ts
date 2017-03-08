class TransportLayers {
  static map: google.maps.Map; 
  static trafficLayer: google.maps.TrafficLayer;
  static transitLayer: google.maps.TransitLayer;
  static bikeLayer: google.maps.BicyclingLayer;

  // Initial setup for transport layers
  static Initialise(map: google.maps.Map) {
    TransportLayers.map = map;
    TransportLayers.trafficLayer = new google.maps.TrafficLayer();
    TransportLayers.transitLayer = new google.maps.TransitLayer();
    TransportLayers.bikeLayer = new google.maps.BicyclingLayer();

    hideLayers();

    $('#toggle-traffic').on('click', function() { toggleTraffic(); });
    $('#toggle-transit').on('click', function() { toggleTransit(); });
    $('#toggle-bicycling').on('click', function() { toggleBicycling(); });
  }
}

// Hide all of the transport layers, and reset their toggle buttons
function hideLayers() {
  TransportLayers.trafficLayer.setMap(null);
  TransportLayers.transitLayer.setMap(null);
  TransportLayers.bikeLayer.setMap(null);

  $('#toggle-traffic').removeClass('selected');
  $('#toggle-transit').removeClass('selected');
  $('#toggle-bicycling').removeClass('selected');
}

// Toggle the traffic button and layer
function toggleTraffic(
) {
  if (TransportLayers.trafficLayer.getMap() === null) {
    hideLayers();
    TransportLayers.trafficLayer.setMap(TransportLayers.map);
    $('#toggle-traffic').addClass('selected');
  } else {
    TransportLayers.trafficLayer.setMap(null);
    $('#toggle-traffic').removeClass('selected');
  }
}

// Toggle the transit button and layer
function toggleTransit(
) {
  if (TransportLayers.transitLayer.getMap() === null) {
    hideLayers();
    TransportLayers.transitLayer.setMap(TransportLayers.map);
    $('#toggle-transit').addClass('selected');
  } else {
    TransportLayers.transitLayer.setMap(null);
    $('#toggle-transit').removeClass('selected');
  }
}

// Toggle the bicycling button and layer
function toggleBicycling(
) {
  if (TransportLayers.bikeLayer.getMap() === null) {
    hideLayers();
    TransportLayers.bikeLayer.setMap(TransportLayers.map);
    $('#toggle-bicycling').addClass('selected');
  } else {
    TransportLayers.bikeLayer.setMap(null);
    $('#toggle-bicycling').removeClass('selected');
  }
}
