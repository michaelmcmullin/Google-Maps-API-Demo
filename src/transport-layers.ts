// Class containing functionality for dealing with the display of traffic,
// transit and bike layers.
class TransportLayers {
  static map: google.maps.Map; 
  static trafficLayer: google.maps.TrafficLayer;
  static transitLayer: google.maps.TransitLayer;
  static bikeLayer: google.maps.BicyclingLayer;
  static readonly trafficButtonId: string = '#toggle-traffic';
  static readonly transitButtonId: string = '#toggle-transit';
  static readonly bicycleButtonId: string = '#toggle-bicycling';

  // Initial setup for transport layers
  static Initialise(map: google.maps.Map) {
    TransportLayers.map = map;
    TransportLayers.trafficLayer = new google.maps.TrafficLayer();
    TransportLayers.transitLayer = new google.maps.TransitLayer();
    TransportLayers.bikeLayer = new google.maps.BicyclingLayer();

    TransportLayers.hideLayers();

    $(TransportLayers.trafficButtonId).on('click', function() {
      TransportLayers.toggleLayer(TransportLayers.trafficLayer, TransportLayers.trafficButtonId);
    });
    $(TransportLayers.transitButtonId).on('click', function() {
      TransportLayers.toggleLayer(TransportLayers.transitLayer, TransportLayers.transitButtonId);
    });
    $(TransportLayers.bicycleButtonId).on('click', function() { 
      TransportLayers.toggleLayer(TransportLayers.bikeLayer, TransportLayers.bicycleButtonId);
    });
  }

  // Hide all of the transport layers, and reset their toggle buttons
  static hideLayers() {
    TransportLayers.trafficLayer.setMap(null);
    TransportLayers.transitLayer.setMap(null);
    TransportLayers.bikeLayer.setMap(null);

    $(TransportLayers.trafficButtonId).removeClass('selected');
    $(TransportLayers.transitButtonId).removeClass('selected');
    $(TransportLayers.bicycleButtonId).removeClass('selected');
  }

  // Toggle a transport layer and button
  static toggleLayer(
    layer: google.maps.TrafficLayer|google.maps.TransitLayer|google.maps.BicyclingLayer,
    buttonId: string
  ) {
    if (layer.getMap() === null) {
      TransportLayers.hideLayers();
      layer.setMap(TransportLayers.map);
      $(buttonId).addClass('selected');
    } else {
      layer.setMap(null);
      $(buttonId).removeClass('selected');
    }
  }
}