// Convert a string representation of a travel mode to a 
// correctly typed TravelMode enumeration.
function getTravelMode(mode: string) {
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

// Class describing a marker/infowindow pair.
class MarkerWithInfoWindow {
  static map: google.maps.Map;
  marker: google.maps.Marker;
  infowindow: google.maps.InfoWindow;

  setMarker(newMarker: google.maps.Marker) {
    this.marker = newMarker;
  }

  clearMarkers() {
    this.marker = null;
    this.infowindow = null;
  }
}

