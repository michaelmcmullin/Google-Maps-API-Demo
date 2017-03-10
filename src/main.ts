/// <reference path="lib/googlemaps.d.ts" />
/// <reference path="utilities.ts" />
/// <reference path="drawing-tools.ts" />
/// <reference path="search-places.ts" />
/// <reference path="search-time.ts" />
/// <reference path="search-zoom.ts" />
/// <reference path="map-styles.ts" />
/// <reference path="transport-layers.ts" />
/// <reference path="listings.ts" />

// Main entry point
function initMap() {
  var map: google.maps.Map;

  // Create a new blank array for all the listing markers.
  var markers: MarkerWithInfoWindow[] = [];

  // Create placemarkers array to use in multiple functions to have control
  // over the number of places that show.
  var placeMarkers: PlaceMarker[] = [];

  // Route layers
  var directionsDisplay: google.maps.DirectionsRenderer = null;
  
  var styledMapType = new google.maps.StyledMapType(
    styles,
    {name: 'Mono'}
  );

  // Constructor creates a new map - only center and zoom are required.
  map = new google.maps.Map($('#map')[0], {
      center: {lat: 40.7413549, lng: -73.9980244},
      zoom: 13,
      mapTypeControlOptions: {
        //style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
        position: google.maps.ControlPosition.TOP_RIGHT,
        mapTypeIds: ['roadmap', 'satellite', 'hybrid', 'terrain', 'mono']
      }
  });
  map.mapTypes.set('mono', styledMapType);
  map.setMapTypeId('mono');
  MarkerWithInfoWindow.map = map;
  ListingMarker.Initialise(map);
  TransportLayers.Initialise(map);
  DrawingTools.Initialise(map, markers);
  SearchPanel.Initialise(map, markers, placeMarkers, directionsDisplay);

  //$('#directions-panel .close').on('click', function() { removeDirectionsPanel(directionsDisplay, markers, map); });
  
  // The following group uses the location array to create an array of markers on initialize.
  for (var i = 0; i < locations.length; i++) {
    // Get the position from the location array.
    var position = locations[i].location;
    var title = locations[i].title;

    // Create a marker per location, and put into markers array.
    var listingMarker = new ListingMarker(position, title);

    // Push the marker to our array of markers.
    markers.push(listingMarker);
  }

  $('#toggle-listings').on('click', function() {
    toggleListings(markers, map);
  });
 
  $('#about-button').on('click', function() {
    $('#about-modal').show();
  });
  $('#about-modal .close').on('click', function() {
    $('#about-modal').fadeOut();
  });
 
}
