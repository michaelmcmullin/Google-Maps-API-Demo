/**
 * Handle the display of traffic, transit and bike layers.
 */
class TransportLayers {
  public static map: google.maps.Map;
  public static trafficLayer: google.maps.TrafficLayer;
  public static transitLayer: google.maps.TransitLayer;
  public static bikeLayer: google.maps.BicyclingLayer;

  /**
   * Initial setup for transport layers
   * @param map - The map to use tranport layers on.
   */
  public static Initialise(map: google.maps.Map): void {
    TransportLayers.map = map;
    TransportLayers.trafficLayer = new google.maps.TrafficLayer();
    TransportLayers.transitLayer = new google.maps.TransitLayer();
    TransportLayers.bikeLayer = new google.maps.BicyclingLayer();

    TransportLayers.hideLayers();

    $(Mapping.Configuration.LAYER_TRAFFIC).on("click", () => {
      TransportLayers.toggleLayer(TransportLayers.trafficLayer, Mapping.Configuration.LAYER_TRAFFIC);
    });
    $(Mapping.Configuration.LAYER_TRANSIT).on("click", () => {
      TransportLayers.toggleLayer(TransportLayers.transitLayer, Mapping.Configuration.LAYER_TRANSIT);
    });
    $(Mapping.Configuration.LAYER_BICYCLE).on("click", () => {
      TransportLayers.toggleLayer(TransportLayers.bikeLayer, Mapping.Configuration.LAYER_BICYCLE);
    });
  }

  /**
   * Hide all of the transport layers, and reset their toggle buttons
   */
  public static hideLayers(): void {
    TransportLayers.trafficLayer.setMap(null);
    TransportLayers.transitLayer.setMap(null);
    TransportLayers.bikeLayer.setMap(null);

    $(Mapping.Configuration.LAYER_TRAFFIC).removeClass("selected");
    $(Mapping.Configuration.LAYER_TRANSIT).removeClass("selected");
    $(Mapping.Configuration.LAYER_BICYCLE).removeClass("selected");
  }

  /** Toggle a transport layer and button
   * @param layer - The type of transport layer to toggle.
   * @param buttonId - The button in the toolbar that was clicked.
   */
  public static toggleLayer(
    layer: google.maps.TrafficLayer|google.maps.TransitLayer|google.maps.BicyclingLayer,
    buttonId: string): void {
    if (layer.getMap() === null) {
      TransportLayers.hideLayers();
      layer.setMap(TransportLayers.map);
      $(buttonId).addClass("selected");
    } else {
      layer.setMap(null);
      $(buttonId).removeClass("selected");
    }
  }

}
