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
