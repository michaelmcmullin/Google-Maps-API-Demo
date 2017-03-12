/**
 * General utilities used throughout the application
 */
class Utilities {
  // Convert a string representation of a travel mode to a 
  // correctly typed TravelMode enumeration.
  static getTravelMode(mode: string) : google.maps.TravelMode {
    switch(mode.toUpperCase())
    {
      case 'DRIVING':
        return google.maps.TravelMode.DRIVING;
      case 'BICYCLING':
        return google.maps.TravelMode.BICYCLING;
      case 'TRANSIT':
        return google.maps.TravelMode.TRANSIT;
      case 'WALKING':
        return google.maps.TravelMode.WALKING;
    }
  }

  // This function will loop through the listings and hide them all.
  static hideMarkers(markers: MarkerWithInfoWindow[]) : void {
    for (var i = 0; i < markers.length; i++) {
      if (markers[i].infowindow !== null)
        markers[i].infowindow.close();
      removeInfoWindow();
      markers[i].infowindow = null;
      markers[i].marker.setMap(null);
    }
  }
}

// Class describing a marker/infowindow pair.
class MarkerWithInfoWindow {
  static map: google.maps.Map;
  marker: google.maps.Marker;
  infowindow: google.maps.InfoWindow;

  setMarker(newMarker: google.maps.Marker) : void {
    this.marker = newMarker;
  }

  clearMarkers() : void {
    this.marker = null;
    this.infowindow = null;
  }
}

