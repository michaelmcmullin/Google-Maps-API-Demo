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

// Interface describing a marker/infowindow pair.
interface MarkerWithInfoWindow {
  marker: google.maps.Marker;
  infowindow: google.maps.InfoWindow;
}

class PlaceMarker implements MarkerWithInfoWindow {
  marker: google.maps.Marker;
  infowindow: google.maps.InfoWindow;
}