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

  //$('#directions-panel .close').on('click', function() { removeDirectionsPanel(directionsDisplay, markers, map); });
  
  $('#toggle-search').on('click', function() {
    $('#search-panel').slideToggle("fast");
  });

  // This autocomplete is for use in the search within time entry box.
  var timeAutocomplete = new google.maps.places.Autocomplete(<HTMLInputElement> $('#search-within-time-text')[0]);

  // This autocomplete is for use in the geocoder entry box.
  var zoomAutocomplete = new google.maps.places.Autocomplete(<HTMLInputElement> $('#zoom-to-area-text')[0]);

  // Bias the boundaries within the map for the zoom to area text.
  zoomAutocomplete.bindTo('bounds', map);

  // Create a searchbox in order to execute a places search
  var searchBox = new google.maps.places.SearchBox(<HTMLInputElement> $('#places-search')[0]);

  // Bias the searchbox to within the bounds of the map.
  searchBox.setBounds(map.getBounds());

  //var largeInfowindow: google.maps.InfoWindow = new google.maps.InfoWindow();
  //var largeInfowindowMarker: google.maps.Marker = null;


  // The following group uses the location array to create an array of markers on initialize.
  for (var i = 0; i < locations.length; i++) {
    // Get the position from the location array.
    var position = locations[i].location;
    var title = locations[i].title;

    // Create a marker per location, and put into markers array.
    var listingMarker = new ListingMarker(position, title);

    // Push the marker to our array of markers.
    //var mwinfowin: MarkerWithInfoWindow = new MarkerWithInfoWindow();
    //mwinfowin.marker = marker;
    markers.push(listingMarker);

    // Create an onclick, mouseover and mouseout events to open the large
    // infowindow at each marker.
    //addMarkerEvents(map, marker, largeInfowindow, largeInfowindowMarker, defaultIcon, highlightedIcon);
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
 

  $('#zoom-to-area').on('click', function(){ zoomToArea(map); });
  $('#search-within-time').on('click', function(){ searchWithinTime(markers, directionsDisplay); });

  // Listen for the event fired when the user selects a prediction from the
  // picklist and retrieve more details for that place.
  searchBox.addListener('places_changed', function() {
    searchBoxPlaces(this, placeMarkers);
  });

  // Listen for the event fired when the user selects a prediction and clicks
  // "go" more details for that place.
  $('#go-places').on('click', function(){ textSearchPlaces(placeMarkers); });

}
