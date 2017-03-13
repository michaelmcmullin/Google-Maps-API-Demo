/**
 * General utilities used throughout the application
 */
class Utilities {
  /**
   * Convert a string representation of a travel mode to a correctly typed
   * TravelMode enumeration.
   * @param mode - String representation of the required travel mode. Currently
   * supports driving, bicycling, transit and walking.
   */
  public static getTravelMode(mode: string): google.maps.TravelMode {
    switch (mode.toUpperCase()) {
      case "DRIVING":
        return google.maps.TravelMode.DRIVING;
      case "BICYCLING":
        return google.maps.TravelMode.BICYCLING;
      case "TRANSIT":
        return google.maps.TravelMode.TRANSIT;
      case "WALKING":
        return google.maps.TravelMode.WALKING;
      default:
        return null;
    }
  }

  /**
   * Loop through all the listings and hide them.
   * @param markers - An array of markers for all listings.
   */
  public static hideMarkers(markers: MarkerWithInfoWindow[]): void {
    /*for (var i = 0; i < markers.length; i++) {
      if (markers[i].infowindow !== null)
        markers[i].infowindow.close();
      removeInfoWindow();
      markers[i].infowindow = null;
      markers[i].marker.setMap(null);
    }*/
    for (const marker of markers) {
      if (marker.infowindow !== null) {
        marker.infowindow.close();
      }
      removeInfoWindow();
      marker.infowindow = null;
      marker.marker.setMap(null);
    }
  }
}
