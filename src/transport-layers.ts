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

    $(TransportLayers.trafficButtonId).on("click", () => {
      TransportLayers.toggleLayer(TransportLayers.trafficLayer, TransportLayers.trafficButtonId);
    });
    $(TransportLayers.transitButtonId).on("click", () => {
      TransportLayers.toggleLayer(TransportLayers.transitLayer, TransportLayers.transitButtonId);
    });
    $(TransportLayers.bicycleButtonId).on("click", () => {
      TransportLayers.toggleLayer(TransportLayers.bikeLayer, TransportLayers.bicycleButtonId);
    });
  }

  /**
   * Hide all of the transport layers, and reset their toggle buttons
   */
  public static hideLayers(): void {
    TransportLayers.trafficLayer.setMap(null);
    TransportLayers.transitLayer.setMap(null);
    TransportLayers.bikeLayer.setMap(null);

    $(TransportLayers.trafficButtonId).removeClass("selected");
    $(TransportLayers.transitButtonId).removeClass("selected");
    $(TransportLayers.bicycleButtonId).removeClass("selected");
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

  private static readonly trafficButtonId: string = "#toggle-traffic";
  private static readonly transitButtonId: string = "#toggle-transit";
  private static readonly bicycleButtonId: string = "#toggle-bicycling";
}
