/// <reference path="references.ts" />

/**
 * The main entry point, the callback function referenced by the Google Maps
 * API.
 */
function initMap() {
  let map: google.maps.Map;

  // Create a new blank array for all the listing markers.
  const markers: MarkerWithInfoWindow[] = [];

  // Create placemarkers array to use in multiple functions to have control
  // over the number of places that show.
  const placeMarkers: PlaceMarker[] = [];

  // Initialise the map and UI elements
  map = Init.Map();

  MarkerWithInfoWindow.map = map;
  ListingMarker.Initialise(map);
  TransportLayers.Initialise(map);
  DrawingTools.Initialise(map, markers);
  SearchPanel.Initialise(map, markers, placeMarkers);

  // The following group uses the location array to create an array of markers on initialize.
  for (const location of Data.locations) {
    // Get the position from the location array.
    const position = location.location;
    const title = location.title;

    // Create a marker per location, and put into markers array.
    const listingMarker = new ListingMarker(position, title);

    // Push the marker to our array of markers.
    markers.push(listingMarker);
  }

  $(Mapping.Configuration.TOGGLE_LISTINGS).on("click", () => {
    DrawingTools.clearPolygons();
    ListingMarker.toggleListings(markers, map);
  });

  $(Mapping.Configuration.ABOUT_BUTTON).on("click", () => {
    $(Mapping.Configuration.ABOUT).show();
  });
  $(Mapping.Configuration.ABOUT_CLOSE).on("click", () => {
    $(Mapping.Configuration.ABOUT).fadeOut();
  });
}
