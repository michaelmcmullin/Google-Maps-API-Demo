/// <reference path="lib/googlemaps.d.ts" />
/// <reference path="MarkerWithInfoWindow.ts" />
/// <reference path="utilities.ts" />
/// <reference path="init.ts" />
/// <reference path="drawing-tools.ts" />
/// <reference path="search-places.ts" />
/// <reference path="search-time.ts" />
/// <reference path="search-zoom.ts" />
/// <reference path="transport-layers.ts" />
/// <reference path="listings.ts" />
/// <reference path="search-panel.ts" />

/**
 * The main entry point, the callback function referenced by the Google Maps
 * API.
 */
function initMap() {
  let map: google.maps.Map;

  // Create a new blank array for all the listing markers.
  let markers: MarkerWithInfoWindow[] = [];

  // Create placemarkers array to use in multiple functions to have control
  // over the number of places that show.
  let placeMarkers: PlaceMarker[] = [];

  // Route layers
  let directionsDisplay: google.maps.DirectionsRenderer = null;

  // Initialise the map and UI elements
  map = Init.Map();

  MarkerWithInfoWindow.map = map;
  ListingMarker.Initialise(map);
  TransportLayers.Initialise(map);
  DrawingTools.Initialise(map, markers);
  SearchPanel.Initialise(map, markers, placeMarkers, directionsDisplay);

  // The following group uses the location array to create an array of markers on initialize.
  for (const location of locations) {
    // Get the position from the location array.
    const position = location.location;
    const title = location.title;

    // Create a marker per location, and put into markers array.
    const listingMarker = new ListingMarker(position, title);

    // Push the marker to our array of markers.
    markers.push(listingMarker);
  }

  $("#toggle-listings").on("click", () => {
    DrawingTools.clearPolygons();
    toggleListings(markers, map);
  });

  $("#about-button").on("click", () => {
    $("#about-modal").show();
  });
  $("#about-modal .close").on("click", () => {
    $("#about-modal").fadeOut();
  });
}
